import { useState } from 'react';
import api from '../api/axios';
import { tk, MONO, SANS, SERIF } from '../theme';
import Field from './Field';
import { HoverBtn } from './ui';

// "Check my fit" + "Write a cover letter" for one job, powered by the
// /api/ai routes. Uses the resume saved on the profile unless the user
// pastes a different one. Logged-out visitors get a sign-in prompt instead.
export default function AiAssistant({ dark, job, user, onSignIn, profile, onEditProfile }) {
  const t = tk(dark);
  const savedResume = profile?.resumeText || '';
  const [resume, setResume] = useState('');
  const [pasting, setPasting] = useState(false);
  const usingSaved = Boolean(savedResume) && !pasting;
  const ready = usingSaved || Boolean(resume.trim());
  const [busy, setBusy] = useState(''); // '' | 'match' | 'letter'
  const [error, setError] = useState('');
  const [match, setMatch] = useState(null);
  const [letter, setLetter] = useState('');

  const run = async (kind) => {
    setBusy(kind);
    setError('');
    try {
      const path = kind === 'match' ? 'match' : 'cover-letter';
      const res = await api.post(`/ai/${path}/${job.id}`, usingSaved ? {} : { resume });
      if (kind === 'match') setMatch(res.data);
      else setLetter(res.data.letter);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setBusy('');
    }
  };

  const btn = (primary) => ({
    background: primary ? t.accent : 'none', color: primary ? '#fff' : t.t1,
    border: primary ? 'none' : `1px solid ${t.border}`, borderRadius:12,
    padding:'0 18px', height:42, cursor:'pointer', fontFamily:MONO, fontSize:13, fontWeight:600,
  });
  const scoreColor = !match ? t.t1 : match.score >= 70 ? '#16A34A' : match.score >= 40 ? '#D97706' : '#DC2626';

  return (
    <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:16, padding:24 }}>
      <h2 style={{ fontFamily:SERIF, fontSize:21, fontWeight:400, color:t.t1, margin:'0 0 6px' }}>AI assistant</h2>
      <p style={{ fontFamily:SANS, fontSize:14, color:t.t2, margin:'0 0 18px' }}>
        See how well your resume fits this role, or draft a cover letter.
      </p>

      {!user ? (
        <HoverBtn onClick={onSignIn} style={btn(true)}>Sign in to use the AI assistant →</HoverBtn>
      ) : (
        <>
          {usingSaved ? (
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, flexWrap:'wrap', background:t.surf2, border:`1px solid ${t.border}`, borderRadius:12, padding:'12px 16px' }}>
              <span style={{ fontFamily:SANS, fontSize:14, color:t.t1 }}>
                📄 Using your saved resume{profile.resumeFileName ? ` (${profile.resumeFileName})` : ''}
              </span>
              <span style={{ display:'flex', gap:12 }}>
                <button onClick={() => setPasting(true)} style={{ background:'none', border:'none', padding:0, fontFamily:MONO, fontSize:12, color:t.accent, cursor:'pointer' }}>paste a different one</button>
                <button onClick={onEditProfile} style={{ background:'none', border:'none', padding:0, fontFamily:MONO, fontSize:12, color:t.accent, cursor:'pointer' }}>edit on profile</button>
              </span>
            </div>
          ) : (
            <>
              <Field dark={dark} label="Your resume (plain text)" name="resume" textarea
                value={resume} onChange={e => setResume(e.target.value)}
                placeholder="Paste your resume here…"/>
              <p style={{ fontFamily:SANS, fontSize:13, color:t.t2, margin:'8px 0 0' }}>
                {savedResume
                  ? <button onClick={() => setPasting(false)} style={{ background:'none', border:'none', padding:0, fontFamily:SANS, fontSize:13, color:t.accent, cursor:'pointer' }}>← use my saved resume instead</button>
                  : <>Tip: <button onClick={onEditProfile} style={{ background:'none', border:'none', padding:0, fontFamily:SANS, fontSize:13, color:t.accent, cursor:'pointer' }}>upload your resume (PDF) on your profile</button> once and it's used automatically.</>}
              </p>
            </>
          )}

          <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginTop:14 }}>
            <HoverBtn onClick={() => run('match')} disabled={!ready || busy} style={btn(true)}>
              {busy === 'match' ? 'Checking…' : 'Check my fit'}
            </HoverBtn>
            <HoverBtn onClick={() => run('letter')} disabled={!ready || busy} style={btn(false)}>
              {busy === 'letter' ? 'Writing…' : 'Write a cover letter'}
            </HoverBtn>
          </div>

          {error && <p style={{ fontFamily:MONO, fontSize:12, color:'#DC2626', margin:'14px 0 0' }}>{error}</p>}

          {match && (
            <div style={{ marginTop:22 }}>
              <div style={{ display:'flex', alignItems:'baseline', gap:10, marginBottom:8 }}>
                <span style={{ fontFamily:MONO, fontSize:34, fontWeight:600, color:scoreColor }}>{match.score}</span>
                <span style={{ fontFamily:MONO, fontSize:13, color:t.t3 }}>/ 100 match</span>
              </div>
              <p style={{ fontFamily:SANS, fontSize:15, color:t.t2, margin:'0 0 14px' }}>{match.summary}</p>
              {[['Strengths', match.strengths], ['Gaps', match.gaps]].map(([title, items]) => items.length > 0 && (
                <div key={title} style={{ marginBottom:12 }}>
                  <div style={{ fontFamily:MONO, fontSize:11, color:t.t3, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6 }}>{title}</div>
                  <ul style={{ margin:0, paddingLeft:18 }}>
                    {items.map((s, i) => <li key={i} style={{ fontFamily:SANS, fontSize:14, color:t.t2, lineHeight:1.6 }}>{s}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {letter && (
            <div style={{ marginTop:22 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                <span style={{ fontFamily:MONO, fontSize:11, color:t.t3, textTransform:'uppercase', letterSpacing:'0.08em' }}>Cover letter</span>
                <button onClick={() => navigator.clipboard?.writeText(letter)}
                  style={{ fontFamily:MONO, fontSize:11, color:t.t3, background:'none', border:`1px solid ${t.border}`, borderRadius:8, padding:'4px 12px', cursor:'pointer' }}>
                  Copy
                </button>
              </div>
              <p style={{ fontFamily:SANS, fontSize:15, color:t.t2, lineHeight:1.7, whiteSpace:'pre-wrap', margin:0 }}>{letter}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
