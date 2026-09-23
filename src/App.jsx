import { useCallback, useEffect, useState } from 'react';
import { tk, MONO } from './theme';
import { Wordmark } from './components/ui';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LiveWidget from './components/LiveWidget';
import HomePage from './pages/HomePage';
import JobDetailPage from './pages/JobDetailPage';
import PostJobPage from './pages/PostJobPage';
import AuthPage from './pages/AuthPage';
import useJobs from './hooks/useJobs';

const readStoredUser = () => {
  try {
    const raw = localStorage.getItem('user');
    return localStorage.getItem('token') && raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export default function App() {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const [page, setPage] = useState('home');
  const [activeJob, setActiveJob] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const [mobile, setMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 760 : false);
  const [user, setUser] = useState(readStoredUser);

  const { jobs, loading, error, reload } = useJobs();

  // Loading splash — advances on a timer but will not dismiss before the
  // first /api/jobs response has landed.
  const [splashDone, setSplashDone] = useState(false);
  const [splashGone, setSplashGone] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timers = [[18,0],[45,400],[72,900],[91,1500]].map(([to, d]) => setTimeout(() => setProgress(to), d));
    return () => timers.forEach(clearTimeout);
  }, []);

  // Splash dismissal is a timed sequence driven by the fetch completing.
  useEffect(() => {
    if (loading) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress(100);
    const a = setTimeout(() => setSplashDone(true), 350);
    const b = setTimeout(() => setSplashGone(true), 930);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [loading]);

  useEffect(() => {
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    const r = () => setMobile(window.innerWidth < 760);
    window.addEventListener('resize', r, { passive: true });
    return () => window.removeEventListener('resize', r);
  }, []);

  const navigate = useCallback((next, job = null) => {
    setTransitioning(true);
    setTimeout(() => {
      setPage(next);
      setActiveJob(job);
      window.scrollTo(0, 0);
      setTimeout(() => setTransitioning(false), 40);
    }, 260);
  }, []);

  const handleAuthed = (u) => {
    setUser(u);
    try { localStorage.setItem('user', JSON.stringify(u)); } catch { /* storage unavailable */ }
    navigate('post');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('home');
  };

  const t = tk(dark);
  const loadLabel = progress < 45 ? 'CONNECTING TO API…' : progress < 80 ? 'FETCHING JOBS…' : progress < 100 ? 'ALMOST THERE…' : 'READY';

  return (
    <div style={{ background:t.bg, minHeight:'100vh' }}>
      {/* Grain */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:9999, opacity:dark?0.012:0.009,
        backgroundImage:`url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>")` }}/>

      {/* Loading splash */}
      {!splashGone && (
        <div style={{
          position:'fixed', inset:0, zIndex:8000, background:t.bg,
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
          opacity: splashDone ? 0 : 1,
          transform: splashDone ? 'scale(1.04)' : 'scale(1)',
          transition:'opacity 580ms ease, transform 580ms ease',
          overflow:'hidden', pointerEvents: splashDone ? 'none' : 'auto',
        }}>
          <div style={{ position:'absolute', inset:0, background: dark
            ? 'radial-gradient(ellipse at 50% 60%, rgba(13,13,16,0.45) 0%, rgba(13,13,16,0.94) 100%)'
            : 'radial-gradient(ellipse at 50% 60%, rgba(250,248,243,0.35) 0%, rgba(250,248,243,0.90) 100%)' }}/>
          <div style={{ position:'relative', zIndex:1, textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', gap:32 }}>
            <Wordmark dark={dark}/>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
              <span style={{ fontFamily:MONO, fontSize:11, color:t.t3, letterSpacing:'0.09em' }}>{loadLabel}</span>
              <div style={{ width:200, height:2, background:dark?'rgba(255,255,255,0.08)':'rgba(0,0,0,0.08)', borderRadius:99, overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${progress}%`, background:t.accent, borderRadius:99, transition:'width 350ms cubic-bezier(.4,0,.2,1)' }}/>
              </div>
              <span style={{ fontFamily:MONO, fontSize:11, color:t.t3 }}>{progress}%</span>
            </div>
          </div>
        </div>
      )}

      <Navbar dark={dark} onToggleDark={() => setDark(d => !d)} onNavigate={navigate}
        currentPage={page} mobile={mobile} user={user} onLogout={handleLogout}/>

      <div style={{ opacity:transitioning?0:1, transform:transitioning?'translateY(10px)':'translateY(0)', transition:transitioning?'none':'opacity 280ms ease,transform 280ms ease' }}>
        {page === 'home' && (
          <HomePage dark={dark} mobile={mobile} jobs={jobs} loading={loading} error={error} onRetry={reload}
            onJobClick={job => navigate('detail', job)}/>
        )}
        {page === 'detail' && activeJob && (
          <JobDetailPage dark={dark} mobile={mobile} job={activeJob} onBack={() => navigate('home')}/>
        )}
        {page === 'post' && (
          <PostJobPage dark={dark} mobile={mobile} user={user}
            onPosted={reload} onSignIn={() => navigate('auth')}/>
        )}
        {page === 'auth' && (
          <AuthPage dark={dark} mobile={mobile} onAuthed={handleAuthed}/>
        )}
      </div>

      <Footer dark={dark}/>

      {!mobile && <LiveWidget dark={dark} jobs={jobs} onViewAll={() => navigate('home')}/>}
    </div>
  );
}
