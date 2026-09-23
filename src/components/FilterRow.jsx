import { useState } from 'react';
import { tk, MONO, SANS } from '../theme';

export const FilterPill = ({ label, active, t, onClick }) => {
  const [hov, setHov] = useState(false);
  const [pressed, setPressed] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => { setHov(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)}
      style={{ fontFamily:SANS, fontSize:14, color:active?'#fff':t.t2, background:active?t.t1:'none', border:`1px solid ${active?t.t1:t.border}`, borderRadius:99, padding:'6px 16px', cursor:'pointer',
        transform: pressed ? 'scale(1.06)' : hov && !active ? 'scale(1.02)' : 'scale(1)',
        transition:'transform 180ms cubic-bezier(.34,1.56,.64,1),background 150ms,color 150ms' }}>
      {label}
    </button>
  );
};

export default function FilterRow({
  dark, activeFilter, setActiveFilter, mobile, onMobileFilterTap,
  stacks, setStacks, stackOptions = [], sort, setSort, count,
}) {
  const t = tk(dark);
  const [stackOpen, setStackOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const sortOptions = ['Newest', 'Oldest', 'Company A–Z'];

  if (mobile) {
    return (
      <div style={{ padding:'0 16px 12px', display:'flex', gap:8, alignItems:'center' }}>
        <button onClick={onMobileFilterTap}
          style={{ fontFamily:SANS, fontSize:14, color:t.t1, background:t.surface, border:`1px solid ${t.border}`, borderRadius:99, padding:'8px 16px', cursor:'pointer' }}>
          Filters{stacks.length ? ` (${stacks.length + (activeFilter === 'All' ? 0 : 1)})` : activeFilter === 'All' ? '' : ' (1)'}
        </button>
        <div style={{ display:'flex', alignItems:'center', gap:6, marginLeft:8 }}>
          <span className="live-dot" style={{ width:6, height:6, borderRadius:'50%', background:'#0F6E56', display:'inline-block' }}/>
          <span style={{ fontFamily:MONO, fontSize:12, color:t.t3 }}>{count} jobs</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background:dark?'rgba(12,12,14,0.95)':'rgba(250,248,243,0.95)', backdropFilter:'blur(14px)', borderBottom:`1px solid ${t.border}`, padding:'0 32px', position:'sticky', top:64, zIndex:40 }}>
      <div style={{ maxWidth:1200, margin:'0 auto', height:56, display:'flex', alignItems:'center', justifyContent:'space-between', gap:16 }}>
        <div style={{ display:'flex', gap:6 }}>
          {['All','Remote','Onsite','Hybrid'].map(f => (
            <FilterPill key={f} label={f} active={activeFilter === f} t={t} onClick={() => setActiveFilter(f)}/>
          ))}
        </div>

        <div style={{ position:'relative' }}>
          <button onClick={() => { setStackOpen(!stackOpen); setSortOpen(false); }}
            style={{ fontFamily:SANS, fontSize:14, color:t.t2, background:'none', border:`1px solid ${t.border}`, borderRadius:8, padding:'6px 14px', cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
            Stack{stacks.length > 0 ? ` (${stacks.length})` : ''} ▾
          </button>
          {stackOpen && (
            <div style={{ position:'absolute', top:'110%', left:0, background:t.surface, border:`1px solid ${t.border}`, borderRadius:12, padding:16, display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, width:280, boxShadow:`0 12px 32px ${dark?'rgba(0,0,0,0.6)':'rgba(0,0,0,0.1)'}`, zIndex:60, maxHeight:260, overflowY:'auto' }}>
              {stackOptions.length === 0 && (
                <span style={{ gridColumn:'1 / -1', fontFamily:MONO, fontSize:11, color:t.t3 }}>no tags yet</span>
              )}
              {stackOptions.map(s => {
                const on = stacks.includes(s);
                return (
                  <button key={s} onClick={() => setStacks(on ? stacks.filter(x => x !== s) : [...stacks, s])}
                    style={{ fontFamily:MONO, fontSize:11, color:on?'#fff':t.t2, background:on?t.accent:t.tagBg, border:'none', borderRadius:6, padding:'6px 8px', cursor:'pointer', textAlign:'center', transition:'all 150ms' }}>
                    {s}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ position:'relative' }}>
            <button onClick={() => { setSortOpen(!sortOpen); setStackOpen(false); }}
              style={{ fontFamily:SANS, fontSize:14, color:t.t2, background:'none', border:`1px solid ${t.border}`, borderRadius:8, padding:'6px 14px', cursor:'pointer' }}>
              {sort} ▾
            </button>
            {sortOpen && (
              <div style={{ position:'absolute', top:'110%', right:0, background:t.surface, border:`1px solid ${t.border}`, borderRadius:10, overflow:'hidden', boxShadow:`0 12px 32px ${dark?'rgba(0,0,0,0.6)':'rgba(0,0,0,0.1)'}`, zIndex:60, minWidth:160 }}>
                {sortOptions.map(opt => (
                  <button key={opt} onClick={() => { setSort(opt); setSortOpen(false); }}
                    style={{ display:'block', width:'100%', textAlign:'left', padding:'10px 16px', fontFamily:SANS, fontSize:13, color:opt===sort?t.accent:t.t1, background:'none', border:'none', borderBottom:`1px solid ${t.border}`, cursor:'pointer' }}>
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <span className="live-dot" style={{ width:6, height:6, borderRadius:'50%', background:'#0F6E56', display:'inline-block' }}/>
            <span style={{ fontFamily:MONO, fontSize:13, color:t.t3 }}>{count} jobs</span>
          </div>
        </div>
      </div>
    </div>
  );
}
