// Hash-based routes, so pages have real URLs: the browser's back button,
// refresh and shared links all work without any server configuration.
//
//   #/            landing (signed out) — signed-in users go to #/jobs
//   #/login       sign in      (?next=/jobs/123 → where to go afterwards,
//                               ?as=company → the Company ID form)
//   #/register    create account
//   #/jobs        job board    (?q=react → pre-filled search)
//   #/jobs/:id    job detail
//   #/post        post a job
//   #/me          my saved & applied jobs
//   #/profile     my profile & resume
//   #/dashboard   employer dashboard (my listings + applicants)
//   #/post/:id    edit one of my listings
//   #/company/:n  company page

export function parseHash(hash = window.location.hash) {
  const raw = hash.replace(/^#/, '') || '/';
  const [path, search = ''] = raw.split('?');
  const parts = path.split('/').filter(Boolean);
  return { path: '/' + parts.join('/'), parts, query: new URLSearchParams(search) };
}

// Maps a route to the page to render (and any redirect it needs).
export function resolveRoute({ parts, query }, user) {
  const [first, second] = parts;
  if (!first) return user ? { redirect: user.isCompany ? '/dashboard' : '/jobs' } : { page: 'landing' };
  if (first === 'login' || first === 'register') {
    // Already signed in: go where they were heading, else their home page.
    if (user) return { redirect: query.get('next') || (user.isCompany ? '/dashboard' : user.isDemo ? '/me' : '/jobs') };
    return { page: 'auth', mode: first, next: query.get('next') || '', as: query.get('as') === 'company' ? 'company' : 'candidate' };
  }
  if (first === 'jobs' && second) return { page: 'detail', jobId: second };
  if (first === 'jobs') return { page: 'home', q: query.get('q') || '' };
  if (first === 'post') return user ? { page: 'post', editId: second || null } : { page: 'post', editId: null };
  if (first === 'dashboard') return user ? { page: 'dash' } : { redirect: '/login?as=company&next=/dashboard' };
  if (first === 'company' && second) return { page: 'company', company: decodeURIComponent(second) };
  if (first === 'me') return user ? { page: 'me' } : { redirect: '/login?next=/me' };
  if (first === 'profile') return user ? { page: 'profile' } : { redirect: '/login?next=/profile' };
  return { redirect: user ? '/jobs' : '/' };
}

export function go(path) {
  const target = '#' + path;
  if (window.location.hash === target) return;
  window.location.hash = path;
}

// Replace (no new history entry) — used for redirects.
export function replace(path) {
  window.history.replaceState(null, '', '#' + path);
  window.dispatchEvent(new HashChangeEvent('hashchange'));
}

export const jobPath = (job) => `/jobs/${job.id}`;
export const loginPath = (next, as) => {
  const q = new URLSearchParams();
  if (as === 'company') q.set('as', 'company');
  if (next) q.set('next', next);
  const s = q.toString();
  return `/login${s ? `?${s}` : ''}`;
};
