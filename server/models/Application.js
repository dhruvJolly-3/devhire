const mongoose = require('mongoose');

// A candidate's relationship with a job: saved for later and/or applied.
const applicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  saved: { type: Boolean, default: false },
  appliedAt: { type: Date },
  // Set when the candidate applies (utils/match.js); the employer moves
  // the application through New → Shortlisted / Rejected.
  status: { type: String, enum: ['New', 'Shortlisted', 'Rejected'], default: 'New' },
  match: { type: Number, min: 0, max: 100 },
}, { timestamps: true });

// The employer dashboard lists a job's applicants.
applicationSchema.index({ job: 1, appliedAt: -1 });

applicationSchema.index({ user: 1, job: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
