// One-click demo accounts for people trying DevHire (e.g. recruiters
// reviewing the project). ensureDemo() makes sure a demo company with live
// listings, a few candidates who applied, and a demo candidate exist — using
// the same models and match score as the real app — then returns the demo users.
// It is idempotent: anything missing (say, a deleted listing) is recreated.
const crypto = require('crypto');
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const { matchScore } = require('../utils/match');
const { cityOf } = require('../utils/jobText');

const COMPANY = { company: 'Acme Labs', companyId: 'devhire-demo', name: 'Riya Sharma (demo)', email: 'demo-company@devhire.demo' };

const JOBS = [
  { key: 'fe', title: 'Frontend Engineer (React)', salary: '₹12–18L', location: 'Bangalore', type: 'Hybrid', expLevel: '1–3y',
    tags: ['React', 'TypeScript', 'CSS', 'Redux'],
    description: 'Build the customer dashboard used by 50,000 small businesses.\n- Ship React features end to end\n- Own performance and accessibility\n- Work closely with design\n\nDemo listing for exploring DevHire.' },
  { key: 'be', title: 'Backend Engineer (Node.js)', salary: '₹14–22L', location: 'Remote', type: 'Remote', expLevel: '2–4y',
    tags: ['Node.js', 'Express', 'MongoDB', 'AWS'],
    description: 'Design the APIs behind our invoicing platform.\n- Build REST APIs in Node.js and Express\n- Model data in MongoDB\n- Deploy and monitor on AWS\n\nDemo listing for exploring DevHire.' },
];

// Applicants with different fits so the ranking means something.
const APPLICANTS = [
  { email: 'priya@devhire.demo', name: 'Priya Nair', headline: 'Frontend developer · 3 years · React + TypeScript', location: 'Bangalore',
    skills: ['React', 'TypeScript', 'Redux', 'CSS', 'Jest'], applyTo: { fe: 'Shortlisted' },
    resumeText: 'Frontend developer with 3 years of experience building React and TypeScript apps. Led a Redux migration, improved Lighthouse performance from 62 to 94, and built a component library in CSS and Storybook.' },
  { email: 'arjun@devhire.demo', name: 'Arjun Mehta', headline: 'Full-stack MERN developer', location: 'Pune',
    skills: ['React', 'Node.js', 'Express', 'MongoDB'], applyTo: { fe: 'New', be: 'New' },
    resumeText: 'Full-stack developer. Built a MERN job board and a REST API in Node.js and Express with MongoDB. Deployed on Render and Vercel.' },
  { email: 'kabir@devhire.demo', name: 'Kabir Singh', headline: 'Backend engineer · Node.js, AWS', location: 'Gurugram',
    skills: ['Node.js', 'Express', 'MongoDB', 'AWS', 'Docker'], applyTo: { be: 'New' },
    resumeText: 'Backend engineer with 2 years on Node.js and Express services, MongoDB data modelling and AWS deployments with Docker.' },
  { email: 'sana@devhire.demo', name: 'Sana Qureshi', headline: 'Fresher · Python and data', location: 'Delhi',
    skills: ['Python', 'SQL', 'Pandas'], applyTo: { fe: 'Rejected' },
    resumeText: 'Recent graduate interested in data. Projects in Python, SQL and Pandas.' },
];

// The account a visitor uses when they explore as a candidate.
const CANDIDATE = { email: 'demo-candidate@devhire.demo', name: 'Demo Candidate', headline: 'MERN developer · React, Node.js, MongoDB', location: 'Noida',
  skills: ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript'],
  resumeText: 'Full-stack MERN developer. Built a fitness tracker PWA with JWT auth and a job board with an employer dashboard. Comfortable with REST APIs, MongoDB schema design and React.' };

// Demo accounts can't be signed into with a password: only through /auth/demo.
const randomPassword = () => crypto.randomBytes(24).toString('hex');

async function upsertUser(fields) {
  const existing = await User.findOne({ email: fields.email });
  if (existing) return existing;
  try {
    return await User.create({ ...fields, password: randomPassword() });
  } catch (err) {
    if (err.code === 11000) return User.findOne({ email: fields.email });   // created meanwhile
    throw err;
  }
}

// Two visitors clicking at once share one seeding run instead of racing.
let running = null;
function ensureDemo() {
  if (!running) running = seed().finally(() => { running = null; });
  return running;
}

async function seed() {
  const company = await upsertUser({ ...COMPANY, role: 'employer' });

  const jobs = {};
  for (const { key, ...j } of JOBS) {
    jobs[key] = (await Job.findOne({ postedBy: company._id, title: j.title }))
      || await Job.create({ ...j, company: COMPANY.company, city: cityOf(j.location), postedBy: company._id });
  }

  for (const { applyTo, ...a } of APPLICANTS) {
    const user = await upsertUser({ ...a, role: 'candidate' });
    for (const [key, status] of Object.entries(applyTo)) {
      const job = jobs[key];
      // Only fill in what's missing, so a visitor's shortlist/reject clicks stay.
      await Application.updateOne(
        { user: user._id, job: job._id },
        { $setOnInsert: { appliedAt: new Date(Date.now() - (Math.random() * 3 + 0.2) * 86400000), status, match: matchScore(user, job) } },
        { upsert: true },
      );
    }
  }

  const candidate = await upsertUser({ ...CANDIDATE, role: 'candidate' });
  // Give the demo candidate a saved job and one application, so "My jobs" isn't empty.
  await Application.updateOne({ user: candidate._id, job: jobs.fe._id },
    { $setOnInsert: { saved: true } }, { upsert: true });
  await Application.updateOne({ user: candidate._id, job: jobs.be._id },
    { $setOnInsert: { appliedAt: new Date(), status: 'New', match: matchScore(candidate, jobs.be) } }, { upsert: true });

  return { company, candidate };
}

module.exports = { ensureDemo };
