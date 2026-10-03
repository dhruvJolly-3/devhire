// The signed-in candidate's saved and applied jobs.
const router = require('express').Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const Job = require('../models/Job');
const Application = require('../models/Application');
const { matchScore } = require('../utils/match');
const { requireApplicant } = require('../utils/roles');

router.use(auth);

const JOB_FIELDS = 'title company location city type tags salary expLevel source applyUrl domain color logoInitials postedAt createdAt';

// Loads the job named in the URL, or answers 404.
async function findJob(req, res) {
  const { jobId } = req.params;
  const job = mongoose.isValidObjectId(jobId) ? await Job.findById(jobId).select('_id applyUrl tags') : null;
  if (!job) res.status(404).json({ message: 'Job not found' });
  return job;
}

// GET /api/me/jobs → { saved: [job…], applied: [{ job, appliedAt }…] }
router.get('/jobs', async (req, res) => {
  try {
    const rows = await Application.find({ user: req.user._id })
      .sort({ updatedAt: -1 })
      .populate('job', JOB_FIELDS)
      .lean();
    const live = rows.filter(r => r.job);   // skip jobs that have since been removed
    res.json({
      saved: live.filter(r => r.saved).map(r => r.job),
      applied: live.filter(r => r.appliedAt).map(r => ({ job: r.job, appliedAt: r.appliedAt, status: r.status || 'New' })),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/me/saved/:jobId — save; DELETE — unsave.
router.post('/saved/:jobId', async (req, res) => {
  try {
    if (!(await findJob(req, res))) return;
    await Application.updateOne(
      { user: req.user._id, job: req.params.jobId },
      { $set: { saved: true } },
      { upsert: true },
    );
    res.status(201).json({ saved: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/saved/:jobId', async (req, res) => {
  try {
    await Application.updateOne({ user: req.user._id, job: req.params.jobId }, { $set: { saved: false } });
    res.json({ saved: false });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/me/applied/:jobId — record an application (idempotent).
router.post('/applied/:jobId', requireApplicant, async (req, res) => {
  try {
    const job = await findJob(req, res);
    if (!job) return;
    const existing = await Application.findOne({ user: req.user._id, job: job._id });
    if (existing?.appliedAt) return res.status(200).json({ appliedAt: existing.appliedAt, status: existing.status });
    // First application: stamp it and score the fit for the employer.
    const row = await Application.findOneAndUpdate(
      { user: req.user._id, job: job._id },
      { $set: { appliedAt: new Date(), status: 'New', match: matchScore(req.user, job) } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    res.status(201).json({ appliedAt: row.appliedAt, status: row.status });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Profile & resume ───────────────────────────────────────────────────────
const multer = require('multer');
// The package's index.js runs a self-test on load; the lib file does not.
const pdfParse = require('pdf-parse/lib/pdf-parse.js');
const User = require('../models/User');

const MAX_RESUME_CHARS = 20000;
const PROFILE_FIELDS = 'name email headline location skills resumeText resumeFileName';

// Resume files are read in memory and never written to disk.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => cb(null, /\.(pdf|txt)$/i.test(file.originalname)),
});

// GET /api/me/profile
router.get('/profile', async (req, res) => {
  const user = await User.findById(req.user._id).select(PROFILE_FIELDS).lean();
  res.json(user);
});

// PUT /api/me/profile { name, headline, location, skills, resumeText }
router.put('/profile', async (req, res) => {
  try {
    const { name, headline, location, skills, resumeText } = req.body;
    const update = {};
    if (typeof name === 'string' && name.trim()) update.name = name.trim().slice(0, 80);
    if (typeof headline === 'string') update.headline = headline.trim().slice(0, 120);
    if (typeof location === 'string') update.location = location.trim().slice(0, 80);
    if (Array.isArray(skills)) update.skills = skills.map(s => String(s).trim()).filter(Boolean).slice(0, 30);
    if (typeof resumeText === 'string') update.resumeText = resumeText.slice(0, MAX_RESUME_CHARS);
    const user = await User.findByIdAndUpdate(req.user._id, { $set: update }, { new: true, runValidators: true })
      .select(PROFILE_FIELDS).lean();
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST /api/me/resume (multipart, field "resume") — PDF or .txt → text.
router.post('/resume', (req, res) => {
  upload.single('resume')(req, res, async (err) => {
    if (err?.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ message: 'Resume must be under 2 MB' });
    if (err) return res.status(400).json({ message: 'Upload failed' });
    if (!req.file) return res.status(400).json({ message: 'Upload a .pdf or .txt file' });
    try {
      const isPdf = /\.pdf$/i.test(req.file.originalname);
      const raw = isPdf ? (await pdfParse(req.file.buffer)).text : req.file.buffer.toString('utf8');
      const text = raw.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim().slice(0, MAX_RESUME_CHARS);
      if (!text) return res.status(400).json({ message: 'No text found — is this a scanned PDF? Paste the text instead.' });
      const user = await User.findByIdAndUpdate(req.user._id,
        { $set: { resumeText: text, resumeFileName: req.file.originalname.slice(0, 120) } },
        { new: true }).select(PROFILE_FIELDS).lean();
      res.json(user);
    } catch {
      res.status(400).json({ message: 'Could not read that PDF. Try another file or paste the text.' });
    }
  });
});

module.exports = router;
