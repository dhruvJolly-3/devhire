// Company pages: a short profile plus every open role at that company.
const router = require('express').Router();
const Job = require('../models/Job');

// Profiles for companies that post often. Anything else gets a generic line.
const KNOWN = {
  zepto: ['Quick commerce', 'Mumbai', 'zeptonow.com', 'Groceries and essentials delivered in minutes from dark stores across Indian cities.'],
  razorpay: ['Fintech', 'Bangalore', 'razorpay.com', 'Payments, banking and payroll infrastructure for Indian businesses of every size.'],
  meesho: ['E-commerce', 'Bangalore', 'meesho.com', 'An online marketplace that helps small sellers reach customers across India.'],
  cred: ['Fintech', 'Bangalore', 'cred.club', 'A members-only app that rewards people for paying their credit card bills on time.'],
  postman: ['Developer tools', 'Bangalore', 'postman.com', 'The API platform developers use to design, test and document APIs.'],
  groww: ['Fintech', 'Bangalore', 'groww.in', 'Investing in stocks and mutual funds, made simple for first-time investors.'],
  phonepe: ['Payments', 'Bangalore', 'phonepe.com', 'UPI payments, insurance and investments in one app.'],
  swiggy: ['Food delivery', 'Bangalore', 'swiggy.com', 'Food and grocery delivery across hundreds of Indian cities.'],
  zomato: ['Food delivery', 'Gurugram', 'zomato.com', 'Restaurant discovery and food delivery.'],
  nykaa: ['Beauty e-commerce', 'Mumbai', 'nykaa.com', 'India’s beauty and fashion marketplace, online and in stores.'],
  flipkart: ['E-commerce', 'Bangalore', 'flipkart.com', 'One of India’s largest online marketplaces.'],
  paytm: ['Fintech', 'Noida', 'paytm.com', 'Payments, banking and financial services for India.'],
  freshworks: ['SaaS', 'Chennai', 'freshworks.com', 'Customer and employee engagement software used by businesses worldwide.'],
  zoho: ['SaaS', 'Chennai', 'zoho.com', 'A suite of business software built and run from India.'],
};

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /api/companies/:name
router.get('/:name', async (req, res) => {
  try {
    const name = req.params.name.trim().slice(0, 100);
    const jobs = await Job.find({ company: new RegExp(`^${escapeRegex(name)}$`, 'i') })
      .sort({ postedAt: -1, createdAt: -1 })
      .select('-description')
      .lean();
    const info = KNOWN[name.toLowerCase()];
    const domain = info?.[2] || jobs.find(j => j.domain)?.domain || '';
    res.json({
      name: jobs[0]?.company || name,
      industry: info?.[0] || 'Hiring on DevHire',
      hq: info?.[1] || jobs[0]?.city || '',
      domain,
      about: info?.[3] || `${jobs[0]?.company || name} is hiring developers on DevHire.`,
      jobs,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
