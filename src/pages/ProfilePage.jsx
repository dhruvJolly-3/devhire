import { useRef, useState } from 'react';
import { tk, MONO, SANS, SERIF } from '../theme';
import Field from '../components/Field';
import { HoverBtn } from '../components/ui';

// #/profile — the candidate's details and resume. The resume (uploaded PDF
// or pasted text) is what the AI match score and cover letters use.
export default function ProfilePage({ dark, mobile, profile, onSave, onUpload }) {
  if (!profile) {
    const t = tk(dark);
    return <div style={{ background:t.bg, minHeight:'100vh', padding:'140px 24px', textAlign:'center', fontFamily:MONO, fontSize:13, color:t.t2 }}>loading profile…</div>;
  }
  return <ProfileForm {...{ dark, mobile, profile, onSave, onUpload }}/>;
}

function ProfileForm({ dark, mobile, profile, onSave, onUpload }) {
  const t = tk(dark);
  const fileRef = useRef(null);
  const [form, setForm] = useState({
    name: profile.name || '', headline: profile.headline || '', location: profile.location || '',
    skills: (profile.skills || []).join(', '), resumeText: profile.resumeText || '',
  });
  const [status, setStatus] = useState({ busy: '', message: '', error: false });

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    setStatus({ busy: 'save', message: '', error: false });
    try {
      await onSave({ ...form, skills: form.skills.split(',').map(s => s.trim()).filter(Boolean) });
      setStatus({ busy: '', message: '✓ Profile saved', error: false });
    } catch (err) {
      setStatus({ busy: '', message: err.response?.data?.message || 'Could not save. Try again.', error: true });
    }
  };

  const upload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setStatus({ busy: '', message: 'Resume must be under 2 MB.', error: true }); return; }
    setStatus({ busy: 'upload', message: '', error: false });
    try {
      const updated = await onUpload(file);
      setForm(f => ({ ...f, resumeText: updated.resumeText || '' }));
      setStatus({ busy: '', message: `✓ ${file.name} uploaded — text extracted below`, error: false });
    } catch (err) {
      setStatus({ busy: '', message: err.response?.data?.message || 'Upload failed. Try again.', error: true });
    }
  };

  const card = { background:t.surface, border:`1px solid ${t.border}`, borderRadius:18, padding:mobile ? 20 : 28 };

  return (
    <div style={{ background:t.bg, minHeight:'100vh' }}>
      <form onSubmit={save} style={{ maxWidth:820, margin:'0 auto', padding:mobile?'96px 16px 100px':'116px 32px 110px', display:'flex', flexDirection:'column', gap:20 }}>
        <div>
          <div style={{ fontFamily:MONO, fontSize:11, color:t.t3, letterSpacing:'0.12em', marginBottom:10 }}>PROFILE</div>
          <h1 style={{ fontFamily:SERIF, fontSize:mobile?36:48, fontWeight:400, color:t.t1, margin:0, letterSpacing:'-0.025em' }}>
            Your <em style={{ color:t.accent }}>profile</em>
          </h1>
          <p style={{ fontFamily:SANS, fontSize:15, color:t.t2, margin:'10px 0 0' }}>{profile.email}</p>
        </div>

        <section style={card}>
          <h2 style={{ fontFamily:SANS, fontSize:17, fontWeight:600, color:t.t1, margin:'0 0 18px' }}>About you</h2>
          <div style={{ display:'grid', gridTemplateColumns:mobile ? '1fr' : '1fr 1fr', gap:16 }}>
            <Field dark={dark} label="Full name" name="name" value={form.name} onChange={change} required/>
            <Field dark={dark} label="Location" name="location" value={form.location} onChange={change} placeholder="Noida, Delhi NCR"/>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:16, marginTop:16 }}>
            <Field dark={dark} label="Headline" name="headline" value={form.headline} onChange={change} placeholder="MERN developer · React, Node.js, MongoDB"/>
            <Field dark={dark} label="Skills" name="skills" value={form.skills} onChange={change} placeholder="React, Node.js, Express, MongoDB" hint="Comma separated."/>
          </div>
        </section>

        <section style={card}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12, flexWrap:'wrap', marginBottom:16 }}>
            <div>
              <h2 style={{ fontFamily:SANS, fontSize:17, fontWeight:600, color:t.t1, margin:'0 0 4px' }}>Resume</h2>
              <p style={{ fontFamily:SANS, fontSize:14, color:t.t2, margin:0 }}>
                {profile.resumeFileName ? `Current file: ${profile.resumeFileName}` : 'Upload a PDF or paste the text. The AI assistant uses it on every job.'}
              </p>
            </div>
            <input ref={fileRef} type="file" accept=".pdf,.txt,application/pdf,text/plain" onChange={upload} hidden/>
            <HoverBtn onClick={() => fileRef.current?.click()} disabled={status.busy === 'upload'}
              style={{ background:t.surface, border:`1px solid ${t.accent}`, borderRadius:12, height:42, padding:'0 18px', cursor:'pointer', fontFamily:MONO, fontSize:13, fontWeight:600, color:t.accent }}>
              {status.busy === 'upload' ? 'Reading PDF…' : profile.resumeFileName ? '↑ Replace PDF' : '↑ Upload PDF'}
            </HoverBtn>
          </div>
          <Field dark={dark} textarea label="Resume text" name="resumeText" value={form.resumeText} onChange={change}
            placeholder="…or paste your resume here" hint="PDF uploads fill this in automatically. You can edit it before saving."/>
        </section>

        <div style={{ display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
          <HoverBtn type="submit" disabled={status.busy === 'save'}
            style={{ background:t.accent, border:'none', borderRadius:12, height:48, padding:'0 28px', cursor:'pointer', fontFamily:MONO, fontSize:13, fontWeight:600, color:'#fff' }}>
            {status.busy === 'save' ? 'Saving…' : 'Save profile'}
          </HoverBtn>
          {status.message && (
            <span role="status" style={{ fontFamily:MONO, fontSize:12, color:status.error ? '#DC2626' : t.success }}>{status.message}</span>
          )}
        </div>
      </form>
    </div>
  );
}
