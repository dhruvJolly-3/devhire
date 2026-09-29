import { useMemo, useRef, useState } from 'react';
import { tk, MONO, SANS, SERIF } from '../theme';
import JobCard from '../components/JobCard';
import Pagination from '../components/Pagination';
import JobFilters from '../components/JobFilters';
import { EMPTY_FILTERS, matchesFilters, activeFilterCount } from '../utils/filters';

const PAGE_SIZE = 10;
const SORTS = ['Newest', 'Oldest', 'Company A–Z'];

// The job board: search, filter sidebar, sorted results, numbered pages.
export default function HomePage({ dark, mobile, jobs, loading, error, onRetry, initialQuery = '',
  onJobClick, savedIds, appliedIds, onToggleSave }) {
  const t = tk(dark);
  const accent = t.accent;
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFiltersRaw] = useState(EMPTY_FILTERS);
  const [sort, setSort] = useState('Newest');
  const [page, setPage] = useState(1);
  const [sheetOpen, setSheetOpen] = useState(false);
  const resultsRef = useRef(null);

  // Any change to what's being searched starts again from page 1.
  const setFilters = (next) => { setFiltersRaw(next); setPage(1); };
  const clearAll = () => { setFiltersRaw(EMPTY_FILTERS); setQuery(''); setPage(1); };

  const cityCounts = useMemo(() => jobs.reduce((acc, j) => {
    acc[j.city] = (acc[j.city] || 0) + 1;
    return acc;
  }, {}), [jobs]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const out = jobs.filter(j => matchesFilters(j, filters) &&
      (!q || [j.title, j.company, j.location, j.city, ...j.tags].join(' ').toLowerCase().includes(q)));
    const time = (j) => new Date(j.createdAt || 0).getTime();
    if (sort === 'Newest') out.sort((a, b) => time(b) - time(a));
    if (sort === 'Oldest') out.sort((a, b) => time(a) - time(b));
    if (sort === 'Company A–Z') out.sort((a, b) => a.company.localeCompare(b.company));
    return out;
  }, [jobs, filters, query, sort]);

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const shown = results.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const from = results.length ? (current - 1) * PAGE_SIZE + 1 : 0;
  const to = Math.min(current * PAGE_SIZE, results.length);
  const nActive = activeFilterCount(filters);

  const goToPage = (p) => {
    setPage(p);
    const top = (resultsRef.current?.getBoundingClientRect().top || 0) + window.scrollY - 90;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  const filters$ = <JobFilters dark={dark} filters={filters} setFilters={fn => setFilters(fn(filters))} cityCounts={cityCounts}/>;

  return (
    <div style={{ minHeight:'100vh', background:t.bg }}>
      {/* ── Header + search ──────────────────────────────────────────── */}
      <div style={{ maxWidth:1200, margin:'0 auto', padding:mobile?'96px 16px 8px':'116px 32px 12px' }}>
        <div style={{ fontFamily:MONO, fontSize:11, color:t.t3, letterSpacing:'0.12em', marginBottom:10 }}>JOB BOARD</div>
        <h1 style={{ fontFamily:SERIF, fontSize:mobile?36:52, fontWeight:400, lineHeight:1.02, color:t.t1, margin:'0 0 22px', letterSpacing:'-0.025em' }}>
          Open <em style={{ color:accent, fontStyle:'italic' }}>roles</em>
        </h1>

        <div style={{ position:'relative' }}>
          <input value={query} onChange={e => { setQuery(e.target.value); setPage(1); }}
            aria-label="Search jobs" placeholder="Search by role, company, skill or city…"
            style={{ width:'100%', height:56, borderRadius:14, border:`1.5px solid ${query ? accent + '99' : t.border}`, background:t.surface,
              padding:'0 110px 0 22px', fontFamily:MONO, fontSize:13, color:t.t1, outline:'none', boxSizing:'border-box', transition:'border-color 200ms' }}
            onFocus={e => { e.currentTarget.style.borderColor = accent; }}
            onBlur={e => { e.currentTarget.style.borderColor = query ? accent + '99' : t.border; }}/>
          {query && (
            <button onClick={() => { setQuery(''); setPage(1); }}
              style={{ position:'absolute', right:8, top:'50%', transform:'translateY(-50%)', background:accent, border:'none', borderRadius:10, padding:'0 16px', height:40, cursor:'pointer', fontFamily:MONO, fontSize:12, fontWeight:600, color:'#fff' }}>
              Clear ×
            </button>
          )}
        </div>
      </div>

      {/* ── Sidebar + results ────────────────────────────────────────── */}
      <div ref={resultsRef} style={{ maxWidth:1200, margin:'0 auto', padding:mobile?'16px 16px 100px':'24px 32px 110px',
        display:'grid', gridTemplateColumns:mobile ? '1fr' : '240px 1fr', gap:mobile ? 16 : 40, alignItems:'start' }}>

        {!mobile && (
          <aside style={{ position:'sticky', top:88, maxHeight:'calc(100vh - 110px)', overflowY:'auto', paddingRight:14, scrollbarGutter:'stable' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:18 }}>
              <span style={{ fontFamily:SANS, fontSize:15, fontWeight:600, color:t.t1 }}>Filters</span>
              {nActive > 0 && (
                <button onClick={() => setFilters(EMPTY_FILTERS)} style={{ background:'none', border:'none', fontFamily:MONO, fontSize:12, color:accent, cursor:'pointer', padding:0 }}>
                  Clear ({nActive})
                </button>
              )}
            </div>
            {filters$}
          </aside>
        )}

        <main>
          {/* Toolbar */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, marginBottom:16, flexWrap:'wrap' }}>
            <span aria-live="polite" style={{ fontFamily:MONO, fontSize:12, color:t.t2 }}>
              {loading ? 'Loading jobs…' : results.length ? `Showing ${from}–${to} of ${results.length} jobs` : 'No jobs found'}
            </span>
            <div style={{ display:'flex', gap:8 }}>
              {mobile && (
                <button onClick={() => setSheetOpen(true)}
                  style={{ height:38, padding:'0 14px', borderRadius:10, border:`1px solid ${nActive ? accent : t.border}`, background:t.surface, fontFamily:SANS, fontSize:13, color:t.t1, cursor:'pointer' }}>
                  Filters{nActive ? ` (${nActive})` : ''}
                </button>
              )}
              <select value={sort} onChange={e => { setSort(e.target.value); setPage(1); }} aria-label="Sort jobs"
                style={{ height:38, padding:'0 12px', borderRadius:10, border:`1px solid ${t.border}`, background:t.surface, fontFamily:SANS, fontSize:13, color:t.t1, cursor:'pointer' }}>
                {SORTS.map(s => <option key={s} value={s}>{s === 'Newest' ? 'Sort: Newest' : s === 'Oldest' ? 'Sort: Oldest' : 'Sort: Company A–Z'}</option>)}
              </select>
            </div>
          </div>

          {loading && Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height:96, borderRadius:14, border:`1px solid ${t.border}`, background:t.surface, marginBottom:12 }}/>
          ))}

          {!loading && error && (
            <div style={{ borderRadius:14, border:`1px solid ${t.border}`, background:t.surface, padding:'40px 24px', textAlign:'center' }}>
              <p style={{ fontFamily:MONO, fontSize:13, color:t.t2, margin:'0 0 16px' }}>{error}</p>
              <button onClick={onRetry} style={{ fontFamily:MONO, fontSize:12, color:'#fff', background:accent, border:'none', borderRadius:8, padding:'10px 20px', cursor:'pointer' }}>Retry</button>
            </div>
          )}

          {!loading && !error && results.length === 0 && (
            <div style={{ borderRadius:14, border:`1px dashed ${t.border}`, padding:'56px 24px', textAlign:'center' }}>
              <p style={{ fontFamily:SANS, fontSize:16, color:t.t1, margin:'0 0 6px' }}>No jobs match your search.</p>
              <p style={{ fontFamily:SANS, fontSize:14, color:t.t2, margin:'0 0 18px' }}>Try fewer filters or a broader keyword.</p>
              <button onClick={clearAll} style={{ fontFamily:MONO, fontSize:12, color:'#fff', background:accent, border:'none', borderRadius:8, padding:'10px 20px', cursor:'pointer' }}>Clear search & filters</button>
            </div>
          )}

          {!loading && !error && results.length > 0 && (
            <div key={`${current}|${sort}|${query}|${JSON.stringify(filters)}`} className="fade-swap" style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {shown.map((job, i) => (
                <JobCard key={job.id} job={job} dark={dark} mobile={mobile} idx={i} onClick={onJobClick}
                  saved={savedIds.has(job.id)} applied={appliedIds.has(job.id)} onToggleSave={onToggleSave}/>
              ))}
            </div>
          )}

          <Pagination dark={dark} page={current} total={totalPages} onChange={goToPage}/>
        </main>
      </div>

      {/* ── Mobile filter sheet ──────────────────────────────────────── */}
      {mobile && sheetOpen && (
        <div style={{ position:'fixed', inset:0, zIndex:80, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'flex-end' }} onClick={() => setSheetOpen(false)}>
          <div onClick={e => e.stopPropagation()} style={{ width:'100%', background:t.surface, borderRadius:'20px 20px 0 0', padding:24, maxHeight:'85vh', overflowY:'auto' }}>
            <div style={{ width:40, height:4, background:t.border, borderRadius:99, margin:'0 auto 20px' }}/>
            {filters$}
            <div style={{ display:'flex', gap:10, marginTop:24 }}>
              <button onClick={() => setFilters(EMPTY_FILTERS)} style={{ flex:1, padding:14, background:'none', border:`1px solid ${t.border}`, borderRadius:12, fontFamily:SANS, fontSize:15, color:t.t1, cursor:'pointer' }}>Clear</button>
              <button onClick={() => setSheetOpen(false)} style={{ flex:2, padding:14, background:accent, border:'none', borderRadius:12, fontFamily:SANS, fontSize:15, fontWeight:600, color:'#fff', cursor:'pointer' }}>
                Show {results.length} jobs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
