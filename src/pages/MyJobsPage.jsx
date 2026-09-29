import { useState } from 'react';
import { tk, MONO, SANS, SERIF } from '../theme';
import JobCard from '../components/JobCard';

// #/me — the signed-in user's saved and applied jobs.
export default function MyJobsPage({ dark, mobile, saved, applied, savedIds, appliedIds, onToggleSave, onJobClick, onBrowse }) {
  const t = tk(dark);
  const [tab, setTab] = useState('saved');
  const list = tab === 'saved' ? saved : applied.map(a => a.job);

  return (
    <div style={{ background:t.bg, minHeight:'100vh' }}>
      <div style={{ maxWidth:900, margin:'0 auto', padding:mobile?'96px 16px 100px':'116px 32px 110px' }}>
        <div style={{ fontFamily:MONO, fontSize:11, color:t.t3, letterSpacing:'0.12em', marginBottom:10 }}>MY JOBS</div>
        <h1 style={{ fontFamily:SERIF, fontSize:mobile?36:48, fontWeight:400, color:t.t1, margin:'0 0 28px', letterSpacing:'-0.025em' }}>
          Your <em style={{ color:t.accent }}>shortlist</em>
        </h1>

        <div role="tablist" style={{ display:'flex', gap:6, borderBottom:`1px solid ${t.border}`, marginBottom:24 }}>
          {[['saved', `Saved (${saved.length})`], ['applied', `Applied (${applied.length})`]].map(([key, label]) => (
            <button key={key} role="tab" aria-selected={tab === key} onClick={() => setTab(key)}
              style={{ background:'none', border:'none', borderBottom:`2px solid ${tab === key ? t.accent : 'transparent'}`, marginBottom:-1,
                padding:'10px 14px', fontFamily:SANS, fontSize:15, fontWeight:tab === key ? 600 : 400, color:tab === key ? t.t1 : t.t2, cursor:'pointer', transition:'all 180ms' }}>
              {label}
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <div style={{ borderRadius:14, border:`1px dashed ${t.border}`, padding:'56px 24px', textAlign:'center' }}>
            <p style={{ fontFamily:SANS, fontSize:16, color:t.t1, margin:'0 0 6px' }}>
              {tab === 'saved' ? 'No saved jobs yet.' : "You haven't applied to anything yet."}
            </p>
            <p style={{ fontFamily:SANS, fontSize:14, color:t.t2, margin:'0 0 18px' }}>
              {tab === 'saved' ? 'Tap ☆ on any job to keep it here.' : 'Jobs you apply to show up here so you can track them.'}
            </p>
            <button onClick={onBrowse} style={{ fontFamily:MONO, fontSize:12, color:'#fff', background:t.accent, border:'none', borderRadius:8, padding:'10px 20px', cursor:'pointer' }}>Browse jobs →</button>
          </div>
        ) : (
          <div key={tab} className="fade-swap" style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {list.map((job, i) => (
              <JobCard key={job.id} job={job} dark={dark} mobile={mobile} idx={i} onClick={onJobClick}
                saved={savedIds.has(job.id)} applied={appliedIds.has(job.id)} onToggleSave={onToggleSave}/>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
