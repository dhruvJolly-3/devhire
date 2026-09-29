const mongoose = require('mongoose');

// A candidate's relationship with a job: saved for later and/or applied.
const applicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  saved: { type: Boolean, default: false },
  appliedAt: { type: Date },
}, { timestamps: true });

applicationSchema.index({ user: 1, job: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
