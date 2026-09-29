import { tk, MONO } from '../theme';
import AuthBackground from '../components/AuthBackground';
import AuthForm from '../components/AuthForm';

// Full-page sign in / create account, over the animated background.
export default function AuthPage({ dark, mobile, mode, onModeChange, onAuthed, signedOut, next, onBrowse }) {
  const t = tk(dark);
  const notice = signedOut
    ? "✓ You've been signed out."
    : next ? 'Please sign in to continue — you’ll be taken right back.' : '';

  return (
    <div style={{ background:t.bg, minHeight:'100vh', position:'relative', overflow:'hidden' }}>
      <AuthBackground dark={dark}/>
      <div style={{ position:'relative', zIndex:1, maxWidth:460, margin:'0 auto', padding:`${mobile?100:130}px ${mobile?16:32}px 100px` }}>
        <div style={{
          background: dark ? 'rgba(20,20,23,0.72)' : 'rgba(255,254,251,0.78)',
          backdropFilter:'blur(18px)', WebkitBackdropFilter:'blur(18px)',
          border:`1px solid ${t.border}`, borderRadius:20, padding:mobile?24:36,
          boxShadow: dark ? '0 24px 64px rgba(0,0,0,0.45)' : '0 24px 64px rgba(24,24,27,0.10)',
        }}>
          <AuthForm dark={dark} mode={mode} onModeChange={onModeChange} onAuthed={onAuthed} notice={notice}/>
        </div>
        <div style={{ textAlign:'center', marginTop:20 }}>
          <button type="button" onClick={onBrowse}
            style={{ background:'none', border:'none', fontFamily:MONO, fontSize:12, color:t.t2, cursor:'pointer' }}>
            or browse jobs without an account →
          </button>
        </div>
      </div>
    </div>
  );
}
