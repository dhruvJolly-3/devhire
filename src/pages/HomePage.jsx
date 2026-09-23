import { useMemo, useRef, useState } from 'react';
import { tk, MONO, SANS, SERIF } from '../theme';
import FloatingPills from '../components/FloatingPills';
import MascotHero from '../components/MascotHero';
import BentoStrip from '../components/BentoStrip';
import CompaniesMarquee from '../components/CompaniesMarquee';
import FilterRow, { FilterPill } from '../components/FilterRow';
import JobCarousel from '../components/JobCarousel';

const PAGE_STEP = 8;

export default function HomePage({ dark, onJobClick, mobile, jobs, loading, error, onRetry }) {
  const t = tk(dark);
  const [searchValue, setSearchValue] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [stacks, setStacks] = useState([]);
  const [sort, setSort] = useState('Newest');
  const [limit, setLimit] = useState(PAGE_STEP);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [mousePos, setMousePos] = useState({ x:50, y:50 });
  const heroRef = useRef(null);
  const accent = t.accent;

  const handleMouseMove = (e) => {
    if (!heroRef.current || mobile) return;
    const r = heroRef.current.getBoundingClientRect();
    setMousePos({ x:((e.clientX - r.left) / r.width) * 100, y:((e.clientY - r.top) / r.height) * 100 });
  };

  const stackOptions = useMemo(
    () => [...new Set(jobs.flatMap(j => j.tags))].sort(),
    [jobs],
  );
  const companies = useMemo(() => [...new Set(jobs.map(j => j.company))], [jobs]);
  const cities = useMemo(() => new Set(jobs.map(j => j.location)).size, [jobs]);

  const filteredJobs = useMemo(() => {
    const q = searchValue.trim().toLowerCase();
    let out = jobs.filter(j => {
      if (activeFilter !== 'All' && j.type !== activeFilter) return false;
      if (stacks.length && !stacks.some(s => j.tags.includes(s))) return false;
      if (!q) return true;
      return [j.title, j.company, j.location, ...j.tags].join(' ').toLowerCase().includes(q);
    });
    out = [...out];
    if (sort === 'Newest')       out.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    if (sort === 'Oldest')       out.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    if (sort === 'Company A–Z')  out.sort((a, b) => a.company.localeCompare(b.company));
    return out;
  }, [jobs, activeFilter, stacks, searchValue, sort]);

  const shown = filteredJobs.slice(0, limit);
  const px = mobile ? 16 : 32;

  return (
    <div style={{ minHeight:'100vh', background:t.bg }}>
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <div ref={heroRef} onMouseMove={handleMouseMove}
        style={{ minHeight:mobile?'60vh':'70vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:mobile?'110px 24px 56px':'100px 32px 60px', position:'relative', overflow:'hidden' }}>

        <div className="hero-glow" style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:800, height:800, background:`radial-gradient(circle,${accent}0A 0%,transparent 60%)`, pointerEvents:'none', zIndex:0 }}/>

        {!mobile && (
          <div style={{ position:'absolute', left:`${mousePos.x}%`, top:`${mousePos.y}%`, transform:'translate(-50%,-50%)', width:460, height:460, background:`radial-gradient(circle,${accent}07 0%,transparent 65%)`, pointerEvents:'none', transition:'left 500ms ease,top 500ms ease', zIndex:0 }}/>
        )}

        <FloatingPills dark={dark} mobile={mobile}/>
        {!mobile && <MascotHero dark={dark}/>}

        <div style={{ position:'relative', zIndex:1, maxWidth:720, margin:'0 auto' }}>
          <div style={{ marginBottom:28 }}>
            <span style={{ display:'inline-flex', alignItems:'center', gap:7, background:t.lime, color:'#18181B', fontFamily:MONO, fontSize:12, fontWeight:600, padding:'6px 16px', borderRadius:999, letterSpacing:'0.01em' }}>
              ⌁ &nbsp;AI matching — launching soon
            </span>
          </div>

          <h1 style={{ fontFamily:SERIF, fontSize:mobile?40:68, fontWeight:400, lineHeight:1.03, color:t.t1, margin:'0 0 22px', letterSpacing:'-0.025em' }}>
            Find your next role,{' '}
            <em style={{ color:accent, fontStyle:'italic' }}>fast.</em>
          </h1>

          <p style={{ fontFamily:SANS, fontSize:mobile?16:18, fontWeight:500, color:t.t1, maxWidth:500, margin:'0 auto 36px', lineHeight:1.68, position:'relative', textShadow:`0 0 2px ${dark?'#0D0D10':'#FAF8F3'},0 0 10px ${dark?'#0D0D10':'#FAF8F3'},0 0 22px ${dark?'#0D0D10':'#FAF8F3'}` }}>
            Curated developer jobs at Indian startups. No recruiters, no spam, no consultancy gigs.
          </p>

          {/* Search */}
          <div style={{ position:'relative', width:mobile?'100%':680, margin:'0 auto 16px' }}>
            <div style={{
              border:`1.5px solid ${searchFocused ? accent : searchValue ? accent+'99' : t.border}`,
              borderRadius:14, overflow:'hidden',
              boxShadow: searchFocused
                ? `0 0 0 3.5px ${t.lime}45, 0 4px 20px ${accent}15`
                : searchValue ? `0 0 0 2px ${accent}20, 0 4px 16px ${accent}10` : 'none',
              transition:'border-color 200ms, box-shadow 250ms, background 300ms',
              background: searchValue ? (dark ? 'rgba(124,108,255,0.10)' : 'rgba(91,79,245,0.05)') : t.surface,
              position:'relative',
            }}>
              <input value={searchValue} onChange={e => { setSearchValue(e.target.value); setLimit(PAGE_STEP); }}
                onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
                placeholder="search roles, companies, stack…"
                style={{ width:'100%', height:58, border:'none', outline:'none', background:'transparent',
                  padding:`0 ${searchValue ? '130px' : '110px'} 0 22px`,
                  fontFamily:MONO, fontSize:13, color:t.t1, boxSizing:'border-box', transition:'padding 150ms' }}/>
              <div style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', display:'flex', alignItems:'center', gap:8 }}>
                {!searchValue && (
                  <span style={{ fontFamily:MONO, fontSize:11, color:t.t3, background:t.tagBg, border:`1px solid ${t.border}`, borderRadius:6, padding:'3px 9px', letterSpacing:'0.02em' }}>⌘K</span>
                )}
                {searchValue && (
                  <button onClick={() => setSearchValue('')}
                    onMouseEnter={e => { e.currentTarget.style.filter='brightness(1.1)'; e.currentTarget.style.transform='scale(1.03)'; }}
                    onMouseLeave={e => { e.currentTarget.style.filter=''; e.currentTarget.style.transform=''; }}
                    style={{ background:accent, border:'none', borderRadius:10, padding:'0 16px', height:40, cursor:'pointer', fontFamily:MONO, fontSize:12, fontWeight:600, color:'#fff', display:'flex', alignItems:'center', gap:6, transition:'filter 150ms, transform 150ms', whiteSpace:'nowrap' }}>
                    Clear ×
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick tags */}
          <div style={{ display:'flex', gap:8, justifyContent:'center', flexWrap:'wrap' }}>
            {['React','Node.js','AI/ML'].map(tag => (
              <button key={tag} onClick={() => { setSearchValue(tag); setLimit(PAGE_STEP); }}
                style={{ fontFamily:MONO, fontSize:12, color:t.t3, background:'none', border:`1px solid ${t.border}`, borderRadius:99, padding:'5px 13px', cursor:'pointer', transition:'all 160ms' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = accent; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.t3; }}>
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bento ──────────────────────────────────────────────────────── */}
      <div style={{ maxWidth:1200, margin:'0 auto', padding:`0 ${px}px 0` }}>
        <BentoStrip dark={dark} mobile={mobile} jobs={jobs} companyCount={companies.length} cityCount={cities}/>
      </div>

      {/* ── Marquee ────────────────────────────────────────────────────── */}
      <div style={{ maxWidth:'100%', marginTop:40 }}>
        <CompaniesMarquee dark={dark} companies={companies}/>
      </div>

      {/* ── Filters ────────────────────────────────────────────────────── */}
      <FilterRow dark={dark} mobile={mobile}
        activeFilter={activeFilter} setActiveFilter={f => { setActiveFilter(f); setLimit(PAGE_STEP); }}
        stacks={stacks} setStacks={s => { setStacks(s); setLimit(PAGE_STEP); }} stackOptions={stackOptions}
        sort={sort} setSort={setSort} count={filteredJobs.length}
        onMobileFilterTap={() => setShowMobileFilters(true)}/>

      {/* ── Job list ───────────────────────────────────────────────────── */}
      <div style={{ maxWidth:1200, margin:'0 auto', padding:`32px ${px}px 100px` }}>
        {loading && (
          <div style={{ borderRadius:14, border:`1px dashed ${t.border}`, padding:'56px 24px', textAlign:'center' }}>
            <span style={{ fontFamily:MONO, fontSize:13, color:t.t3 }}>fetching jobs…</span>
          </div>
        )}

        {!loading && error && (
          <div style={{ borderRadius:14, border:`1px solid ${t.border}`, background:t.surface, padding:'40px 24px', textAlign:'center' }}>
            <p style={{ fontFamily:MONO, fontSize:13, color:t.t2, margin:'0 0 16px' }}>{error}</p>
            <button onClick={onRetry}
              style={{ fontFamily:MONO, fontSize:12, color:'#fff', background:accent, border:'none', borderRadius:8, padding:'10px 20px', cursor:'pointer' }}>
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <JobCarousel jobs={shown} dark={dark} onJobClick={onJobClick} mobile={mobile}/>
            {filteredJobs.length > limit && (
              <div style={{ textAlign:'center', marginTop:44 }}>
                <button onClick={() => setLimit(l => l + PAGE_STEP)}
                  style={{ fontFamily:MONO, fontSize:13, color:t.t2, background:'none', border:`1px solid ${t.border}`, borderRadius:8, padding:'12px 32px', cursor:'pointer', transition:'all 160ms' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = t.t1; e.currentTarget.style.color = t.t1; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.t2; }}>
                  Load more jobs ↓
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Mobile filter sheet ────────────────────────────────────────── */}
      {showMobileFilters && (
        <div style={{ position:'fixed', inset:0, zIndex:80, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'flex-end' }} onClick={() => setShowMobileFilters(false)}>
          <div onClick={e => e.stopPropagation()} style={{ width:'100%', background:t.surface, borderRadius:'20px 20px 0 0', padding:24, maxHeight:'80vh', overflowY:'auto' }}>
            <div style={{ width:40, height:4, background:t.border, borderRadius:99, margin:'0 auto 24px' }}/>
            <p style={{ fontFamily:MONO, fontSize:11, color:t.t3, letterSpacing:'0.08em', marginBottom:12 }}>TYPE</p>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:24 }}>
              {['All','Remote','Onsite','Hybrid'].map(f => (
                <FilterPill key={f} label={f} active={activeFilter === f} t={t} onClick={() => { setActiveFilter(f); setLimit(PAGE_STEP); }}/>
              ))}
            </div>
            {stackOptions.length > 0 && (
              <>
                <p style={{ fontFamily:MONO, fontSize:11, color:t.t3, letterSpacing:'0.08em', marginBottom:12 }}>STACK</p>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:24 }}>
                  {stackOptions.map(s => {
                    const on = stacks.includes(s);
                    return (
                      <button key={s} onClick={() => { setStacks(on ? stacks.filter(x => x !== s) : [...stacks, s]); setLimit(PAGE_STEP); }}
                        style={{ fontFamily:MONO, fontSize:11, color:on?'#fff':t.t2, background:on?accent:t.tagBg, border:'none', borderRadius:6, padding:'7px 10px', cursor:'pointer' }}>
                        {s}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
            <button onClick={() => setShowMobileFilters(false)}
              style={{ width:'100%', padding:16, background:accent, border:'none', borderRadius:12, fontFamily:SANS, fontSize:16, fontWeight:600, color:'#fff', cursor:'pointer' }}>
              Apply filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
