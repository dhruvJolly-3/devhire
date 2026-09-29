const router = require('express').Router();
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const Job = require('../models/Job');
const { cityOf } = require('../utils/jobText');

const SUMMARY_CHARS = 280;

// GET all jobs (public)
// ?source=devhire → only jobs posted here; ?source=external → only imported.
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.source === 'devhire') filter.source = { $in: ['devhire', null] };
    if (req.query.source === 'external') filter.source = { $nin: ['devhire', null] };
    // The list only needs a short summary; the detail page fetches the full
    // description. Keeps the response small with hundreds of jobs.
    const jobs = await Job.find(filter).sort({ postedAt: -1, createdAt: -1 }).lean();
    res.json(jobs.map(j => ({
      ...j,
      city: j.city && j.city !== 'Other' ? j.city : cityOf(j.location),
      description: (j.description || '').slice(0, SUMMARY_CHARS),
    })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single job (public)
router.get('/:id', async (req, res) => {
  try {
    const job = mongoose.isValidObjectId(req.params.id) ? await Job.findById(req.params.id) : null;
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create job (protected — only logged-in employer can post)
router.post('/', auth, async (req, res) => {
  try {
    const {
      title, company, description, salary, location,
      tags, type, expLevel, domain, color, logoInitials
    } = req.body;
    const job = await Job.create({
      title, company, description, salary, location,
      tags, type, expLevel, domain, color, logoInitials,
      city: cityOf(location),
      postedBy: req.user._id
    });
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update job (protected — only the poster can edit)
router.put('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (!job.postedBy || job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const EDITABLE = ['title', 'company', 'description', 'salary', 'location', 'tags', 'type', 'expLevel', 'domain', 'color', 'logoInitials'];
    for (const key of EDITABLE) if (req.body[key] !== undefined) job[key] = req.body[key];
    job.city = cityOf(job.location);
    await job.save();
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE job (protected — only the poster can delete)
router.delete('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (!job.postedBy || job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await job.deleteOne();
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
