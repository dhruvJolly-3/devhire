// Employer dashboard: the signed-in user's own listings and their applicants.
const router = require('express').Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const Job = require('../models/Job');
const Application = require('../models/Application');

const { requirePoster } = require('../utils/roles');

router.use(auth, requirePoster);

const STATUSES = ['New', 'Shortlisted', 'Rejected'];

// GET /api/employer/jobs → my listings, newest first, each with applicant counts.
router.get('/jobs', async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 }).lean();
    const counts = await Application.aggregate([
      { $match: { job: { $in: jobs.map(j => j._id) }, appliedAt: { $ne: null } } },
      { $group: { _id: { job: '$job', status: '$status' }, n: { $sum: 1 } } },
    ]);
    const byJob = {};
    for (const c of counts) {
      const k = String(c._id.job);
      byJob[k] = byJob[k] || { total: 0, New: 0, Shortlisted: 0, Rejected: 0 };
      byJob[k][c._id.status || 'New'] += c.n;
      byJob[k].total += c.n;
    }
    res.json(jobs.map(j => ({ ...j, applicants: byJob[String(j._id)] || { total: 0, New: 0, Shortlisted: 0, Rejected: 0 } })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Loads a job only if the signed-in user posted it.
async function ownJob(req, res, id) {
  const job = mongoose.isValidObjectId(id) ? await Job.findById(id).select('postedBy') : null;
  if (!job) { res.status(404).json({ message: 'Job not found' }); return null; }
  if (String(job.postedBy) !== String(req.user._id)) { res.status(403).json({ message: 'Not your listing' }); return null; }
  return job;
}

// GET /api/employer/jobs/:id/applicants → applicants, best match first.
router.get('/jobs/:id/applicants', async (req, res) => {
  try {
    if (!(await ownJob(req, res, req.params.id))) return;
    const rows = await Application.find({ job: req.params.id, appliedAt: { $ne: null } })
      .sort({ match: -1, appliedAt: -1 })
      .populate('user', 'name headline skills')
      .lean();
    res.json(rows.filter(r => r.user).map(r => ({
      id: r._id, name: r.user.name, headline: r.user.headline || '', skills: (r.user.skills || []).slice(0, 5),
      match: r.match ?? null, status: r.status || 'New', appliedAt: r.appliedAt,
    })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/employer/applications/:id { status } — shortlist / reject / reset.
router.patch('/applications/:id', async (req, res) => {
  try {
    const { status } = req.body;
    if (!STATUSES.includes(status)) return res.status(400).json({ message: 'Invalid status' });
    const app = mongoose.isValidObjectId(req.params.id) ? await Application.findById(req.params.id) : null;
    if (!app) return res.status(404).json({ message: 'Application not found' });
    if (!(await ownJob(req, res, app.job))) return;
    app.status = status;
    await app.save();
    res.json({ id: app._id, status: app.status });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
