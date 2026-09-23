/**
 * Optional demo seeder — fills the board with the design's sample roles so the
 * carousel, filters and marquee have something to show.
 *
 *   node server/seed.js <email-of-existing-user>
 *
 * Insert-only: it skips any role whose title+company already exists and never
 * deletes or modifies existing documents.
 */
require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Job = require('./models/Job');
const User = require('./models/User');

const JOBS = [
  { title:'Senior React Engineer', company:'Zepto', location:'Bangalore', type:'Remote', tags:['React','TypeScript','Redux','Tailwind'], expLevel:'3–5y exp', color:'#FF5A1F', logoInitials:'Z', domain:'zepto.in' },
  { title:'Full-Stack Developer', company:'Razorpay', location:'Bangalore', type:'Hybrid', tags:['Node.js','React','MongoDB','Redis'], expLevel:'2–4y exp', color:'#2563EB', logoInitials:'R', domain:'razorpay.com' },
  { title:'AI Product Engineer', company:'CRED', location:'Remote', type:'Remote', tags:['Python','LangChain','React','OpenAI'], expLevel:'2–4y exp', color:'#1C1C1E', logoInitials:'C', domain:'cred.club' },
  { title:'Frontend Engineer (Fresher)', company:'Postman', location:'Bangalore', type:'Onsite', tags:['React','TypeScript','CSS'], expLevel:'0–1y exp', color:'#E8540B', logoInitials:'P', domain:'postman.com' },
  { title:'Backend Developer', company:'Swiggy', location:'Hyderabad', type:'Remote', tags:['Node.js','Go','PostgreSQL','Kafka'], expLevel:'2–4y exp', color:'#FC8019', logoInitials:'S', domain:'swiggy.com' },
  { title:'ML Engineer', company:'Meesho', location:'Bangalore', type:'Hybrid', tags:['Python','PyTorch','AWS','Airflow'], expLevel:'2–5y exp', color:'#8B5CF6', logoInitials:'M', domain:'meesho.com' },
  { title:'Junior React Developer', company:'Zomato', location:'Gurgaon', type:'Onsite', tags:['React','JavaScript','CSS'], expLevel:'0–2y exp', color:'#DC2626', logoInitials:'Z', domain:'zomato.com' },
  { title:'Full-Stack (MERN)', company:'PhonePe', location:'Remote', type:'Remote', tags:['React','Node','MongoDB','Express'], expLevel:'1–3y exp', color:'#6D28D9', logoInitials:'P', domain:'phonepe.com' },
];

const describe = (j) =>
  `${j.company} is hiring a ${j.title}. You'll own features end to end alongside product and design, working primarily in ${j.tags.slice(0, 2).join(' and ')}.\n\nThis is a ${j.type.toLowerCase()} role based in ${j.location}. Demo listing seeded for local development.`;

(async () => {
  await connectDB();

  const email = process.argv[2];
  const user = email ? await User.findOne({ email }) : await User.findOne();
  if (!user) {
    console.error('No user found. Register one first, or pass an existing email.');
    await mongoose.disconnect();
    process.exit(1);
  }

  let added = 0;
  for (const j of JOBS) {
    const exists = await Job.findOne({ title: j.title, company: j.company });
    if (exists) continue;
    await Job.create({ ...j, salary: '', description: describe(j), postedBy: user._id });
    added++;
  }

  console.log(`Seeded ${added} job(s) as ${user.email}. Skipped ${JOBS.length - added} already present.`);
  await mongoose.disconnect();
})();
