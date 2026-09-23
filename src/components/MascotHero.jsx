import { useRef, useState } from 'react';
import { MONO } from '../theme';

export default function MascotHero({ dark }) {
  const [hov, setHov] = useState(false);
  const [tilt, setTilt] = useState({ x:0, y:0 });
  const ref = useRef(null);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    setTilt({ x: dy * -10, y: dx * 10 });
  };
  const handleMouseLeave = () => { setHov(false); setTilt({ x:0, y:0 }); };

  const accent = dark ? '#7C6CFF' : '#5B4FF5';

  return (
    <div ref={ref}
      onMouseEnter={() => setHov(true)} onMouseLeave={handleMouseLeave} onMouseMove={handleMouseMove}
      style={{ position:'absolute', right:'2%', bottom:0, top:'5%', width:'36%', zIndex:1, display:'flex', alignItems:'flex-end', justifyContent:'center', pointerEvents:'auto', perspective:800 }}>

      {/* Glow behind mascot */}
      <div style={{ position:'absolute', bottom:'10%', left:'50%', transform:'translateX(-50%)', width:320, height:320, borderRadius:'50%',
        background:`radial-gradient(circle, ${accent}${hov?'28':'16'} 0%, transparent 70%)`,
        filter:'blur(32px)', transition:'opacity 400ms', pointerEvents:'none', zIndex:0 }}/>

      {/* Mascot image with tilt + float */}
      <div style={{
        position:'relative', zIndex:1,
        transform:`perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hov?1.06:1}) translateY(${hov?-12:0}px)`,
        transition: hov ? 'transform 200ms cubic-bezier(.34,1.2,.64,1)' : 'transform 600ms cubic-bezier(.25,.46,.45,.94)',
        animation: hov ? 'none' : 'mascotFloat 4s ease-in-out infinite',
        filter: hov
          ? `drop-shadow(0 24px 48px ${accent}55) drop-shadow(0 0 80px ${accent}30)`
          : `drop-shadow(0 16px 32px rgba(0,0,0,${dark?'0.5':'0.2'}))`,
        mixBlendMode: dark ? 'screen' : 'multiply',
        maxHeight:'80%', width:'auto',
      }}>
        <img src="/mascot-clean-compressed.png" alt="DevHire mascot"
          style={{ width:'100%', maxWidth:380, height:'auto', display:'block', userSelect:'none', pointerEvents:'none' }}/>
      </div>

      {/* Hover tooltip bubble */}
      <div style={{ position:'absolute', top:'18%', left:'8%',
        background: dark ? '#141417' : '#FFFEFB',
        border:`1px solid ${dark?'#27272B':'#E8E4DA'}`, borderRadius:12, padding:'8px 14px',
        opacity: hov ? 1 : 0,
        transform: hov ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.95)',
        transition:'opacity 220ms ease, transform 220ms ease',
        pointerEvents:'none', boxShadow:`0 8px 24px ${dark?'rgba(0,0,0,0.4)':'rgba(0,0,0,0.1)'}`, zIndex:2, whiteSpace:'nowrap' }}>
        <span style={{ fontFamily:MONO, fontSize:11, color:accent, fontWeight:600 }}>⌁ AI matching — launching soon</span>
      </div>
    </div>
  );
}
