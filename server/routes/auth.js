const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const auth = require('../middleware/auth');
const rateLimit = require('../middleware/rateLimit');
const { isCompany } = require('../utils/roles');
const { ensureDemo } = require('../services/demo');

const MIN = 60 * 1000;
const lower = (s) => String(s || '').trim().toLowerCase();
// Password guessing: 10 tries per account per IP, 50 per IP, every 15 minutes.
const loginLimit = [
  rateLimit({ windowMs: 15 * MIN, max: 50, key: (req) => `login-ip:${req.ip}` }),
  rateLimit({ windowMs: 15 * MIN, max: 10, key: (req) => `login:${req.ip}:${lower(req.body?.email || req.body?.companyId)}` }),
];
const registerLimit = rateLimit({ windowMs: 60 * MIN, max: 20, key: (req) => `register:${req.ip}` });
const googleLimit = rateLimit({ windowMs: 15 * MIN, max: 30, key: (req) => `google:${req.ip}` });

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// What the client keeps about the signed-in user (also returned by GET /me).
const publicUser = (u) => ({
  id: u._id, name: u.name, email: u.email, role: u.role,
  company: u.company || '', companyId: u.companyId || '', avatar: u.avatar || '',
  isCompany: isCompany(u),
  isDemo: /@devhire\.demo$/.test(u.email || ''),
});
const authPayload = (u) => ({ token: sign(u._id), user: publicUser(u) });

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Company IDs: 3–30 chars, lowercase letters, digits and hyphens, e.g. "zepto-hiring".
const COMPANY_ID = /^[a-z0-9][a-z0-9-]{2,29}$/;

// ── Candidates: email + password ────────────────────────────────────────────
router.post('/register', registerLimit, async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = lower(req.body.email);
    const { password } = req.body;
    if (!name) return res.status(400).json({ message: 'Add your name to create an account' });
    if (!EMAIL.test(email)) return res.status(400).json({ message: 'Enter a valid email' });
    if (typeof password !== 'string' || password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
    if (await findByEmail(email)) return res.status(400).json({ message: 'Email already in use' });
    const user = await User.create({ name, email, password, role: 'candidate' });
    res.status(201).json(authPayload(user));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Emails are stored lowercase now; accounts made earlier may have capitals.
const escapeRegex = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const findByEmail = async (email) => (await User.findOne({ email }))
  || User.findOne({ email: new RegExp(`^${escapeRegex(email)}$`, 'i') });

router.post('/login', loginLimit, async (req, res) => {
  try {
    const user = await findByEmail(lower(req.body.email));
    if (user && !user.password && user.googleId) {
      return res.status(400).json({ message: 'This account uses Google sign-in. Use “Continue with Google”.' });
    }
    if (!user || !(await user.comparePassword(String(req.body.password || '')))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    if (isCompany(user)) {
      return res.status(400).json({ message: 'This is a company account. Sign in with your Company ID.' });
    }
    res.json(authPayload(user));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Candidates: Google ──────────────────────────────────────────────────────
// The browser gets an ID token from Google Identity Services and posts it
// here as `credential`. We verify it with Google, then find or create the
// candidate. Needs GOOGLE_CLIENT_ID (same value as the client's
// VITE_GOOGLE_CLIENT_ID).
router.post('/google', googleLimit, async (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) return res.status(503).json({ message: 'Google sign-in is not configured on the server' });
  if (typeof req.body.credential !== 'string' || !req.body.credential) {
    return res.status(400).json({ message: 'Missing Google credential' });
  }
  let p;
  try {
    const ticket = await new OAuth2Client(clientId).verifyIdToken({ idToken: req.body.credential, audience: clientId });
    p = ticket.getPayload();
  } catch {
    return res.status(401).json({ message: 'Google sign-in failed. Please try again.' });
  }
  if (!p?.email || !p.email_verified) return res.status(401).json({ message: 'Your Google email is not verified' });

  try {
    const email = lower(p.email);
    let user = (await User.findOne({ googleId: p.sub })) || (await findByEmail(email));
    if (user && isCompany(user)) {
      return res.status(403).json({ message: 'This email belongs to a company account. Sign in with your Company ID.' });
    }
    if (!user) {
      user = await User.create({ name: p.name || email.split('@')[0], email, googleId: p.sub, avatar: p.picture || '', role: 'candidate' });
      return res.status(201).json(authPayload(user));
    }
    // Existing email + password candidate: link Google so either way works.
    if (!user.googleId) {
      user.googleId = p.sub;
      if (!user.avatar && p.picture) user.avatar = p.picture;
      await user.save();
    }
    res.json(authPayload(user));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Companies: Company ID + password ────────────────────────────────────────
router.post('/company/register', registerLimit, async (req, res) => {
  try {
    const company = String(req.body.company || '').trim();
    const companyId = lower(req.body.companyId);
    const name = String(req.body.name || '').trim();
    const email = lower(req.body.email);
    const { password } = req.body;
    if (!company) return res.status(400).json({ message: 'Add your company name' });
    if (!COMPANY_ID.test(companyId)) return res.status(400).json({ message: 'Company ID must be 3–30 characters: lowercase letters, numbers and hyphens' });
    if (!name) return res.status(400).json({ message: 'Add your name' });
    if (!EMAIL.test(email)) return res.status(400).json({ message: 'Enter a valid work email' });
    if (typeof password !== 'string' || password.length < 8) return res.status(400).json({ message: 'Company passwords must be at least 8 characters' });
    if (await User.findOne({ companyId })) return res.status(400).json({ message: 'That Company ID is taken. Try another.' });
    if (await findByEmail(email)) return res.status(400).json({ message: 'Email already in use' });
    const user = await User.create({ name, email, password, role: 'employer', company, companyId });
    res.status(201).json(authPayload(user));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/company/login', loginLimit, async (req, res) => {
  try {
    const user = await User.findOne({ companyId: lower(req.body.companyId) });
    if (!user || !(await user.comparePassword(String(req.body.password || '')))) {
      return res.status(401).json({ message: 'Invalid Company ID or password' });
    }
    res.json(authPayload(user));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Demo ────────────────────────────────────────────────────────────────────
// POST /api/auth/demo { as: 'company' | 'candidate' } → signs into a ready-made
// demo account (see services/demo.js). DEMO=off disables it.
const demoLimit = rateLimit({ windowMs: 15 * MIN, max: 30, key: (req) => `demo:${req.ip}` });
router.post('/demo', demoLimit, async (req, res) => {
  if (process.env.DEMO === 'off') return res.status(404).json({ message: 'Demo is turned off' });
  try {
    const { company, candidate } = await ensureDemo();
    res.json(authPayload(req.body.as === 'company' ? company : candidate));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/auth/me → the signed-in user (the client refreshes its copy on load).
router.get('/me', auth, (req, res) => res.json({ user: publicUser(req.user) }));

module.exports = router;
