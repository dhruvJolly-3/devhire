// Creates (or repairs) the demo accounts and data. Same as the first click on
// "Explore as a company / candidate", but from the command line:
//   cd server && npm run seed:demo
require('dotenv').config();
const mongoose = require('mongoose');
const { ensureDemo } = require('../services/demo');

mongoose.connect(process.env.MONGODB_URI)
  .then(ensureDemo)
  .then(({ company, candidate }) => {
    console.log(`Demo ready: company "${company.company}" (${company.companyId}), candidate ${candidate.email}`);
    return mongoose.disconnect();
  })
  .catch(err => { console.error(err.message); process.exit(1); });
