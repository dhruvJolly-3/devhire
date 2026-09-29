// Quick, deterministic fit score used when a candidate applies — shown to the
// employer on the dashboard. (The detailed AI score on the job page uses
// routes/ai.js; this one needs no API call.)
const { extractTags } = require('./jobText');

const norm = (s) => String(s).toLowerCase().replace(/\.js$/, '').replace(/[^a-z0-9+#]/g, '');

function candidateSkills(user) {
  const listed = user.skills || [];
  const fromResume = extractTags(`${user.headline || ''} ${user.resumeText || ''}`, 20);
  return [...new Set([...listed, ...fromResume].map(norm).filter(Boolean))];
}

// 40 base + up to 50 for stack overlap + up to 10 for a filled-in resume.
function matchScore(user, job) {
  const have = candidateSkills(user);
  const need = (job.tags || []).map(norm);
  const overlap = need.length ? need.filter(t => have.includes(t)).length / need.length : 0.5;
  const resume = Math.min(10, Math.round((user.resumeText || '').length / 150));
  return Math.max(0, Math.min(99, Math.round(40 + overlap * 50 + resume)));
}

module.exports = { matchScore, candidateSkills };
