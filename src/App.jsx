import { useCallback, useEffect, useState } from 'react';
import { tk, MONO } from './theme';
import { Wordmark } from './components/ui';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LiveWidget from './components/LiveWidget';
import AuthForm from './components/AuthForm';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import JobDetailPage from './pages/JobDetailPage';
import PostJobPage from './pages/PostJobPage';
import AuthPage from './pages/AuthPage';
import MyJobsPage from './pages/MyJobsPage';
import ProfilePage from './pages/ProfilePage';
import useJobs from './hooks/useJobs';
import useMyJobs from './hooks/useMyJobs';
import useProfile from './hooks/useProfile';
import { parseHash, resolveRoute, go, replace, jobPath, loginPath } from './utils/routes';

// Page names used by the navbar and other components → URL paths.
const PATHS = { landing:'/', home:'/jobs', post:'/post', auth:'/login', me:'/me', profile:'/profile' };

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
  // The current URL (#/jobs, #/jobs/123 …). See utils/routes.js.
  const [location, setLocation] = useState(parseHash);
  const [transitioning, setTransitioning] = useState(false);
  const [mobile, setMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 760 : false);
  const [user, setUser] = useState(readStoredUser);
  const [signedOut, setSignedOut] = useState(false);

  const { jobs, loading, error, reload } = useJobs();
  const my = useMyJobs(user);
  const { profile, save: saveProfile, uploadResume } = useProfile(user);
  const route = resolveRoute(location, user);

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
    // Paint the page itself in the theme colour, so the macOS scroll bounce
    // (and any area outside the app) never shows the browser's white.
    const bg = tk(dark).bg;
    document.documentElement.style.backgroundColor = bg;
    document.body.style.backgroundColor = bg;
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
  }, [dark]);

  useEffect(() => {
    const r = () => setMobile(window.innerWidth < 760);
    window.addEventListener('resize', r, { passive: true });
    return () => window.removeEventListener('resize', r);
  }, []);

  // URL change (link, back/forward, redirect): fade the current page out,
  // swap while it is invisible, jump to the top, then fade the new page in.
  useEffect(() => {
    let timer = 0;
    const onHash = () => {
      clearTimeout(timer);
      setTransitioning(true);
      timer = setTimeout(() => {
        setLocation(parseHash());
        window.scrollTo({ top: 0, behavior: 'instant' });
        requestAnimationFrame(() => requestAnimationFrame(() => setTransitioning(false)));
      }, 240);
    };
    window.addEventListener('hashchange', onHash);
    return () => { window.removeEventListener('hashchange', onHash); clearTimeout(timer); };
  }, []);

  // Routes that only redirect (e.g. #/ when signed in → #/jobs).
  useEffect(() => {
    if (route.redirect) replace(route.redirect);
  }, [route.redirect]);

  const navigate = useCallback((name, job = null) => {
    if (name === 'detail' && job) go(jobPath(job));
    else go(PATHS[name] || '/jobs');
  }, []);

  // Actions that need an account send signed-out users to sign in first,
  // then straight back to `next`.
  const requireAuth = (next) => {
    if (user) return true;
    setSignedOut(false);
    // Replace, not push: after signing in, the login entry is replaced by
    // `next`, so Back leads to where the user was before — not the same page.
    replace(loginPath(next));
    return false;
  };

  const toggleSave = (job) => { if (requireAuth(window.location.hash.slice(1))) my.toggleSave(job); };

  const applyTo = (job) => {
    if (!requireAuth(jobPath(job))) return;
    // Open the tab first — browsers block popups opened after an await.
    if (job.applyUrl) window.open(job.applyUrl, '_blank', 'noopener,noreferrer');
    my.markApplied(job);
  };

  const handleAuthed = (u) => {
    setUser(u);
    setSignedOut(false);
    try { localStorage.setItem('user', JSON.stringify(u)); } catch { /* storage unavailable */ }
    replace(route.next || '/jobs');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setSignedOut(true);
    go('/login');
  };

  const page = route.page;
  const detailJob = page === 'detail' ? jobs.find(j => j.id === route.jobId) || null : null;

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
        currentPage={page === 'detail' ? 'home' : page} mobile={mobile} user={user} onLogout={handleLogout}/>

      <div className="page-transition" style={{
        opacity: transitioning ? 0 : 1,
        transform: transitioning ? 'translateY(12px) scale(0.995)' : 'none',
        filter: transitioning ? 'blur(4px)' : 'none',
        transition: transitioning
          ? 'opacity 220ms ease-in, transform 220ms ease-in, filter 220ms ease-in'
          : 'opacity 420ms cubic-bezier(.22,1,.36,1), transform 420ms cubic-bezier(.22,1,.36,1), filter 420ms ease-out',
      }}>
        {page === 'landing' && (
          <LandingPage dark={dark} mobile={mobile} jobs={jobs}
            onBrowse={q => go(q ? `/jobs?q=${encodeURIComponent(q)}` : '/jobs')}
            onPost={() => navigate('post')}
            onJobClick={job => navigate('detail', job)}
            authSlot={<AuthForm dark={dark} compact mode={location.query.get('mode') === 'register' ? 'register' : 'login'}
              onModeChange={m => replace(m === 'register' ? '/?mode=register' : '/')} onAuthed={handleAuthed}/>}/>
        )}
        {page === 'home' && (
          <HomePage key={route.q} dark={dark} mobile={mobile} jobs={jobs} loading={loading} error={error} onRetry={reload}
            initialQuery={route.q} onJobClick={job => navigate('detail', job)}
            savedIds={my.savedIds} appliedIds={my.appliedIds} onToggleSave={toggleSave}/>
        )}
        {page === 'detail' && (
          <JobDetailPage key={route.jobId} dark={dark} mobile={mobile} jobId={route.jobId} listJob={detailJob} user={user}
            saved={my.savedIds.has(route.jobId)} applied={my.appliedIds.has(route.jobId)}
            onToggleSave={toggleSave} onApply={applyTo}
            onBack={() => (window.history.length > 1 ? window.history.back() : go('/jobs'))}
            onSignIn={() => go(loginPath(jobPath({ id: route.jobId })))}
            profile={profile} onEditProfile={() => go('/profile')}/>
        )}
        {page === 'post' && (
          <PostJobPage dark={dark} mobile={mobile} user={user}
            onPosted={reload} onSignIn={() => go(loginPath('/post'))}/>
        )}
        {page === 'me' && (
          <MyJobsPage dark={dark} mobile={mobile} saved={my.saved} applied={my.applied}
            savedIds={my.savedIds} appliedIds={my.appliedIds} onToggleSave={toggleSave}
            onJobClick={job => navigate('detail', job)} onBrowse={() => go('/jobs')}/>
        )}
        {page === 'profile' && (
          <ProfilePage dark={dark} mobile={mobile} profile={profile} onSave={saveProfile} onUpload={uploadResume}/>
        )}
        {page === 'auth' && (
          <AuthPage dark={dark} mobile={mobile} mode={route.mode === 'register' ? 'register' : 'login'}
            onModeChange={m => replace(`/${m}${route.next ? `?next=${encodeURIComponent(route.next)}` : ''}`)}
            onAuthed={handleAuthed} signedOut={signedOut} next={route.next}
            onBrowse={() => { setSignedOut(false); go('/jobs'); }}/>
        )}
      </div>

      <Footer dark={dark}/>

      {!mobile && page === 'landing' && <LiveWidget dark={dark} jobs={jobs} onViewAll={() => go('/jobs')}/>}
    </div>
  );
}
