const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Two kinds of account:
//   candidate: signs in with Google or email + password; browses, saves and applies.
//   employer:  a company account; signs in with its Company ID + password and
//              posts roles / reviews applicants.
// Accounts created before roles existed have role "employer" but no
// companyId; they are treated as candidates (see utils/roles.js).
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  // Not required for Google-only candidates.
  password: { type: String },
  role: { type: String, enum: ['employer', 'candidate'], default: 'candidate' },

  // Google sign-in (candidates).
  googleId: { type: String, unique: true, sparse: true },
  avatar: { type: String, default: '' },

  // Company accounts. companyId is the login handle, e.g. "zepto-hiring".
  company: { type: String, trim: true, maxlength: 80 },
  companyId: { type: String, unique: true, sparse: true, lowercase: true, trim: true },

  // Candidate profile (routes/me.js). resumeText feeds the match score.
  headline: { type: String, default: '', maxlength: 120 },
  location: { type: String, default: '', maxlength: 80 },
  skills: { type: [String], default: [] },
  resumeText: { type: String, default: '', maxlength: 20000 },
  resumeFileName: { type: String, default: '' },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (plain) {
  if (!this.password) return false;   // Google-only account
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('User', userSchema);
