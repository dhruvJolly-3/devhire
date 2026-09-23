import { tk, MONO, SANS, SERIF } from '../theme';
import { CompanyAvatar, HoverBtn } from '../components/ui';

// The design source synthesised "What you'll do" / "Requirements" bullet
// lists from the mock data. These are real postings now, so the body renders
// the employer's own description instead of inventing responsibilities.
export default function JobDetailPage({ dark, job, onBack, mobile }) {
  const t = tk(dark);
  const accent = t.accent;
  const px = mobile ? 16 : 32;

  const paragraphs = (job.description || '').split(/\n\s*\n/).filter(p => p.trim());

  const sections = [
    { title:'About the role', paragraphs: paragraphs.length ? paragraphs : ['No description provided for this role yet.'] },
    ...(job.tags.length ? [{ title:"Stack you'll work with", tags:job.tags }] : []),
    { title:'How to apply', paragraphs:[`Reach out to ${job.company} directly — applications are reviewed by the team that posted this role. No recruiter calls, no resume black hole.`] },
  ];

  return (
    <div style={{ background:t.bg, minHeight:'100vh' }}>
      <div style={{ maxWidth:mobile?'100%':880, margin:'0 auto', padding:`${mobile?96:100}px ${px}px ${mobile?120:100}px` }}>
        <button onClick={onBack}
          style={{ fontFamily:MONO, fontSize:13, color:t.t3, background:'none', border:'none', padding:0, cursor:'pointer', marginBottom:32, display:'flex', alignItems:'center', gap:6, transition:'color 150ms' }}
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
                  <span style={{ color:t.t3 }}>·</span>
                  <span style={{ fontFamily:SANS, fontSize:14, color:t.t2 }}>{job.location}</span>
                  {job.salary && (<><span style={{ color:t.t3 }}>·</span><span style={{ fontFamily:MONO, fontSize:14, color:t.t2 }}>{job.salary}</span></>)}
                </div>
              </div>

              <h1 style={{ fontFamily:SERIF, fontSize:mobile?26:36, fontWeight:400, color:t.t1, margin:'0 0 20px', lineHeight:1.1, letterSpacing:'-0.018em' }}>
                {job.title}
              </h1>

              <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:24 }}>
                {job.tags.map(tag => (
                  <span key={tag} style={{ fontFamily:MONO, fontSize:11, color:t.t2, background:t.tagBg, padding:'4px 10px', borderRadius:6 }}>{tag}</span>
                ))}
                <span style={{ fontFamily:MONO, fontSize:11, color:'#18181B', background:t.lime, padding:'4px 10px', borderRadius:6 }}>{job.type}</span>
                {job.exp && <span style={{ fontFamily:MONO, fontSize:11, color:t.t2, background:t.tagBg, padding:'4px 10px', borderRadius:6 }}>{job.exp}</span>}
              </div>

              {!mobile && (
                <div style={{ display:'flex', gap:10 }}>
                  <HoverBtn style={{ background:accent, border:'none', borderRadius:14, padding:'0 24px', height:44, cursor:'pointer', fontFamily:MONO, fontSize:13, fontWeight:600, color:'#fff', display:'flex', alignItems:'center', gap:8 }}>
                    Apply on company site →
                  </HoverBtn>
                  <button style={{ background:'none', border:`1px solid ${t.border}`, borderRadius:14, padding:'0 20px', height:44, cursor:'pointer', fontFamily:SANS, fontSize:14, color:t.t1, transition:'all 150ms' }}>
                    Save for later
                  </button>
                </div>
              )}
            </div>

            <div style={{ height:1, background:t.border, margin:'0 0 48px' }}/>

            <div style={{ display:'flex', flexDirection:'column', gap:40 }}>
              {sections.map((sec, i) => (
                <div key={i}>
                  <h2 style={{ fontFamily:SERIF, fontSize:21, fontWeight:400, color:t.t1, margin:'0 0 14px', letterSpacing:'-0.01em' }}>{sec.title}</h2>
                  {sec.paragraphs?.map((p, j) => (
                    <p key={j} style={{ fontFamily:SANS, fontSize:16, color:t.t2, lineHeight:1.74, margin:'0 0 14px', whiteSpace:'pre-wrap' }}>{p}</p>
                  ))}
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
          </div>

          {!mobile && (
            <div style={{ width:280, flexShrink:0, position:'sticky', top:96, alignSelf:'flex-start' }}>
              <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:16, padding:24 }}>
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
                  <CompanyAvatar job={job} size={36} dark={dark}/>
                  <div>
                    <div style={{ fontFamily:MONO, fontSize:13, fontWeight:600, color:t.t1 }}>{job.company}</div>
                    <div style={{ fontFamily:MONO, fontSize:11, color:t.t3 }}>{job.posted}</div>
                  </div>
                </div>
                <HoverBtn style={{ width:'100%', background:accent, border:'none', borderRadius:12, height:44, cursor:'pointer', fontFamily:MONO, fontSize:13, fontWeight:600, color:'#fff', marginBottom:12, display:'block' }}>
                  Apply now →
                </HoverBtn>
                <div style={{ display:'flex', justifyContent:'center', gap:10 }}>
                  {['Share','Copy link'].map(lbl => (
                    <button key={lbl}
                      onClick={() => { if (lbl === 'Copy link') navigator.clipboard?.writeText(window.location.href); }}
                      style={{ fontFamily:MONO, fontSize:11, color:t.t3, background:'none', border:`1px solid ${t.border}`, borderRadius:8, padding:'6px 14px', cursor:'pointer', transition:'all 150ms' }}
                      onMouseEnter={e => { e.currentTarget.style.color = t.t1; e.currentTarget.style.borderColor = t.t1; }}
                      onMouseLeave={e => { e.currentTarget.style.color = t.t3; e.currentTarget.style.borderColor = t.border; }}>
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {mobile && (
        <div style={{ position:'fixed', bottom:0, left:0, right:0, height:80, background:t.surface, borderTop:`1px solid ${t.border}`, display:'flex', alignItems:'center', padding:'0 16px 16px', zIndex:50 }}>
          <button style={{ flex:1, height:52, background:accent, border:'none', borderRadius:14, fontFamily:MONO, fontSize:15, fontWeight:600, color:'#fff', cursor:'pointer' }}>
            Apply on company site →
          </button>
        </div>
      )}
    </div>
  );
}
