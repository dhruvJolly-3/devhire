// Small in-memory rate limiter (per process). Enough to slow down password
// guessing on a single Render instance; use a shared store if you scale out.
const buckets = new Map();

module.exports = ({ windowMs, max, key, message = 'Too many attempts. Please wait a few minutes and try again.' }) =>
  (req, res, next) => {
    const now = Date.now();
    const k = key(req);
    const b = buckets.get(k);
    if (!b || b.reset <= now) {
      buckets.set(k, { count: 1, reset: now + windowMs });
      return next();
    }
    if (++b.count > max) {
      res.set('Retry-After', String(Math.ceil((b.reset - now) / 1000)));
      return res.status(429).json({ message });
    }
    next();
  };

// Drop expired buckets now and then so the map doesn't grow forever.
setInterval(() => {
  const now = Date.now();
  for (const [k, b] of buckets) if (b.reset <= now) buckets.delete(k);
}, 10 * 60 * 1000).unref();
