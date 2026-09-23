import { useState } from 'react';
import { tk, MONO } from '../theme';
import JobCard from './JobCard';

const ArrowBtn = ({ dir, onClick, disabled, t, accent }) => {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      aria-label={dir === 'left' ? 'Previous page' : 'Next page'}
      style={{
        width:44, height:44, borderRadius:'50%',
        background: disabled ? 'none' : hov ? accent : t.surface,
        border:`1px solid ${disabled ? t.border+'50' : hov ? accent : t.border}`,
        color: disabled ? t.t3+'60' : hov ? '#fff' : t.t1,
        fontSize:16, cursor: disabled ? 'not-allowed' : 'pointer',
        display:'flex', alignItems:'center', justifyContent:'center',
        transition:'all 200ms cubic-bezier(.34,1.2,.64,1)',
        transform: hov && !disabled ? 'scale(1.08)' : 'scale(1)', flexShrink:0,
      }}>
      {dir === 'left' ? '‹' : '›'}
    </button>
  );
};

export default function JobCarousel({ jobs, dark, onJobClick, mobile }) {
  const t = tk(dark);
  const perPage = mobile ? 1 : 2;
  const [rawPage, setPage] = useState(0);
  const [dir, setDir] = useState(0);
  const [animating, setAnimating] = useState(false);
  const totalPages = Math.max(1, Math.ceil(jobs.length / perPage));
  // Filters can shrink the list out from under the current page, so the
  // page in use is always clamped rather than corrected after the fact.
  const page = Math.min(rawPage, totalPages - 1);

  const goTo = (newPage, direction) => {
    if (animating || newPage < 0 || newPage >= totalPages) return;
    setDir(direction);
    setAnimating(true);
    setTimeout(() => { setPage(newPage); setDir(0); setAnimating(false); }, 320);
  };

  const visible = jobs.slice(page * perPage, page * perPage + perPage);
  const accent = t.accent;

  if (jobs.length === 0) {
    return (
      <div style={{ borderRadius:14, border:`1px dashed ${t.border}`, padding:'56px 24px', textAlign:'center' }}>
        <span style={{ fontFamily:MONO, fontSize:13, color:t.t3 }}>no jobs match these filters</span>
      </div>
    );
  }

  return (
    <div>
      <div style={{
        display: mobile ? 'flex' : 'grid',
        gridTemplateColumns: mobile ? undefined : '1fr 1fr',
        flexDirection: mobile ? 'column' : undefined,
        gap:12,
        opacity: animating ? 0 : 1,
        transform: animating ? `translateX(${dir * -24}px)` : 'translateX(0)',
        transition: animating ? 'none' : 'opacity 300ms ease, transform 300ms ease',
      }}>
        {visible.map((job, i) => (
          <JobCard key={job.id} job={job} dark={dark} onClick={onJobClick} mobile={mobile} idx={i}/>
        ))}
        {!mobile && visible.length === 1 && (
          <div style={{ borderRadius:14, border:`1px dashed ${t.border}`, display:'flex', alignItems:'center', justifyContent:'center', minHeight:110 }}>
            <span style={{ fontFamily:MONO, fontSize:12, color:t.t3 }}>more coming soon</span>
          </div>
        )}
      </div>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:20 }}>
        <div style={{ display:'flex', gap:6, alignItems:'center' }}>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button key={i} onClick={() => goTo(i, i > page ? 1 : -1)} aria-label={`Page ${i+1}`}
              style={{ width: i===page ? 20 : 6, height:6, borderRadius:99, background: i===page ? accent : t.border, border:'none', cursor:'pointer', padding:0, transition:'all 250ms ease' }}/>
          ))}
        </div>
        <span style={{ fontFamily:MONO, fontSize:12, color:t.t3 }}>{page + 1} / {totalPages}</span>
        <div style={{ display:'flex', gap:8 }}>
          <ArrowBtn dir="left"  t={t} accent={accent} onClick={() => goTo(page-1,-1)} disabled={page===0}/>
          <ArrowBtn dir="right" t={t} accent={accent} onClick={() => goTo(page+1, 1)} disabled={page===totalPages-1}/>
        </div>
      </div>
    </div>
  );
}
