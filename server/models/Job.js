const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  description: { type: String, required: true },
  salary: { type: String },
  location: { type: String, default: 'Remote' },

  // Design fields — all optional so older documents stay valid.
  tags: { type: [String], default: [] },
  type: { type: String, enum: ['Remote', 'Hybrid', 'Onsite'], default: 'Remote' },
  expLevel: { type: String, default: '' },
  domain: { type: String, default: '' },
  color: { type: String, default: '' },
  logoInitials: { type: String, default: '' },

  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // Where the listing came from. 'devhire' = posted on this site; anything
  // else was imported by services/jobSync.js and has no postedBy.
  source: { type: String, default: 'devhire' },
  externalId: { type: String },   // the job's id at its source
  applyUrl: { type: String, default: '' },
  postedAt: { type: Date },       // original publish date at the source
  city: { type: String, default: 'Other' },  // canonical city for filtering (utils/jobText.js)
}, { timestamps: true });

// One document per external job, so a re-sync updates instead of duplicating.
jobSchema.index(
  { source: 1, externalId: 1 },
  { unique: true, partialFilterExpression: { externalId: { $type: 'string' } } },
);

module.exports = mongoose.model('Job', jobSchema);
