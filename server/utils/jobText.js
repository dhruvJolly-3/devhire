// Shared helpers for turning messy job data into clean, filterable fields.

// Canonical city for filtering. Order matters: first match wins.
const CITY_PATTERNS = [
  ['Bangalore', /bangalore|bengaluru/i],
  ['Gurugram', /gurugram|gurgaon/i],
  ['Noida', /noida|greater noida/i],
  ['Delhi', /new delhi|\bdelhi\b|ncr/i],
  ['Mumbai', /mumbai|bombay|navi mumbai|thane/i],
  ['Hyderabad', /hyderabad|secunderabad/i],
  ['Pune', /\bpune\b/i],
  ['Chennai', /chennai|madras/i],
  ['Kolkata', /kolkata|calcutta/i],
  ['Ahmedabad', /ahmedabad/i],
  ['Jaipur', /jaipur/i],
  ['Kochi', /kochi|cochin/i],
  ['Chandigarh', /chandigarh|mohali/i],
  ['Indore', /indore/i],
  ['Remote', /remote|anywhere|worldwide|work from home|wfh/i],
];

function cityOf(location = '') {
  for (const [city, re] of CITY_PATTERNS) if (re.test(location)) return city;
  return 'Other';
}

// Tech keywords shown as tags and used by the stack filter.
const TECH = [
  ['React', /\breact(\.js|js)?\b/i], ['Next.js', /\bnext\.?js\b/i], ['Angular', /\bangular\b/i],
  ['Vue', /\bvue(\.js)?\b/i], ['JavaScript', /\bjavascript\b/i], ['TypeScript', /\btypescript\b/i],
  ['Node.js', /\bnode(\.js|js)?\b/i], ['Express', /\bexpress(\.js)?\b/i], ['MongoDB', /\bmongo(db)?\b/i],
  ['Python', /\bpython\b/i], ['Django', /\bdjango\b/i], ['Java', /\bjava\b(?!script)/i],
  ['Spring', /\bspring( boot)?\b/i], ['Go', /\bgolang\b|\bgo developer\b/i], ['C++', /c\+\+/i],
  ['.NET', /\.net\b|\bc#/i], ['PHP', /\bphp\b|\blaravel\b/i], ['SQL', /\bsql\b|postgres|mysql/i],
  ['AWS', /\baws\b/i], ['Docker', /\bdocker\b/i], ['Kubernetes', /\bkubernetes\b|\bk8s\b/i],
  ['Android', /\bandroid\b|\bkotlin\b/i], ['iOS', /\bios\b|\bswift\b/i], ['Flutter', /\bflutter\b/i],
  ['ML', /machine learning|\bml\b|deep learning/i], ['AI', /\bai\b|\bllm\b|generative/i],
  ['DevOps', /\bdevops\b/i], ['Data', /data engineer|data scien|\betl\b/i],
];

function extractTags(text = '', max = 6) {
  return TECH.filter(([, re]) => re.test(text)).map(([name]) => name).slice(0, max);
}

module.exports = { cityOf, extractTags };
