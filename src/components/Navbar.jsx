import { useEffect, useState } from 'react';
import { tk, MONO, SANS } from '../theme';
import { Wordmark, NavLink, HoverBtn } from './ui';

export default function Navbar({ dark, onToggleDark, onNavigate, currentPage, mobile, user, onLogout }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [narrow, setNarrow] = useState(typeof window !== 'undefined' ? window.innerWidth < 760 : false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', h, { passive: true });
    const r = () => setNarrow(window.innerWidth < 760);
    window.addEventListener('resize', r, { passive: true });
    r();
    return () => { window.removeEventListener('scroll', h); window.removeEventListener('resize', r); };
  }, []);

  const compact = mobile || narrow;
  // The drawer only exists in compact mode, so leaving desktop closes it.
  const drawerOpen = compact && menuOpen;
  const handleNav = (p) => { onNavigate(p); setMenuOpen(false); };

  const t = tk(dark);
  const bg = dark
    ? scrolled || drawerOpen ? 'rgba(13,13,16,0.96)' : 'transparent'
    : scrolled || drawerOpen ? 'rgba(250,248,243,0.96)' : 'transparent';

  return (
    <>
      <nav style={{ position:'fixed', top:0, left:0, right:0, height:64, zIndex:50,
        background:bg,
        borderBottom:(scrolled||drawerOpen)?`1px solid ${t.border}`:'1px solid transparent',
        backdropFilter:(scrolled||drawerOpen)?'blur(16px)':'none',
        transition:'background 280ms,border-color 280ms' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:compact?'0 20px':'0 32px', height:'100%', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <Wordmark dark={dark} onClick={() => handleNav('home')}/>

          {!compact && (
            <div style={{ display:'flex', alignItems:'center', gap:28 }}>
              <NavLink label="Jobs" dark={dark} onClick={() => handleNav('home')} active={currentPage==='home'}/>
              <NavLink label="For companies" dark={dark} onClick={() => handleNav('post')} active={currentPage==='post'}/>
              <button onClick={onToggleDark}
                style={{ background:'none', border:`1px solid ${t.border}`, borderRadius:99, padding:'5px 12px', cursor:'pointer', fontFamily:MONO, fontSize:11, color:t.t3, letterSpacing:'0.05em', transition:'all 150ms' }}>
                {dark ? 'LIGHT' : 'DARK'}
              </button>
              {user ? (
                <>
                  <span style={{ fontFamily:MONO, fontSize:12, color:t.t2 }}>{user.name || user.email}</span>
                  <button onClick={onLogout}
                    style={{ background:'none', border:`1px solid ${t.border}`, borderRadius:99, padding:'8px 18px', cursor:'pointer', fontFamily:SANS, fontSize:14, color:t.t1, transition:'all 150ms' }}>
                    Sign out
                  </button>
                </>
              ) : (
                <button onClick={() => handleNav('auth')}
                  style={{ background:'none', border:`1px solid ${t.border}`, borderRadius:99, padding:'8px 18px', cursor:'pointer', fontFamily:SANS, fontSize:14, color:t.t1, transition:'all 150ms' }}>
                  Sign in
                </button>
              )}
              <HoverBtn onClick={() => handleNav('post')}
                style={{ background:t.accent, border:'none', borderRadius:99, padding:'8px 18px', cursor:'pointer', fontFamily:SANS, fontSize:14, fontWeight:600, color:'#fff' }}>
                Post a job
              </HoverBtn>
            </div>
          )}

          {compact && (
            <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu"
              style={{ background:'none', border:'none', cursor:'pointer', padding:'8px', display:'flex', flexDirection:'column', gap:5, alignItems:'flex-end' }}>
              <span style={{ display:'block', width:22, height:1.5, background:t.t1, borderRadius:99, transition:'all 250ms', transform:menuOpen?'translateY(6.5px) rotate(45deg)':'none' }}/>
              <span style={{ display:'block', width:16, height:1.5, background:t.t1, borderRadius:99, transition:'all 250ms', opacity:menuOpen?0:1 }}/>
              <span style={{ display:'block', width:22, height:1.5, background:t.t1, borderRadius:99, transition:'all 250ms', transform:menuOpen?'translateY(-6.5px) rotate(-45deg)':'none' }}/>
            </button>
          )}
        </div>
      </nav>

      {drawerOpen && (
        <div style={{ position:'fixed', top:64, left:0, right:0, zIndex:49, background:t.surface, borderBottom:`1px solid ${t.border}`, padding:'12px 20px 24px', display:'flex', flexDirection:'column', gap:0, boxShadow:`0 12px 32px ${dark?'rgba(0,0,0,0.5)':'rgba(0,0,0,0.08)'}` }}>
          {[['Jobs','home'],['For companies','post']].map(([label, page]) => (
            <button key={label} onClick={() => handleNav(page)}
              style={{ textAlign:'left', padding:'14px 0', fontFamily:SANS, fontSize:16, fontWeight:400, color:t.t1, background:'none', border:'none', borderBottom:`1px solid ${t.border}`, cursor:'pointer' }}>
              {label}
            </button>
          ))}
          <div style={{ display:'flex', gap:10, marginTop:16 }}>
            <button onClick={() => (user ? onLogout() : handleNav('auth'))}
              style={{ flex:1, padding:'12px 0', fontFamily:SANS, fontSize:14, color:t.t1, background:'none', border:`1px solid ${t.border}`, borderRadius:99, cursor:'pointer' }}>
              {user ? 'Sign out' : 'Sign in'}
            </button>
            <button onClick={() => handleNav('post')}
              style={{ flex:1, padding:'12px 0', fontFamily:SANS, fontSize:14, fontWeight:600, color:'#fff', background:t.accent, border:'none', borderRadius:99, cursor:'pointer' }}>
              Post a job
            </button>
          </div>
          <button onClick={onToggleDark}
            style={{ marginTop:12, padding:'10px 0', fontFamily:MONO, fontSize:11, color:t.t3, background:'none', border:'none', letterSpacing:'0.06em', cursor:'pointer', textAlign:'left' }}>
            {dark ? 'SWITCH TO LIGHT MODE' : 'SWITCH TO DARK MODE'}
          </button>
        </div>
      )}
    </>
  );
}
