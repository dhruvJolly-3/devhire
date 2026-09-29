// Job board filters: option lists and the matching logic.
export const CITY_ORDER = ['Bangalore', 'Delhi', 'Gurugram', 'Noida', 'Mumbai', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata', 'Ahmedabad', 'Remote'];
export const MODES = ['Remote', 'Hybrid', 'Onsite'];
export const EXPERIENCE = [
  ['any', 'Any'], ['0', 'Fresher (0–1 yrs)'], ['1', '1–3 yrs'], ['3', '3–5 yrs'], ['5', '5+ yrs'],
];
export const POSTED = [['any', 'Any time'], ['24', 'Last 24 hours'], ['72', 'Last 3 days'], ['168', 'Last 7 days'], ['720', 'Last 30 days']];
export const SOURCES = [['all', 'All jobs'], ['devhire', 'Posted on DevHire'], ['external', 'From job feeds']];
export const EMPTY_FILTERS = { cities: [], modes: [], exp: 'any', posted: 'any', source: 'all' };

export function matchesFilters(job, f) {
  if (f.cities.length && !f.cities.includes(job.city)) return false;
  if (f.modes.length && !f.modes.includes(job.type)) return false;
  if (f.exp !== 'any') {
    const lo = Number(f.exp), hi = { 0: 1, 1: 3, 3: 5, 5: Infinity }[lo];
    if (job.minYears === null || job.minYears < lo || job.minYears >= hi) return false;
  }
  if (f.posted !== 'any' && !(job.ageHours <= Number(f.posted))) return false;
  if (f.source === 'devhire' && job.source !== 'devhire') return false;
  if (f.source === 'external' && job.source === 'devhire') return false;
  return true;
}

export const activeFilterCount = (f) =>
  f.cities.length + f.modes.length + (f.exp !== 'any') + (f.posted !== 'any') + (f.source !== 'all');
