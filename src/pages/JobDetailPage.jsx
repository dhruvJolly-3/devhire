import { useEffect, useState } from 'react';
import api from '../api/axios';
import { tk, MONO, SANS, SERIF } from '../theme';
import { CompanyAvatar, HoverBtn } from '../components/ui';
import AiAssistant from '../components/AiAssistant';
import { normalizeJob } from '../utils/job';

// Loads the full job for #/jobs/:id. The list only carries a short summary,
// so the list's copy (if any) is shown straight away while the full
// description loads.
function useJob(jobId, listJob) {
  const [state, setState] = useState({ id: jobId, job: listJob, loading: true, error: '' });
  useEffect(() => {
    let cancelled = false;
    api.get(`/jobs/${jobId}`)
      .then(res => { if (!cancelled) setState({ id: jobId, job: normalizeJob(res.data), loading: false, error: '' }); })
      .catch(err => {
        if (cancelled) return;
        const gone = err.response?.status === 404;
        setState(s => ({ ...s, id: jobId, loading: false, error: gone ? 'This job is no longer available.' : 'Could not load this job. Check your connection and try again.' }));
      });
    return () => { cancelled = true; };
  }, [jobId]);
  // A different job id in the URL: show the list copy until the fetch lands.
  return state.id === jobId ? state : { job: listJob, loading: true, error: '' };
}

export default function JobDetailPage({ dark, mobile, jobId, listJob, user, saved, applied,
  onToggleSave, onApply, onBack, onSignIn, profile, onEditProfile }) {
  const t = tk(dark);
  const accent = t.accent;
  const px = mobile ? 16 : 32;
  const { job, loading, error } = useJob(jobId, listJob);
  const [copied, setCopied] = useState(false);

  if (!job) {
    return (
      <div style={{ background:t.bg, minHeight:'100vh', padding:'140px 24px', textAlign:'center' }}>
        <p style={{ fontFamily:SANS, fontSize:18, color:t.t1, margin:'0 0 8px' }}>{loading ? 'Loading job…' : error}</p>
        {!loading && (
          <button onClick={onBack} style={{ marginTop:16, fontFamily:MONO, fontSize:12, color:'#fff', background:accent, border:'none', borderRadius:8, padding:'10px 20px', cursor:'pointer' }}>
            ← Back to all jobs
          </button>
        )}
      </div>
    );
  }

  const external = Boolean(job.applyUrl);
  const applyLabel = applied ? '✓ Applied' : !user ? 'Sign in to apply' : external ? 'Apply on company site ↗' : 'Apply on DevHire →';
  const apply = () => { if (!applied || external) onApply(job); };

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: `${job.title} at ${job.company}`, url });
      else await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* share sheet dismissed */ }
  };

  const paragraphs = (job.description || '').split(/\n\s*\n/).filter(p => p.trim());
  const sections = [
    { title:'About the role', paragraphs: paragraphs.length ? paragraphs : ['No description provided for this role yet.'] },
    ...(job.tags.length ? [{ title:'Skills', tags:job.tags }] : []),
    { title:'How to apply', paragraphs:[external
      ? `This role is listed on ${job.sourceLabel || 'an external job board'}. Sign in and use Apply to open the original posting — we'll keep track of it under My jobs.`
      : `Apply on DevHire and ${job.company} will see your application. You can track it under My jobs.`] },
  ];

  const primaryBtn = { background:applied && !external ? t.success : accent, border:'none', cursor:applied && !external ? 'default' : 'pointer', fontFamily:MONO, fontWeight:600, color:'#fff' };
  const saveBtn = (
    <button onClick={() => onToggleSave(job)} aria-pressed={saved}
      style={{ background:saved ? `${accent}18` : 'none', border:`1px solid ${saved ? accent : t.border}`, borderRadius:14, padding:'0 20px', height:44, cursor:'pointer', fontFamily:SANS, fontSize:14, color:saved ? accent : t.t1, transition:'all 150ms' }}>
      {saved ? '★ Saved' : '☆ Save for later'}
    </button>
  );

  return (
    <div style={{ background:t.bg, minHeight:'100vh' }}>
      <div style={{ maxWidth:mobile?'100%':1040, margin:'0 auto', padding:`${mobile?96:100}px ${px}px ${mobile?120:100}px` }}>
        <button onClick={onBack}
          style={{ fontFamily:MONO, fontSize:13, color:t.t3, background:'none', border:'none', padding:0, cursor:'pointer', marginBottom:32, display:'flex', alignItems:'center', gap:6 }}
          onMouseEnter={e => { e.currentTarget.style.color = t.t1; }}
          onMouseLeave={e => { e.currentTarget.style.color = t.t3; }}>
          ← all jobs
        </button>

        <div style={{ display:'flex', gap:40, alignItems:'flex-start' }}>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ marginBottom:36 }}>
              <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:16 }}>
                <CompanyAvatar job={job} size={56} dark={dark}/>
                <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                  <span style={{ fontFamily:MONO, fontSize:14, color:t.t2 }}>{job.company}</span>
                  {job.sourceLabel && <span style={{ fontFamily:MONO, fontSize:12, color:accent }}>via {job.sourceLabel}</span>}
                  <span style={{ color:t.t3 }}>·</span>
                  <span style={{ fontFamily:SANS, fontSize:14, color:t.t2 }}>{job.location}</span>
                  {job.salary && (<><span style={{ color:t.t3 }}>·</span><span style={{ fontFamily:MONO, fontSize:14, color:t.t2 }}>{job.salary}</span></>)}
                </div>
              </div>

              <h1 style={{ fontFamily:SERIF, fontSize:mobile?28:38, fontWeight:400, color:t.t1, margin:'0 0 20px', lineHeight:1.1, letterSpacing:'-0.018em' }}>
                {job.title}
              </h1>

              <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:24 }}>
                <span style={{ fontFamily:MONO, fontSize:11, color:'#18181B', background:t.lime, padding:'4px 10px', borderRadius:6 }}>{job.type}</span>
                {job.exp && <span style={{ fontFamily:MONO, fontSize:11, color:t.t2, background:t.tagBg, padding:'4px 10px', borderRadius:6 }}>{job.exp}</span>}
                <span style={{ fontFamily:MONO, fontSize:11, color:t.t2, background:t.tagBg, padding:'4px 10px', borderRadius:6 }}>Posted {job.posted}</span>
              </div>

              {!mobile && (
                <div style={{ display:'flex', gap:10 }}>
                  <HoverBtn onClick={apply} style={{ ...primaryBtn, borderRadius:14, padding:'0 24px', height:44, fontSize:13 }}>{applyLabel}</HoverBtn>
                  {saveBtn}
                </div>
              )}
            </div>

            <div style={{ height:1, background:t.border, margin:'0 0 40px' }}/>

            <div style={{ display:'flex', flexDirection:'column', gap:36 }}>
              {sections.map((sec, i) => (
                <div key={i}>
                  <h2 style={{ fontFamily:SERIF, fontSize:22, fontWeight:400, color:t.t1, margin:'0 0 14px', letterSpacing:'-0.01em' }}>{sec.title}</h2>
                  {sec.paragraphs?.map((p, j) => (
                    <p key={j} style={{ fontFamily:SANS, fontSize:16, color:t.t2, lineHeight:1.74, margin:'0 0 14px', whiteSpace:'pre-wrap' }}>{p}</p>
                  ))}
                  {i === 0 && loading && <p style={{ fontFamily:MONO, fontSize:12, color:t.t3 }}>loading full description…</p>}
                  {sec.tags && (
                    <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                      {sec.tags.map(tag => (
                        <span key={tag} style={{ fontFamily:MONO, fontSize:12, color:t.t2, background:t.tagBg, padding:'6px 14px', borderRadius:8 }}>{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ marginTop:48 }}>
              <AiAssistant dark={dark} job={job} user={user} onSignIn={onSignIn} profile={profile} onEditProfile={onEditProfile}/>
            </div>
          </div>

          {!mobile && (
            <div style={{ width:300, flexShrink:0, position:'sticky', top:96, alignSelf:'flex-start' }}>
              <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:16, padding:24 }}>
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:18 }}>
                  <CompanyAvatar job={job} size={36} dark={dark}/>
                  <div>
                    <div style={{ fontFamily:MONO, fontSize:13, fontWeight:600, color:t.t1 }}>{job.company}</div>
                    <div style={{ fontFamily:MONO, fontSize:11, color:t.t3 }}>{job.city !== 'Other' ? job.city : job.location} · {job.posted}</div>
                  </div>
                </div>
                <HoverBtn onClick={apply} style={{ ...primaryBtn, width:'100%', borderRadius:12, height:44, fontSize:13, marginBottom:10, display:'block' }}>{applyLabel}</HoverBtn>
                <div style={{ display:'flex', gap:8 }}>
                  <button onClick={() => onToggleSave(job)} style={{ flex:1, fontFamily:MONO, fontSize:11, color:saved ? accent : t.t2, background:'none', border:`1px solid ${saved ? accent : t.border}`, borderRadius:8, padding:'8px 0', cursor:'pointer' }}>
                    {saved ? '★ Saved' : '☆ Save'}
                  </button>
                  <button onClick={share} style={{ flex:1, fontFamily:MONO, fontSize:11, color:t.t2, background:'none', border:`1px solid ${t.border}`, borderRadius:8, padding:'8px 0', cursor:'pointer' }}>
                    {copied ? '✓ Link copied' : 'Share / copy link'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {mobile && (
        <div style={{ position:'fixed', bottom:0, left:0, right:0, background:t.surface, borderTop:`1px solid ${t.border}`, display:'flex', gap:10, alignItems:'center', padding:'12px 16px 20px', zIndex:50 }}>
          <button onClick={() => onToggleSave(job)} aria-label={saved ? 'Saved' : 'Save job'}
            style={{ width:52, height:52, borderRadius:14, border:`1px solid ${saved ? accent : t.border}`, background:'none', color:saved ? accent : t.t2, fontSize:20, cursor:'pointer' }}>
            {saved ? '★' : '☆'}
          </button>
          <button onClick={apply} style={{ ...primaryBtn, flex:1, height:52, borderRadius:14, fontSize:15 }}>{applyLabel}</button>
        </div>
      )}
    </div>
  );
}
