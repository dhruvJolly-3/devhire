require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

for (const key of ['MONGODB_URI', 'JWT_SECRET']) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

const app = express();

// Browser origins allowed to call this API. Local dev origins are always
// permitted; production origins come from CORS_ORIGINS (comma separated).
const DEV_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
];
const allowedOrigins = [
  ...DEV_ORIGINS,
  ...(process.env.CORS_ORIGINS || '')
    .split(',')
    .map(o => o.trim().replace(/\/$/, ''))
    .filter(Boolean),
];

app.use(cors({
  origin(origin, callback) {
    // Requests with no Origin header (curl, Postman, server-to-server) are
    // not browser cross-origin requests, so CORS does not apply to them.
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin.replace(/\/$/, ''))) return callback(null, true);
    // Refuse by withholding the header rather than throwing: the browser
    // blocks the response either way, but the server stays out of its
    // error path and the logs stay clean.
    console.warn(`CORS: blocked origin ${origin}`);
    return callback(null, false);
  },
}));

app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));

app.get('/api/health', (req, res) => res.json({ status: 'DevHire API running' }));

// Render injects PORT; it must be used verbatim or the service is marked
// unhealthy and cycled.
const PORT = process.env.PORT || 5001;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`CORS allowlist: ${allowedOrigins.join(', ')}`);
  });
});
