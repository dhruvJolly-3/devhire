import { useMemo, useRef, useState } from 'react';
import { tk, MONO, SANS, SERIF } from '../theme';
import FloatingPills from '../components/FloatingPills';
import BentoStrip from '../components/BentoStrip';
import CompaniesMarquee from '../components/CompaniesMarquee';
import JobCard from '../components/JobCard';
import { HoverBtn } from '../components/ui';
import useParallax from '../hooks/useParallax';
import useInView from '../hooks/useInView';

// Entry page for signed-out visitors: the pitch and a search on the left,
// sign in / create account on the right (`authSlot`). Signed-in users skip it
// and land on the job board (HomePage).
export default function LandingPage({ dark, mobile, jobs, onBrowse, onPost, onJobClick, authSlot }) {
  const t = tk(dark);
  const accent = t.accent;
  const px = mobile ? 16 : 32;

  const heroRef = useRef(null);
  const scrollY = useParallax(heroRef);
  const layer = (speed) => ({ transform: `translate3d(0, ${scrollY * speed}px, 0)`, willChange: 'transform' });
  const heroFade = Math.max(0, 1 - scrollY / 520);

  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const handleMouseMove = (e) => {
    if (!heroRef.current || mobile) return;
    const r = heroRef.current.getBoundingClientRect();
    setMousePos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  const [query, setQuery] = useState('');
  const submitSearch = (e) => { e.preventDefault(); onBrowse(query.trim()); };

  const companies = useMemo(() => [...new Set(jobs.map(j => j.company))], [jobs]);
  const cities = useMemo(() => new Set(jobs.map(j => j.city).filter(c => c !== 'Other' && c !== 'Remote')).size, [jobs]);
  const latest = useMemo(
    () => [...jobs].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 4),
    [jobs],
  );

  const btnPrimary = { background:accent, border:'none', borderRadius:14, padding:'0 26px', height:52, cursor:'pointer', fontFamily:MONO, fontSize:14, fontWeight:600, color:'#fff' };
  const btnGhost = { background:t.surface, border:`1px solid ${t.border}`, borderRadius:14, padding:'0 24px', height:52, cursor:'pointer', fontFamily:SANS, fontSize:15, color:t.t1 };

  return (
    <div style={{ background:t.bg }}>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section ref={heroRef} onMouseMove={handleMouseMove}
        style={{ minHeight:mobile?'86vh':'92vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:mobile?'110px 20px 60px':'110px 32px 80px', position:'relative', overflow:'hidden' }}>

        <div style={{ position:'absolute', top:'50%', left:'50%', transform:`translate(-50%,calc(-50% + ${scrollY * 0.5}px))`, width:900, height:900, background:`radial-gradient(circle,${accent}12 0%,transparent 60%)`, pointerEvents:'none' }}/>
        {!mobile && (
          <div style={{ position:'absolute', left:`${mousePos.x}%`, top:`${mousePos.y}%`, transform:'translate(-50%,-50%)', width:460, height:460, background:`radial-gradient(circle,${accent}0A 0%,transparent 65%)`, pointerEvents:'none', transition:'left 500ms ease,top 500ms ease' }}/>
        )}

        <div style={{ position:'absolute', inset:0, pointerEvents:'none', ...layer(0.35) }}>
          <FloatingPills dark={dark} mobile={mobile}/>
        </div>

        <div style={{ position:'relative', zIndex:1, width:'100%', maxWidth:1200, margin:'0 auto', display:'grid',
          gridTemplateColumns:mobile ? '1fr' : 'minmax(0,1.25fr) minmax(360px,420px)', gap:mobile ? 40 : 64, alignItems:'center' }}>

        {/* Left — pitch + search */}
        <div style={{ textAlign:mobile ? 'center' : 'left', ...layer(-0.08), opacity:heroFade }}>
          <span style={{ display:'inline-flex', alignItems:'center', gap:7, background:t.lime, color:'#18181B', fontFamily:MONO, fontSize:12, fontWeight:600, padding:'6px 16px', borderRadius:999, marginBottom:28 }}>
            ⌁ &nbsp;AI match score — now live
          </span>

          <h1 style={{ fontFamily:SERIF, fontSize:mobile?44:72, fontWeight:400, lineHeight:1.0, color:t.t1, margin:'0 0 24px', letterSpacing:'-0.03em' }}>
            Find your next role,{' '}
            <em style={{ color:accent, fontStyle:'italic' }}>fast.</em>
          </h1>

          <p style={{ fontFamily:SANS, fontSize:mobile?16:18, color:t.t2, maxWidth:540, margin:mobile ? '0 auto 32px' : '0 0 32px', lineHeight:1.65 }}>
            Developer jobs across Bangalore, Delhi NCR, Mumbai, Hyderabad, Pune and Chennai — refreshed live, with an AI that tells you how well you fit before you apply.
          </p>

          <form onSubmit={submitSearch} style={{ display:'flex', gap:10, maxWidth:620, margin:mobile ? '0 auto 18px' : '0 0 18px', flexDirection:mobile?'column':'row' }}>
            <input value={query} onChange={e => setQuery(e.target.value)}
              placeholder="React, Node.js, Bangalore, Razorpay…"
              style={{ flex:1, height:52, borderRadius:14, border:`1.5px solid ${t.border}`, background:t.surface, padding:'0 20px', fontFamily:MONO, fontSize:13, color:t.t1, outline:'none' }}
              onFocus={e => { e.currentTarget.style.borderColor = accent; }}
              onBlur={e => { e.currentTarget.style.borderColor = t.border; }}/>
            <HoverBtn type="submit" style={btnPrimary}>Search jobs →</HoverBtn>
          </form>

          <div style={{ display:'flex', gap:10, justifyContent:mobile ? 'center' : 'flex-start', flexWrap:'wrap' }}>
            <button onClick={() => onBrowse('')} style={{ ...btnGhost, height:40, fontSize:14, borderRadius:99 }}>Browse all jobs</button>
            <button onClick={onPost} style={{ ...btnGhost, height:40, fontSize:14, borderRadius:99 }}>Hiring? Post a job</button>
          </div>
        </div>

        {/* Right — sign in / create account */}
        <div style={{
          textAlign:'left', background: dark ? 'rgba(20,20,23,0.82)' : 'rgba(255,254,251,0.9)',
          backdropFilter:'blur(18px)', WebkitBackdropFilter:'blur(18px)',
          border:`1px solid ${t.border}`, borderRadius:22, padding:mobile ? 24 : 32,
          boxShadow: dark ? '0 24px 64px rgba(0,0,0,0.45)' : '0 24px 64px rgba(24,24,27,0.10)',
        }}>
          {authSlot}
        </div>
        </div>

        {!mobile && (
          <div style={{ position:'absolute', bottom:28, left:'50%', transform:'translateX(-50%)', fontFamily:MONO, fontSize:11, color:t.t3, letterSpacing:'0.1em', opacity:heroFade, animation:'mascotFloat 2.4s ease-in-out infinite' }}>
            SCROLL ↓
          </div>
        )}
      </section>

      {/* ── Live stats + companies ────────────────────────────────────── */}
      <section style={{ maxWidth:1200, margin:'0 auto', padding:`0 ${px}px` }}>
        <BentoStrip dark={dark} mobile={mobile} jobs={jobs} companyCount={companies.length} cityCount={cities}/>
      </section>
      <div style={{ marginTop:40 }}>
        <CompaniesMarquee dark={dark} companies={companies}/>
      </div>

      {/* ── Features ──────────────────────────────────────────────────── */}
      <Section dark={dark} mobile={mobile} eyebrow="WHY DEVHIRE" title={<>Less scrolling. <em style={{ color:accent }}>More offers.</em></>}>
        <Grid mobile={mobile} cols={3}>
          {[
            ['⌁', 'AI match score', 'Paste your resume on any job and get a 0–100 fit score with your strengths and gaps — before you apply.'],
            ['↻', 'Live job feed', 'Roles are pulled from public job APIs every 30 minutes and de-duplicated, so the board is always fresh.'],
            ['✦', 'Cover letters in seconds', 'Generate a tailored cover letter from your resume and the job description, then copy it straight out.'],
          ].map(([icon, title, body], i) => (
            <Reveal key={title} delay={i * 90}>
              <Card dark={dark}>
                <div style={{ width:44, height:44, borderRadius:12, background:`${accent}18`, color:accent, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, marginBottom:18 }}>{icon}</div>
                <h3 style={{ fontFamily:SANS, fontSize:18, fontWeight:600, color:t.t1, margin:'0 0 8px' }}>{title}</h3>
                <p style={{ fontFamily:SANS, fontSize:15, color:t.t2, lineHeight:1.65, margin:0 }}>{body}</p>
              </Card>
            </Reveal>
          ))}
        </Grid>
      </Section>

      {/* ── How it works ──────────────────────────────────────────────── */}
      <Section dark={dark} mobile={mobile} eyebrow="HOW IT WORKS" title="Three steps to your next role">
        <Grid mobile={mobile} cols={3}>
          {[
            ['01', 'Search & filter', 'Filter by stack, remote / hybrid / onsite, and sort by newest.'],
            ['02', 'Check your fit', 'Sign in, paste your resume, and see your match score for any role.'],
            ['03', 'Apply directly', 'Apply on the company’s own page — no recruiters in between.'],
          ].map(([n, title, body], i) => (
            <Reveal key={n} delay={i * 90}>
              <div style={{ borderTop:`2px solid ${i === 0 ? accent : t.border}`, paddingTop:20 }}>
                <div style={{ fontFamily:MONO, fontSize:13, color:accent, marginBottom:10 }}>{n}</div>
                <h3 style={{ fontFamily:SANS, fontSize:18, fontWeight:600, color:t.t1, margin:'0 0 8px' }}>{title}</h3>
                <p style={{ fontFamily:SANS, fontSize:15, color:t.t2, lineHeight:1.65, margin:0 }}>{body}</p>
              </div>
            </Reveal>
          ))}
        </Grid>
      </Section>

      {/* ── Latest roles ──────────────────────────────────────────────── */}
      {latest.length > 0 && (
        <Section dark={dark} mobile={mobile} eyebrow="JUST POSTED" title="Latest roles"
          action={<button onClick={() => onBrowse('')} style={{ background:'none', border:'none', fontFamily:MONO, fontSize:13, color:accent, cursor:'pointer' }}>View all jobs →</button>}>
          <Grid mobile={mobile} cols={2}>
            {latest.map((job, i) => (
              <JobCard key={job.id} job={job} dark={dark} mobile={mobile} idx={i} onClick={onJobClick}/>
            ))}
          </Grid>
        </Section>
      )}

      {/* ── Final CTA ─────────────────────────────────────────────────── */}
      <section style={{ maxWidth:1200, margin:'0 auto', padding:`40px ${px}px 110px` }}>
        <Reveal>
          <div style={{ borderRadius:28, padding:mobile?'48px 24px':'72px 48px', textAlign:'center', position:'relative', overflow:'hidden',
            background:`linear-gradient(135deg, ${accent} 0%, ${dark ? '#4A3FD1' : '#3F35C9'} 100%)` }}>
            <div style={{ position:'absolute', top:-120, right:-80, width:360, height:360, borderRadius:'50%', background:t.lime, opacity:0.18, filter:'blur(40px)' }}/>
            <h2 style={{ position:'relative', fontFamily:SERIF, fontSize:mobile?34:52, fontWeight:400, color:'#fff', margin:'0 0 14px', letterSpacing:'-0.02em', lineHeight:1.05 }}>
              Your next role is one search away.
            </h2>
            <p style={{ position:'relative', fontFamily:SANS, fontSize:16, color:'rgba(255,255,255,0.8)', margin:'0 auto 30px', maxWidth:460 }}>
              {jobs.length > 0 ? `${jobs.length} open roles right now.` : 'New roles every 30 minutes.'} Free for developers, always.
            </p>
            <HoverBtn onClick={() => onBrowse('')}
              style={{ position:'relative', background:t.lime, border:'none', borderRadius:14, padding:'0 30px', height:54, cursor:'pointer', fontFamily:MONO, fontSize:14, fontWeight:600, color:'#18181B' }}>
              Browse jobs →
            </HoverBtn>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

// ── layout helpers ─────────────────────────────────────────────────────────
function Section({ dark, mobile, eyebrow, title, action, children }) {
  const t = tk(dark);
  return (
    <section style={{ maxWidth:1200, margin:'0 auto', padding:`${mobile ? 72 : 110}px ${mobile ? 16 : 32}px 0` }}>
      <Reveal>
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:16, marginBottom:mobile ? 28 : 44, flexWrap:'wrap' }}>
          <div>
            <div style={{ fontFamily:MONO, fontSize:11, color:t.t3, letterSpacing:'0.12em', marginBottom:12 }}>{eyebrow}</div>
            <h2 style={{ fontFamily:SERIF, fontSize:mobile ? 34 : 48, fontWeight:400, color:t.t1, margin:0, letterSpacing:'-0.02em', lineHeight:1.05 }}>{title}</h2>
          </div>
          {action}
        </div>
      </Reveal>
      {children}
    </section>
  );
}

function Grid({ mobile, cols, children }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:mobile ? '1fr' : `repeat(${cols}, 1fr)`, gap:mobile ? 14 : 20 }}>
      {children}
    </div>
  );
}

function Card({ dark, children }) {
  const t = tk(dark);
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ height:'100%', background:t.surface, border:`1px solid ${hov ? t.accent + '55' : t.border}`, borderRadius:18, padding:28,
        transform:hov ? 'translateY(-4px)' : 'none', boxShadow:hov ? `0 16px 40px ${dark ? 'rgba(0,0,0,0.35)' : 'rgba(24,24,27,0.08)'}` : 'none',
        transition:'transform 260ms cubic-bezier(.22,1,.36,1), box-shadow 260ms, border-color 200ms' }}>
      {children}
    </div>
  );
}

// Fades + lifts its children in the first time they scroll into view.
function Reveal({ delay = 0, children }) {
  const [ref, visible] = useInView(0.15);
  return (
    <div ref={ref} className="reveal" style={{
      height:'100%', opacity:visible ? 1 : 0, transform:visible ? 'none' : 'translateY(24px)',
      transition:`opacity 700ms ${delay}ms cubic-bezier(.22,1,.36,1), transform 700ms ${delay}ms cubic-bezier(.22,1,.36,1)`,
    }}>
      {children}
    </div>
  );
}
