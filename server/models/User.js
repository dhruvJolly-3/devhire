const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['employer', 'candidate'], default: 'employer' },

  // Candidate profile (routes/me.js). resumeText feeds the AI match score.
  headline: { type: String, default: '', maxlength: 120 },
  location: { type: String, default: '', maxlength: 80 },
  skills: { type: [String], default: [] },
  resumeText: { type: String, default: '', maxlength: 20000 },
  resumeFileName: { type: String, default: '' },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('User', userSchema);
