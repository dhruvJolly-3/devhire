// Helpers that turn API data into the fields the design pages render.

export const PAL = [['var(--c-tint)', 'var(--c-accent-ink)'], ['#EDF7D0', '#3F5A00'], ['#FCE9DE', '#9A3B0B'], ['#E3F1EC', '#0F6E56'], ['var(--c-sunk)', 'var(--c-text2)'], ['#FDF0D5', '#8A5A00']];
export const TYPES = ['Remote', 'Hybrid', 'Onsite'];
export const STACKS = ['React', 'Node.js', 'TypeScript', 'MongoDB', 'Go', 'Python', 'AWS', 'Kubernetes'];
export const STATUSES = ['All', 'New', 'Shortlisted', 'Rejected'];
export const ST_STYLE = { New: ['#D2F53B', '#18181B'], Shortlisted: ['var(--c-tint)', 'var(--c-accent-ink)'], Rejected: ['var(--c-sunk)', 'var(--c-muted)'] };
export const PAGE_SIZE = 10;

const hash = (s = '') => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); };
export const palFor = (company) => PAL[hash(company) % PAL.length];

// "3h ago", "2d ago", "3w ago" from an age in days.
export const ago = (d) => !Number.isFinite(d) ? 'recently' : d < 1 ? `${Math.max(1, Math.round(d * 24))}h ago` : d < 7 ? `${Math.round(d)}d ago` : `${Math.round(d / 7)}w ago`;
export const daysSince = (iso) => (iso ? (Date.now() - new Date(iso).getTime()) / 86400000 : Infinity);

// Highest number in a salary string, in lakhs: "₹30–45L" → 45, "₹12,00,000" → 12.
export const payOf = (salary = '') => {
  const nums = (salary.replace(/,/g, '').match(/\d+(\.\d+)?/g) || []).map(Number);
  if (!nums.length) return 0;
  const max = Math.max(...nums);
  return max >= 1000 ? max / 100000 : max;
};

export const pill = (on) => ({ border: on ? 'var(--c-ink)' : 'var(--c-line2)', bg: on ? 'var(--c-ink)' : 'var(--c-paper)', fg: on ? 'var(--c-paper)' : 'var(--c-text2)' });

export const skillList = (skills) => (Array.isArray(skills) ? skills : String(skills || '').split(','))
  .map(x => String(x).trim()).filter(Boolean);

// Splits a job description into paragraphs and bullet lines.
export function splitDescription(text = '') {
  const lines = text.split(/\n+/).map(l => l.trim()).filter(Boolean);
  const bullet = /^([-*•·●▪]|\d+[.)])\s+/;
  const duties = lines.filter(l => bullet.test(l)).map(l => l.replace(bullet, '')).slice(0, 12);
  const about = lines.filter(l => !bullet.test(l));
  return { about: about.length ? about : ['No description provided.'], duties };
}
