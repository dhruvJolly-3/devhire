import { tk, MONO } from '../theme';

const FLOAT_PILLS = [
  { text:'React · Zepto',      x:'6%',  y:'22%', anim:'float0', dur:'4.2s', delay:'0s' },
  { text:'Go · Swiggy',        x:'76%', y:'18%', anim:'float1', dur:'5.1s', delay:'0.6s' },
  { text:'Python · CRED',      x:'82%', y:'62%', anim:'float2', dur:'4.7s', delay:'1.3s' },
  { text:'Node.js · Razorpay', x:'3%',  y:'68%', anim:'float3', dur:'3.9s', delay:'0.3s' },
  { text:'TypeScript',         x:'62%', y:'76%', anim:'float4', dur:'4.4s', delay:'1s' },
  { text:'⌁ AI/ML',            x:'50%', y:'8%',  anim:'float5', dur:'5.8s', delay:'1.8s' },
];

export default function FloatingPills({ dark, mobile }) {
  const t = tk(dark);
  if (mobile) return null;
  return (
    <div style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden' }}>
      {FLOAT_PILLS.map((p, i) => (
        <div key={i} style={{ position:'absolute', left:p.x, top:p.y, animation:`${p.anim} ${p.dur} ${p.delay} ease-in-out infinite`, opacity:dark?0.25:0.38 }}>
          <span style={{ fontFamily:MONO, fontSize:11, color:t.t2, background:t.surface, border:`1px solid ${t.border}`, padding:'5px 12px', borderRadius:99, whiteSpace:'nowrap', display:'block', backdropFilter:'blur(4px)' }}>
            {p.text}
          </span>
        </div>
      ))}
    </div>
  );
}
