import { tk, MONO } from '../theme';
import { FooterLink } from './ui';

export default function Footer({ dark }) {
  const t = tk(dark);
  return (
    <footer style={{ borderTop:`1px solid ${t.border}`, minHeight:80, display:'flex', alignItems:'center', background:t.bg }}>
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 32px', width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span style={{ fontFamily:MONO, fontSize:12, color:t.t3 }}>devhire · {new Date().getFullYear()}</span>
        <div style={{ display:'flex', gap:20 }}>
          {['twitter','github','rss'].map(l => <FooterLink key={l} label={l} t={t}/>)}
        </div>
      </div>
    </footer>
  );
}
