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

  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
