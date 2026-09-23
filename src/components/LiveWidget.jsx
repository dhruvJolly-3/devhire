import { useCallback, useEffect, useRef, useState } from 'react';
import { tk, MONO, SANS } from '../theme';
import { InlineIcon } from './ui';

export default function LiveWidget({ dark, jobs = [], onViewAll }) {
  const t = tk(dark);
  const [pos, setPos] = useState({ x: null, y: null });
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x:0, y:0 });
  const [minimized, setMinimized] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const ref = useRef(null);
  const initialized = useRef(false);

  const feed = jobs.slice(0, 5);

  useEffect(() => {
    if (!initialized.current && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setPos({ x: window.innerWidth - rect.width - 24, y: window.innerHeight - rect.height - 24 });
      initialized.current = true;
    }
  }, []);

  useEffect(() => {
    if (feed.length < 2) return;
    const interval = setInterval(() => setActiveIdx(i => (i + 1) % feed.length), 2800);
    return () => clearInterval(interval);
  }, [feed.length]);

  const onMouseDown = (e) => {
    if (e.target.closest('button') || pos.x === null) return;
    setDragging(true);
    setDragOffset({ x: e.clientX - pos.x, y: e.clientY - pos.y });
    e.preventDefault();
  };
  const onMouseMove = useCallback((e) => {
    if (!dragging) return;
    setPos({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y });
  }, [dragging, dragOffset]);
  const onMouseUp = useCallback(() => setDragging(false), []);

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [dragging, onMouseMove, onMouseUp]);

  if (feed.length === 0) return null;

  const idx = Math.min(activeIdx, feed.length - 1);
  const active = feed[idx];
  const posStyle = pos.x !== null
    ? { position:'fixed', left:pos.x, top:pos.y }
    : { position:'fixed', bottom:24, right:24 };

  return (
    <div ref={ref} onMouseDown={onMouseDown}
      style={{ ...posStyle, width:220, zIndex:200, userSelect:'none', cursor:dragging?'grabbing':'grab' }}>
      <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:16, overflow:'hidden', boxShadow:`0 12px 40px ${dark?'rgba(0,0,0,0.5)':'rgba(0,0,0,0.12)'}` }}>
        <div style={{ padding:'10px 14px', borderBottom:minimized?'none':`1px solid ${t.border}`, display:'flex', alignItems:'center', justifyContent:'space-between', background:dark?'#1a1a1e':'#FAFAF7' }}>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <span className="live-dot" style={{ width:6, height:6, borderRadius:'50%', background:'#0F6E56', display:'inline-block' }}/>
            <span style={{ fontFamily:MONO, fontSize:10, color:t.t2, letterSpacing:'0.06em', fontWeight:600 }}>LIVE ACTIVITY</span>
          </div>
          <button onMouseDown={e => e.stopPropagation()} onClick={() => setMinimized(!minimized)}
            style={{ background:'none', border:'none', color:t.t3, cursor:'pointer', fontSize:14, lineHeight:1, padding:'2px 4px' }}>
            {minimized ? '+' : '−'}
          </button>
        </div>

        {!minimized && (
          <div style={{ padding:14 }}>
            <div style={{ marginBottom:10, padding:'10px 12px', background:dark?'#1E1E22':'#F5F2EB', borderRadius:10, border:`1px solid ${t.border}` }}>
              <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:3 }}>
                <InlineIcon job={active} size={14}/>
                <div style={{ fontFamily:MONO, fontSize:11, fontWeight:600, color:t.t1, transition:'all 300ms', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{active.company}</div>
              </div>
              <div style={{ fontFamily:SANS, fontSize:11, color:t.t2, marginBottom:4 }}>{active.title}</div>
              <div style={{ fontFamily:MONO, fontSize:10, color:t.t3 }}>{active.posted}</div>
            </div>
            <div style={{ display:'flex', gap:4, marginBottom:12 }}>
              {feed.map((_, i) => (
                <div key={i} style={{ height:2, borderRadius:99, flex:1, background:i===idx?t.accent:t.border, transition:'background 300ms' }}/>
              ))}
            </div>
            <button onMouseDown={e => e.stopPropagation()} onClick={onViewAll}
              style={{ width:'100%', padding:'7px 0', background:t.accent, border:'none', borderRadius:8, fontFamily:MONO, fontSize:11, fontWeight:600, color:'#fff', cursor:'pointer', transition:'filter 150ms' }}
              onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.filter = ''; }}>
              View all →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
