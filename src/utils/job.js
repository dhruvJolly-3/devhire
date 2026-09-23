// Maps an API job document onto the shape the design components expect.
// The design's `match` score is deliberately absent — that feature is cut.

const FALLBACK_COLORS = [
  '#FF5A1F', '#2563EB', '#1C1C1E', '#E8540B',
  '#FC8019', '#8B5CF6', '#DC2626', '#6D28D9',
];

const hashCode = (str) => {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
};

export const initialsFor = (company = '') => {
  const words = company.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
};

export const relativeTime = (iso) => {
  if (!iso) return 'just now';
  const diff = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(diff)) return 'just now';
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
};

export const normalizeJob = (raw) => ({
  id: raw._id || raw.id,
  title: raw.title || 'Untitled role',
  company: raw.company || 'Unknown',
  description: raw.description || '',
  salary: raw.salary || '',
  location: raw.location || 'Remote',
  type: ['Remote', 'Hybrid', 'Onsite'].includes(raw.type) ? raw.type : 'Remote',
  tags: Array.isArray(raw.tags) ? raw.tags.filter(Boolean) : [],
  exp: raw.expLevel || '',
  posted: relativeTime(raw.createdAt),
  // Evaluated when the response is normalised, so render stays pure.
  postedThisWeek: raw.createdAt
    ? Date.now() - new Date(raw.createdAt).getTime() < 7 * 24 * 3600 * 1000
    : false,
  createdAt: raw.createdAt,
  // `domain` drives the favicon lookup. Left blank on purpose when the job
  // has none — CompanyAvatar/InlineIcon then render the colour+initials
  // fallback rather than fetching a favicon for a guessed domain.
  domain: raw.domain || '',
  color: raw.color || FALLBACK_COLORS[hashCode(raw.company || '') % FALLBACK_COLORS.length],
  initials: raw.logoInitials || initialsFor(raw.company),
});

export const normalizeJobs = (list) => (Array.isArray(list) ? list.map(normalizeJob) : []);
