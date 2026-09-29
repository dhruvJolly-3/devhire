// Company logo lookup.
//
// A job's own `domain` wins. Jobs posted without one fall back to a list of
// well-known companies, so older listings still get a real logo. Unknown
// companies get no domain and render the colour + initials fallback.

const KNOWN_DOMAINS = {
  zepto: 'zepto.in', razorpay: 'razorpay.com', cred: 'cred.club', postman: 'postman.com',
  swiggy: 'swiggy.com', meesho: 'meesho.com', zomato: 'zomato.com', phonepe: 'phonepe.com',
  flipkart: 'flipkart.com', paytm: 'paytm.com', ola: 'olacabs.com', uber: 'uber.com',
  groww: 'groww.in', zerodha: 'zerodha.com', freshworks: 'freshworks.com', zoho: 'zoho.com',
  nykaa: 'nykaa.com', myntra: 'myntra.com', dream11: 'dream11.com', unacademy: 'unacademy.com',
  byjus: 'byjus.com', "byju's": 'byjus.com', browserstack: 'browserstack.com', atlassian: 'atlassian.com',
  cars24: 'cars24.com', urbancompany: 'urbancompany.com', 'urban company': 'urbancompany.com',
  sharechat: 'sharechat.com', rapido: 'rapido.bike', blinkit: 'blinkit.com', dunzo: 'dunzo.com',
  inmobi: 'inmobi.com', hasura: 'hasura.io', chargebee: 'chargebee.com', innovaccer: 'innovaccer.com',
  slice: 'sliceit.com', jupiter: 'jupiter.money', google: 'google.com', microsoft: 'microsoft.com',
  amazon: 'amazon.com', meta: 'meta.com', netflix: 'netflix.com', adobe: 'adobe.com',
  salesforce: 'salesforce.com', stripe: 'stripe.com', vercel: 'vercel.com', github: 'github.com',
  tcs: 'tcs.com', infosys: 'infosys.com', wipro: 'wipro.com', hcl: 'hcltech.com',
  accenture: 'accenture.com', deloitte: 'deloitte.com', capgemini: 'capgemini.com',
};

export const logoDomain = (job) => {
  const own = (job.domain || '').trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  if (own) return own;
  return KNOWN_DOMAINS[(job.company || '').trim().toLowerCase()] || '';
};

// Tried in order; if every source fails the caller shows initials.
export const logoSources = (domain, size = 128) => (domain ? [
  `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`,
  `https://icons.duckduckgo.com/ip3/${domain}.ico`,
] : []);
