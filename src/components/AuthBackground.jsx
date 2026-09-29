import { useEffect, useRef } from 'react';
import { tk } from '../theme';

// Animated backdrop for the sign-in / signed-out page: three soft aurora
// blobs drifting behind a slow "developer network" — dots that link up with
// lines when they come close, and lean gently towards the cursor.
export default function AuthBackground({ dark }) {
  const t = tk(dark);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const dotColor = dark ? '124,108,255' : '91,79,245';
    const mouse = { x: -9999, y: -9999 };
    let w = 0, h = 0, dpr = 1, dots = [], frame = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(90, (w * h) / 16000));
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
        r: 1 + Math.random() * 1.6,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        if (!reduced) {
          // Drift, with a gentle pull towards the cursor.
          const mx = mouse.x - d.x, my = mouse.y - d.y;
          const md = Math.hypot(mx, my);
          if (md < 180 && md > 0) { d.vx += (mx / md) * 0.012; d.vy += (my / md) * 0.012; }
          d.vx *= 0.995; d.vy *= 0.995;
          d.x += d.vx; d.y += d.vy;
          if (d.x < 0 || d.x > w) d.vx *= -1;
          if (d.y < 0 || d.y > h) d.vy *= -1;
        }
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${dotColor},${dark ? 0.7 : 0.5})`;
        ctx.fill();
      }
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const a = dots[i], b = dots[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 130) {
            ctx.strokeStyle = `rgba(${dotColor},${(1 - dist / 130) * (dark ? 0.35 : 0.22)})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      if (!reduced) frame = requestAnimationFrame(draw);
    };

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };

    resize();
    draw();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, [dark]);

  const blob = (color, size, pos, anim) => (
    <div className="aurora-blob" style={{
      position:'absolute', width:size, height:size, borderRadius:'50%', ...pos,
      background:`radial-gradient(circle, ${color} 0%, transparent 70%)`,
      filter:'blur(60px)', opacity: dark ? 0.55 : 0.45,
      animation:`${anim} infinite ease-in-out`,
    }}/>
  );

  return (
    <div aria-hidden="true" style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none', background:t.bg }}>
      {blob(t.accent, '55vmax', { top:'-20vmax', left:'-15vmax' }, 'auroraA 18s')}
      {blob(t.lime, '40vmax', { bottom:'-18vmax', right:'-10vmax' }, 'auroraB 22s')}
      {blob(dark ? '#EC4899' : '#F472B6', '35vmax', { top:'30%', right:'20%' }, 'auroraC 26s')}
      <canvas ref={canvasRef} style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}/>
      {/* Soft vignette keeps the form readable */}
      <div style={{ position:'absolute', inset:0, background: dark
        ? 'radial-gradient(ellipse at center, rgba(13,13,16,0.55) 0%, rgba(13,13,16,0.15) 70%)'
        : 'radial-gradient(ellipse at center, rgba(250,248,243,0.7) 0%, rgba(250,248,243,0.2) 70%)' }}/>
    </div>
  );
}
