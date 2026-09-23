import { useEffect, useState } from 'react';
import { tk, MONO, SANS } from '../theme';

// ─── Wordmark ──────────────────────────────────────────────────────────────
export const Wordmark = ({ dark, onClick }) => {
  const c = dark ? '#F5F4F0' : '#18181B';
  return (
    <button onClick={onClick}
      style={{ background:'none', border:'none', padding:0, cursor:'pointer', fontFamily:MONO, fontSize:18, fontWeight:600, color:c, letterSpacing:'-0.02em', display:'flex', alignItems:'baseline' }}>
      devh
      <span style={{ position:'relative', display:'inline-block' }}>
        ı
        <span style={{ position:'absolute', top:3, left:'50%', transform:'translateX(-50%)', width:4, height:4, background:'#CDEB4A', display:'block' }}/>
      </span>
      re
    </button>
  );
};

// ─── Buttons / links ───────────────────────────────────────────────────────
export const HoverBtn = ({ children, style, onClick, type = 'button', disabled }) => {
  const [hov, setHov] = useState(false);
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ ...style, opacity: disabled ? 0.6 : 1, filter: hov && !disabled ? 'brightness(1.08)' : 'none', transform: hov && !disabled ? 'scale(1.02)' : 'scale(1)', transition:'filter 150ms,transform 150ms' }}>
      {children}
    </button>
  );
};

export const NavLink = ({ label, dark, onClick, active }) => {
  const [hov, setHov] = useState(false);
  const t = tk(dark);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background:'none', border:'none', padding:0, cursor:onClick?'pointer':'default', fontFamily:SANS, fontSize:14, fontWeight:active?600:400, color:active?t.t1:t.t2, position:'relative', transition:'color 150ms' }}>
      {label}
      <span style={{ position:'absolute', bottom:-2, left:0, height:1.5, width:(hov||active)?'100%':0, background:t.accent, transition:'width 220ms ease', display:'block' }}/>
    </button>
  );
};

export const FooterLink = ({ label, t }) => {
  const [hov, setHov] = useState(false);
  return (
    <a href="#" onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ fontFamily:MONO, fontSize:12, color:hov?t.accent:t.t3, textDecoration:'none', position:'relative', transition:'color 150ms' }}>
      {label}
      <span style={{ position:'absolute', bottom:-2, left:0, height:1.5, width:hov?'100%':0, background:t.accent, transition:'width 200ms ease', display:'block' }}/>
    </a>
  );
};

// ─── Company marks ─────────────────────────────────────────────────────────
// A job with no `domain` skips the favicon fetch entirely and renders the
// colour swatch / initials fallback.
export const InlineIcon = ({ job, size = 16 }) => {
  const [ok, setOk] = useState(Boolean(job.domain));
  return ok ? (
    <img src={`https://www.google.com/s2/favicons?domain=${job.domain}&sz=64`}
      onError={() => setOk(false)}
      style={{ width:size, height:size, objectFit:'contain', borderRadius:3, flexShrink:0, verticalAlign:'middle' }}
      alt={job.company}/>
  ) : (
    <span style={{ display:'inline-block', width:size, height:size, borderRadius:3, background:job.color, flexShrink:0, verticalAlign:'middle' }}/>
  );
};

export const CompanyAvatar = ({ job, size = 40, dark = false }) => {
  const [imgOk, setImgOk] = useState(Boolean(job.domain));
  return (
    <div style={{
      width:size, height:size, borderRadius:'50%', flexShrink:0, overflow:'hidden', position:'relative',
      background: imgOk ? '#fff' : job.color,
      border: imgOk ? `1px solid ${dark ? '#2A2A2E' : '#EAE6DA'}` : 'none',
      display:'flex', alignItems:'center', justifyContent:'center',
    }}>
      {imgOk ? (
        <img src={`https://www.google.com/s2/favicons?domain=${job.domain}&sz=128`}
          alt={job.company} onError={() => setImgOk(false)}
          style={{ width:'60%', height:'60%', objectFit:'contain', display:'block' }}/>
      ) : (
        <span style={{ fontFamily:MONO, fontSize:size*0.38, fontWeight:600, color:'#fff' }}>{job.initials}</span>
      )}
    </div>
  );
};

// ─── AnimatedCounter ───────────────────────────────────────────────────────
export const AnimatedCounter = ({ target, visible, prefix = '', suffix = '' }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!visible) return;
    const dur = 1100, start = Date.now();
    let raf;
    const frame = () => {
      const p = Math.min((Date.now() - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [visible, target]);
  return <>{prefix}{val.toLocaleString()}{suffix}</>;
};
