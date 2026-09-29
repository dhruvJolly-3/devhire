import { useState } from 'react';
import { tk, MONO, SANS } from '../theme';
import { CompanyAvatar, InlineIcon } from './ui';
import useInView from '../hooks/useInView';

// One row in a job list. `onToggleSave` adds the ☆ save button; `applied`
// shows a "✓ Applied" badge.
export default function JobCard({ job, dark, onClick, mobile, idx = 0, saved, applied, onToggleSave }) {
  const t = tk(dark);
  const [hov, setHov] = useState(false);
  const [ref, visible] = useInView(0.08);
  const rail = t.accent;

  return (
    <div ref={ref} onClick={() => onClick(job)}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? t.surf2 : t.surface,
        border:`1px solid ${hov ? rail + '55' : t.border}`,
        borderRadius:14, padding:20,
        display:'flex', flexDirection:mobile?'column':'row',
        alignItems:mobile?'flex-start':'center', gap:mobile?12:16, cursor:'pointer',
        transform: hov ? 'translateY(-3px) scale(1.007)' : 'translateY(0) scale(1)',
        boxShadow: hov ? `0 10px 30px ${dark?'rgba(0,0,0,0.3)':'rgba(0,0,0,0.09)'}, 0 0 0 1px ${rail}18` : 'none',
        transition:'border-color 180ms,transform 220ms cubic-bezier(.34,1.2,.64,1),box-shadow 220ms,background 200ms',
        opacity: visible ? 1 : 0,
        animation: visible ? `slideUp 380ms ${Math.min(idx*55,280)}ms ease forwards` : 'none',
        position:'relative', overflow:'hidden',
      }}>

      {/* Left accent bar */}
      <div style={{ position:'absolute', left:0, top:0, bottom:0, width:3, background:`linear-gradient(180deg,${rail}90 0%,${rail}25 100%)`, borderRadius:'14px 0 0 14px', opacity:hov?1:0.55, transition:'opacity 200ms' }}/>

      <CompanyAvatar job={job} size={40} dark={dark}/>

      <div style={{ flex:1, minWidth:0 }}>
        {/* Row 1 — title */}
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:5 }}>
          <span style={{ fontFamily:SANS, fontSize:15, fontWeight:600, color:t.t1, letterSpacing:'-0.008em', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{job.title}</span>
          {job.type === 'Remote' && (
            <span style={{ fontFamily:MONO, fontSize:10, fontWeight:600, background:t.lime, color:'#18181B', padding:'2px 8px', borderRadius:99, flexShrink:0, letterSpacing:'0.02em' }}>Remote</span>
          )}
        </div>

        {/* Row 2 — company / location / type / experience */}
        <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:9, flexWrap:'wrap' }}>
          <span style={{ display:'inline-flex', alignItems:'center', gap:5 }}>
            <InlineIcon job={job} size={13}/>
            <span style={{ fontFamily:MONO, fontSize:13, color:t.t2 }}>{job.company}</span>
          </span>
          <span style={{ color:t.t3, fontSize:12 }}>·</span>
          <span style={{ fontFamily:SANS, fontSize:13, color:t.t2 }}>{job.location}</span>
          {job.type !== 'Remote' && (<><span style={{ color:t.t3, fontSize:12 }}>·</span><span style={{ fontFamily:MONO, fontSize:12, color:t.t3 }}>{job.type}</span></>)}
          {job.exp && (<><span style={{ color:t.t3, fontSize:12 }}>·</span><span style={{ fontFamily:MONO, fontSize:12, color:t.t3 }}>{job.exp}</span></>)}
          {job.salary && (<><span style={{ color:t.t3, fontSize:12 }}>·</span><span style={{ fontFamily:MONO, fontSize:12, color:t.t3 }}>{job.salary}</span></>)}
          {job.sourceLabel && (<><span style={{ color:t.t3, fontSize:12 }}>·</span><span style={{ fontFamily:MONO, fontSize:11, color:t.accent }}>via {job.sourceLabel}</span></>)}
        </div>

        {/* Row 3 — tags */}
        <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap' }}>
          {job.tags.slice(0, mobile ? 3 : 4).map(tag => (
            <span key={tag} style={{ fontFamily:MONO, fontSize:11, letterSpacing:'0.01em', color:t.t2, background:hov?t.tagHover:t.tagBg, padding:'3px 8px', borderRadius:6, transition:'background 150ms' }}>{tag}</span>
          ))}
          {mobile && <span style={{ fontFamily:MONO, fontSize:11, color:t.t3, marginLeft:4 }}>{job.posted}</span>}
        </div>
      </div>

      {/* Right — applied badge, save, timestamp + chevron */}
      <div style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0, ...(mobile ? { position:'absolute', top:14, right:14 } : {}) }}>
        {applied && (
          <span style={{ fontFamily:MONO, fontSize:10, fontWeight:600, color:t.success, background:dark?'rgba(22,168,120,0.14)':'rgba(15,110,86,0.10)', padding:'3px 8px', borderRadius:99 }}>✓ Applied</span>
        )}
        {onToggleSave && (
          <button type="button" aria-label={saved ? 'Remove from saved jobs' : 'Save job'} title={saved ? 'Saved' : 'Save job'}
            onClick={e => { e.stopPropagation(); onToggleSave(job); }}
            style={{ width:34, height:34, borderRadius:10, border:`1px solid ${saved ? t.accent : t.border}`, background:saved ? `${t.accent}18` : 'transparent',
              color:saved ? t.accent : t.t3, cursor:'pointer', fontSize:15, lineHeight:1, display:'flex', alignItems:'center', justifyContent:'center', transition:'all 160ms' }}>
            {saved ? '★' : '☆'}
          </button>
        )}
        {!mobile && (
          <>
            <span style={{ fontFamily:MONO, fontSize:12, color:t.t3, minWidth:52, textAlign:'right' }}>{job.posted}</span>
            <span style={{ opacity:hov?1:0, transform:hov?'translateX(0)':'translateX(-6px)', transition:'opacity 180ms,transform 180ms', color:t.t2, fontSize:15 }}>→</span>
          </>
        )}
      </div>
    </div>
  );
}
