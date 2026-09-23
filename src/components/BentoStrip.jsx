import { useMemo, useState } from 'react';
import { tk, MONO, SANS } from '../theme';
import { AnimatedCounter, InlineIcon } from './ui';
import useInView from '../hooks/useInView';

export default function BentoStrip({ dark, mobile, jobs = [], companyCount = 0, cityCount = 0 }) {
  const t = tk(dark);
  const [ref, visible] = useInView(0.1);
  const [order, setOrder] = useState([0, 1, 2, 3]);
  const [dragging, setDragging] = useState(null);
  const [dragOver, setDragOver] = useState(null);

  const thisWeek = useMemo(() => jobs.filter(j => j.postedThisWeek).length, [jobs]);

  const cardDefs = [
    <BentoStat dark={dark} t={t} target={jobs.length} label="open roles" sub={`+${thisWeek} this week`} icon="◈"
      hoverBg={dark?'rgba(255,138,0,0.13)':'rgba(255,138,0,0.07)'}
      hoverBorder={dark?'rgba(255,138,0,0.35)':'rgba(255,138,0,0.25)'}
      visible={visible}/>,
    <BentoStat dark={dark} t={t} target={companyCount} label="companies hiring" sub={`${cityCount} ${cityCount === 1 ? 'city' : 'cities'}`} icon="◉"
      hoverBg={dark?'rgba(37,99,235,0.15)':'rgba(37,99,235,0.07)'}
      hoverBorder={dark?'rgba(37,99,235,0.4)':'rgba(37,99,235,0.25)'}
      visible={visible}/>,
    <BentoAI dark={dark} t={t}/>,
    <BentoFeed dark={dark} t={t} visible={visible} jobs={jobs}/>,
  ];

  const handleDragStart = (e, i) => { setDragging(i); e.dataTransfer.effectAllowed = 'move'; };
  const handleDragOver  = (e, i) => { e.preventDefault(); setDragOver(i); };
  const handleDrop      = (e, i) => {
    e.preventDefault();
    if (dragging === null || dragging === i) { setDragging(null); setDragOver(null); return; }
    const next = [...order];
    const [rem] = next.splice(dragging, 1);
    next.splice(i, 0, rem);
    setOrder(next); setDragging(null); setDragOver(null);
  };

  const containerStyle = mobile
    ? { overflowX:'auto', display:'flex', flexDirection:'row', gap:10, paddingBottom:4, opacity:visible?1:0, transition:'opacity 450ms ease' }
    : { display:'flex', flexDirection:'row', gap:10, opacity:visible?1:0, transform:visible?'translateY(0)':'translateY(16px)', transition:'opacity 450ms ease,transform 450ms ease' };

  return (
    <div ref={ref} style={containerStyle}>
      {order.map((cardIdx, i) => (
        <div key={cardIdx}
          draggable={!mobile}
          onDragStart={e => handleDragStart(e, i)}
          onDragOver={e => handleDragOver(e, i)}
          onDrop={e => handleDrop(e, i)}
          onDragEnd={() => { setDragging(null); setDragOver(null); }}
          style={{
            flex: mobile ? '0 0 220px' : '1 1 0',
            minWidth: mobile ? 220 : 0,
            cursor: mobile ? 'default' : 'grab',
            opacity: dragging === i ? 0.35 : 1,
            transform: dragOver === i && dragging !== i ? 'scale(1.02)' : 'scale(1)',
            transition:'opacity 200ms,transform 200ms',
          }}>
          {cardDefs[cardIdx]}
        </div>
      ))}
    </div>
  );
}

const BentoStat = ({ dark, t, target, label, sub, icon, hoverBg, hoverBorder, visible }) => {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? hoverBg : t.surface,
        border: `1px solid ${hov ? hoverBorder : t.border}`,
        borderRadius:14, padding:'22px 22px', height:160,
        display:'flex', flexDirection:'column', justifyContent:'space-between', cursor:'default',
        transform: hov ? 'translateY(-4px) scale(1.01)' : 'translateY(0) scale(1)',
        boxShadow: hov
          ? `0 14px 40px ${hoverBg?.replace('0.13','0.25').replace('0.07','0.15')}, 0 0 0 1px ${hoverBorder}`
          : `0 1px 4px ${dark?'rgba(0,0,0,0.2)':'rgba(0,0,0,0.03)'}`,
        transition:'background 250ms ease,transform 220ms cubic-bezier(.34,1.2,.64,1),box-shadow 220ms,border-color 200ms',
      }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <span style={{ fontFamily:MONO, fontSize:40, fontWeight:600, color:t.t1, letterSpacing:'-0.045em', lineHeight:1 }}>
          <AnimatedCounter target={target} visible={visible}/>
        </span>
        <span style={{ fontSize:26, opacity:hov?0.9:0.18, color:hov?hoverBorder:t.t3, transition:'opacity 220ms,color 220ms,transform 220ms', transform:hov?'scale(1.2) rotate(15deg)':'scale(1) rotate(0deg)', lineHeight:1 }}>{icon}</span>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
        <span style={{ fontFamily:SANS, fontSize:13, color:t.t3 }}>{label}</span>
        <span style={{ fontFamily:MONO, fontSize:11, color:'#0F6E56', background:dark?'rgba(15,110,86,0.18)':'rgba(15,110,86,0.09)', padding:'2px 7px', borderRadius:99 }}>{sub}</span>
      </div>
    </div>
  );
};

// AI card — no score, no progress bar. The feature is not live, so the card
// only carries the "launching soon" promise the hero badge already makes.
const BentoAI = ({ dark, t }) => {
  const [hov, setHov] = useState(false);
  const hoverAccent = dark ? '#8F82FF' : '#6D61FF';
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? hoverAccent : t.accent,
        border: `1px solid ${hov ? hoverAccent : t.accent}`,
        borderRadius:14, padding:'22px 22px', height:160,
        display:'flex', flexDirection:'column', justifyContent:'space-between', cursor:'default',
        transform: hov ? 'translateY(-4px) scale(1.01)' : 'translateY(0) scale(1)',
        boxShadow: hov
          ? `0 16px 48px ${dark?'rgba(112,104,255,0.5)':'rgba(91,79,245,0.35)'}`
          : `0 4px 16px ${dark?'rgba(91,79,245,0.2)':'rgba(91,79,245,0.15)'}`,
        transition:'background 250ms ease,transform 220ms cubic-bezier(.34,1.2,.64,1),box-shadow 220ms',
      }}>
      <span style={{ fontFamily:MONO, fontSize:40, fontWeight:600, color:'#fff', letterSpacing:'-0.045em', lineHeight:1 }}>⌁</span>
      <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
        <span style={{ fontFamily:SANS, fontSize:13, color:'rgba(255,255,255,0.75)' }}>AI matching</span>
        <span style={{ fontFamily:MONO, fontSize:11, color:'rgba(255,255,255,0.9)', background:'rgba(255,255,255,0.18)', padding:'2px 7px', borderRadius:99 }}>launching soon</span>
      </div>
    </div>
  );
};

const BentoFeed = ({ dark, t, visible, jobs }) => {
  const [hov, setHov] = useState(false);
  const hoverBg  = dark ? 'rgba(15,110,86,0.13)' : 'rgba(15,110,86,0.06)';
  const hoverBrd = dark ? 'rgba(15,110,86,0.35)' : 'rgba(15,110,86,0.22)';
  const recent = jobs.slice(0, 3);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? hoverBg : t.surface,
        border: `1px solid ${hov ? hoverBrd : t.border}`,
        borderRadius:14, padding:'18px 18px', height:160,
        display:'flex', flexDirection:'column', justifyContent:'space-between', cursor:'default',
        transform: hov ? 'translateY(-4px) scale(1.01)' : 'translateY(0) scale(1)',
        boxShadow: hov
          ? `0 14px 40px ${dark?'rgba(15,110,86,0.2)':'rgba(15,110,86,0.12)'}`
          : `0 1px 4px ${dark?'rgba(0,0,0,0.2)':'rgba(0,0,0,0.03)'}`,
        transition:'background 250ms ease,transform 220ms cubic-bezier(.34,1.2,.64,1),box-shadow 220ms,border-color 200ms',
      }}>
      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
        <span className="live-dot" style={{ width:6, height:6, borderRadius:'50%', background:'#0F6E56', display:'inline-block' }}/>
        <span style={{ fontFamily:MONO, fontSize:10, color:t.t3, letterSpacing:'0.09em' }}>RECENTLY POSTED</span>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {recent.length === 0 && (
          <span style={{ fontFamily:MONO, fontSize:11, color:t.t3 }}>no postings yet</span>
        )}
        {recent.map((job, i) => (
          <div key={job.id} style={{
            display:'flex', alignItems:'center', gap:7,
            opacity:visible?1:0,
            transform:visible?'translateY(0)':'translateY(5px)',
            transition:`opacity 320ms ${i*100+200}ms, transform 320ms ${i*100+200}ms ease`,
          }}>
            <InlineIcon job={job} size={15}/>
            <span style={{ fontFamily:MONO, fontSize:12, color:t.t1, fontWeight:600, flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{job.company}</span>
            <span style={{ fontFamily:MONO, fontSize:10, color:t.t3 }}>{job.posted}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
