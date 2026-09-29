// Imports live developer jobs from free public job APIs into MongoDB.
//
//   Adzuna     https://api.adzuna.com/v1/api/jobs/in/search  (India — default)
//              Free key from developer.adzuna.com → ADZUNA_APP_ID / ADZUNA_APP_KEY.
//   Remotive   https://remotive.com/api/remote-jobs   (remote software jobs)
//   Arbeitnow  https://www.arbeitnow.com/api/job-board-api
//   Greenhouse https://boards-api.greenhouse.io/v1/boards/<board>/jobs
//              — official public career-page feeds; boards are listed in the
//                GREENHOUSE_BOARDS env var as "board:Company Name,board2:Other".
//
// JOB_SOURCES picks which run (default "adzuna,greenhouse" — India-focused);
// jobs from sources that are switched off are removed on the next sync.
//
// Each source is fetched independently: if one is down, the others still
// sync. Jobs are upserted by (source, externalId), so re-running never
// creates duplicates, and a source's jobs that disappear from its feed are
// removed on the next successful sync.
const Job = require('../models/Job');
const { cityOf, extractTags } = require('../utils/jobText');

const FETCH_TIMEOUT_MS = 15000;
const MAX_PER_SOURCE = 400;
const MAX_DESCRIPTION = 6000;

// ── helpers ────────────────────────────────────────────────────────────────
const decodeEntities = (s) => s
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'");

// Job descriptions arrive as HTML; the site renders plain text.
const htmlToText = (html = '') => decodeEntities(decodeEntities(html)
  .replace(/<\s*(br|\/p|\/div|\/li|\/h\d)\s*\/?>/gi, '\n')
  .replace(/<li[^>]*>/gi, '• ')
  .replace(/<[^>]+>/g, ''))
  .replace(/[ \t]+/g, ' ')
  .replace(/\n\s*\n\s*\n+/g, '\n\n')
  .trim()
  .slice(0, MAX_DESCRIPTION);

const domainOf = (url) => {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return ''; }
};

const guessType = (location = '', remote = false) => {
  if (/hybrid/i.test(location)) return 'Hybrid';
  if (remote || /\bremote\b|anywhere|worldwide|work from home/i.test(location)) return 'Remote';
  return 'Onsite';
};

async function getJSON(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'DevHire job board (portfolio project)' },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// Adzuna's free plan allows a limited number of calls per day, so it runs on
// its own slower clock (ADZUNA_EVERY_MINUTES, default 180 → ~64 calls/day).
const ADZUNA_CITIES = ['Bangalore', 'Delhi', 'Noida', 'Gurgaon', 'Mumbai', 'Hyderabad', 'Pune', 'Chennai'];
let adzunaLastRun = 0;

// "₹12–18 LPA" from Adzuna's annual salary numbers.
const lpa = (min, max) => {
  const f = (n) => Math.round(n / 1e5);
  if (!min && !max) return '';
  if (min && max && f(min) !== f(max)) return `₹${f(min)}–${f(max)} LPA`;
  return `₹${f(min || max)} LPA`;
};

// ── sources: each returns jobs in our schema's shape ───────────────────────
// Returning null means "skipped this round" — nothing is added or removed.
const sources = {
  async adzuna() {
    const { ADZUNA_APP_ID: id, ADZUNA_APP_KEY: key } = process.env;
    if (!id || !key) { console.warn('[jobSync] adzuna: set ADZUNA_APP_ID and ADZUNA_APP_KEY to enable'); return null; }
    const every = Math.max(60, Number(process.env.ADZUNA_EVERY_MINUTES) || 180) * 60 * 1000;
    if (Date.now() - adzunaLastRun < every) return null;
    adzunaLastRun = Date.now();

    const out = [];
    for (const where of ADZUNA_CITIES) {
      const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?${new URLSearchParams({
        app_id: id, app_key: key, results_per_page: '50', category: 'it-jobs',
        what_or: 'developer engineer programmer', where, 'content-type': 'application/json',
      })}`;
      try {
        const data = await getJSON(url);
        for (const j of data.results || []) {
          const title = htmlToText(j.title);
          const description = htmlToText(j.description);
          const location = j.location?.display_name || where;
          out.push({
            externalId: String(j.id),
            title,
            company: j.company?.display_name || 'Company not listed',
            description,
            location,
            type: guessType(`${location} ${title} ${description}`),
            tags: extractTags(`${title} ${description}`),
            salary: j.salary_is_predicted === '1' ? '' : lpa(j.salary_min, j.salary_max),
            applyUrl: j.redirect_url,
            postedAt: j.created ? new Date(j.created) : undefined,
          });
        }
      } catch (err) {
        console.warn(`[jobSync] adzuna ${where} failed: ${err.message}`);
        out.partial = true;
      }
    }
    // The same job can show up under two nearby cities.
    const unique = [...new Map(out.map(j => [j.externalId, j])).values()];
    unique.partial = out.partial;
    return unique;
  },

  async remotive() {
    const data = await getJSON('https://remotive.com/api/remote-jobs?category=software-dev&limit=100');
    return (data.jobs || [])
      // Keep roles a candidate in India can actually apply to.
      .filter(j => /worldwide|anywhere|india|asia|apac/i.test(j.candidate_required_location || 'worldwide'))
      .map(j => ({
        externalId: String(j.id),
        title: j.title,
        company: j.company_name,
        description: htmlToText(j.description),
        location: j.candidate_required_location || 'Remote',
        type: 'Remote',
        tags: (j.tags || []).slice(0, 6),
        salary: j.salary || '',
        applyUrl: j.url,
        postedAt: j.publication_date ? new Date(j.publication_date) : undefined,
      }));
  },

  async arbeitnow() {
    const data = await getJSON('https://www.arbeitnow.com/api/job-board-api');
    return (data.data || [])
      .filter(j => j.remote)
      .map(j => ({
        externalId: j.slug,
        title: j.title,
        company: j.company_name,
        description: htmlToText(j.description),
        location: j.location || 'Remote',
        type: 'Remote',
        tags: (j.tags || []).slice(0, 6),
        applyUrl: j.url,
        postedAt: j.created_at ? new Date(j.created_at * 1000) : undefined,
      }));
  },

  async greenhouse() {
    const boards = (process.env.GREENHOUSE_BOARDS || '')
      .split(',').map(b => b.trim()).filter(Boolean)
      .map(b => { const [token, ...name] = b.split(':'); return { token, company: name.join(':') || token }; });
    const out = [];
    for (const { token, company } of boards) {
      try {
        const data = await getJSON(`https://boards-api.greenhouse.io/v1/boards/${encodeURIComponent(token)}/jobs?content=true`);
        for (const j of data.jobs || []) {
          const location = j.location?.name || '';
          out.push({
            externalId: `${token}-${j.id}`,
            title: j.title,
            company,
            description: htmlToText(j.content),
            location: location || 'India',
            type: guessType(location),
            tags: [],
            applyUrl: j.absolute_url,
            domain: domainOf(j.absolute_url).endsWith('greenhouse.io') ? '' : domainOf(j.absolute_url),
            postedAt: j.updated_at ? new Date(j.updated_at) : undefined,
          });
        }
      } catch (err) {
        console.warn(`[jobSync] greenhouse board "${token}" failed: ${err.message}`);
        out.partial = true;   // don't delete the failed board's jobs
      }
    }
    return out;
  },
};

// ── sync ───────────────────────────────────────────────────────────────────
async function syncSource(name) {
  const fetched = await sources[name]();
  if (fetched === null) return null;
  const jobs = fetched
    .filter(j => j.externalId && j.title && j.company && j.description)
    .slice(0, MAX_PER_SOURCE)
    .map(j => ({
      ...j,
      city: cityOf(j.location),
      tags: j.tags?.length ? j.tags : extractTags(`${j.title} ${j.description}`),
    }));

  if (jobs.length) {
    await Job.bulkWrite(jobs.map(j => ({
      updateOne: {
        filter: { source: name, externalId: j.externalId },
        update: { $set: { ...j, source: name } },
        upsert: true,
      },
    })));
  }
  // Drop this source's jobs that are no longer in its feed — but only after
  // a complete, non-empty fetch, so an outage or format change can't wipe
  // the board.
  if (!jobs.length || fetched.partial) return { synced: jobs.length, removed: 0 };
  const { deletedCount } = await Job.deleteMany({
    source: name,
    externalId: { $nin: jobs.map(j => j.externalId) },
  });
  return { synced: jobs.length, removed: deletedCount };
}

let running = false;

async function syncAll() {
  if (running) return;             // never overlap two syncs
  running = true;
  try {
    const enabled = (process.env.JOB_SOURCES || 'adzuna,greenhouse')
      .split(',').map(s => s.trim()).filter(name => sources[name]);

    // Clear out jobs from sources that have been switched off.
    const { deletedCount } = await Job.deleteMany({ source: { $nin: ['devhire', null, ...enabled] } });
    if (deletedCount) console.log(`[jobSync] removed ${deletedCount} job(s) from disabled sources`);

    for (const name of enabled) {
      try {
        const result = await syncSource(name);
        if (!result) continue;   // skipped this round
        const { synced, removed } = result;
        console.log(`[jobSync] ${name}: ${synced} synced, ${removed} removed`);
      } catch (err) {
        // A failed fetch leaves that source's existing jobs untouched.
        console.warn(`[jobSync] ${name} failed: ${err.message}`);
      }
    }
  } finally {
    running = false;
  }
}

// Runs once at startup, then every JOB_SYNC_MINUTES (default 30).
// Set JOB_SYNC=off to disable.
function startJobSync() {
  if (process.env.JOB_SYNC === 'off') return;
  const minutes = Math.max(5, Number(process.env.JOB_SYNC_MINUTES) || 30);
  syncAll();
  setInterval(syncAll, minutes * 60 * 1000).unref();
}

module.exports = { startJobSync, syncAll, htmlToText, sources };
