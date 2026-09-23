import { useState } from 'react';
import api from '../api/axios';
import { tk, MONO, SANS, SERIF } from '../theme';
import Field from '../components/Field';
import { HoverBtn } from '../components/ui';
import { FilterPill } from '../components/FilterRow';

const EMPTY = {
  title:'', company:'', description:'', salary:'', location:'',
  tags:'', type:'Remote', expLevel:'', domain:'',
};

export default function PostJobPage({ dark, mobile, user, onPosted, onSignIn }) {
  const t = tk(dark);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map(s => s.trim()).filter(Boolean),
      };
      await api.post('/jobs', payload);
      setForm(EMPTY);
      setDone(true);
      onPosted();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post the job.');
    } finally {
      setBusy(false);
    }
  };

  const wrap = { maxWidth:620, margin:'0 auto', padding:`${mobile?100:130}px ${mobile?16:32}px 100px` };

  if (!user) {
    return (
      <div style={{ background:t.bg, minHeight:'100vh' }}>
        <div style={wrap}>
          <h1 style={{ fontFamily:SERIF, fontSize:mobile?32:40, fontWeight:400, color:t.t1, margin:'0 0 10px', letterSpacing:'-0.022em' }}>Post a role</h1>
          <p style={{ fontFamily:SANS, fontSize:15, color:t.t2, margin:'0 0 28px', lineHeight:1.6 }}>
            You need an account before you can post. It takes about twenty seconds.
          </p>
          <HoverBtn onClick={onSignIn}
            style={{ background:t.accent, border:'none', borderRadius:12, height:48, padding:'0 26px', cursor:'pointer', fontFamily:MONO, fontSize:13, fontWeight:600, color:'#fff' }}>
            Sign in to continue →
          </HoverBtn>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background:t.bg, minHeight:'100vh' }}>
      <div style={wrap}>
        <h1 style={{ fontFamily:SERIF, fontSize:mobile?32:40, fontWeight:400, color:t.t1, margin:'0 0 10px', letterSpacing:'-0.022em', lineHeight:1.1 }}>
          Post a role
        </h1>
        <p style={{ fontFamily:SANS, fontSize:15, color:t.t2, margin:'0 0 32px', lineHeight:1.6 }}>
          Goes live on the board immediately. No recruiters, no consultancy gigs.
        </p>

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:18 }}>
          {error && (
            <div style={{ fontFamily:MONO, fontSize:12, color:'#DC2626', background:dark?'rgba(220,38,38,0.12)':'rgba(220,38,38,0.07)', border:'1px solid rgba(220,38,38,0.3)', borderRadius:10, padding:'10px 14px' }}>
              {error}
            </div>
          )}
          {done && !error && (
            <div style={{ fontFamily:MONO, fontSize:12, color:t.success, background:dark?'rgba(15,110,86,0.15)':'rgba(15,110,86,0.08)', border:`1px solid ${t.success}55`, borderRadius:10, padding:'10px 14px' }}>
              Posted. It's on the board now.
            </div>
          )}

          <Field dark={dark} label="Role title" name="title" value={form.title} onChange={handleChange} placeholder="Senior React Engineer" required/>
          <Field dark={dark} label="Company" name="company" value={form.company} onChange={handleChange} placeholder="Zepto" required/>

          <div>
            <span style={{ display:'block', fontFamily:MONO, fontSize:11, color:t.t3, letterSpacing:'0.08em', marginBottom:9 }}>WORK TYPE</span>
            <div style={{ display:'flex', gap:6 }}>
              {['Remote','Hybrid','Onsite'].map(opt => (
                <FilterPill key={opt} label={opt} active={form.type === opt} t={t}
                  onClick={() => setForm({ ...form, type: opt })}/>
              ))}
            </div>
          </div>

          <Field dark={dark} label="Location" name="location" value={form.location} onChange={handleChange} placeholder="Bangalore"/>
          <Field dark={dark} label="Experience" name="expLevel" value={form.expLevel} onChange={handleChange} placeholder="3–5y exp"/>
          <Field dark={dark} label="Salary" name="salary" value={form.salary} onChange={handleChange} placeholder="₹30–45L"/>
          <Field dark={dark} label="Stack" name="tags" value={form.tags} onChange={handleChange} placeholder="React, TypeScript, Redux" hint="Comma separated — these power the stack filter."/>
          <Field dark={dark} label="Company domain" name="domain" value={form.domain} onChange={handleChange} placeholder="zepto.in" hint="Optional — used to fetch the company logo."/>
          <Field dark={dark} textarea label="Description" name="description" value={form.description} onChange={handleChange} placeholder="What the role involves, who you're looking for…" required/>

          <HoverBtn type="submit" disabled={busy}
            style={{ background:t.accent, border:'none', borderRadius:12, height:48, cursor:busy?'wait':'pointer', fontFamily:MONO, fontSize:13, fontWeight:600, color:'#fff', marginTop:6 }}>
            {busy ? 'posting…' : 'Publish role →'}
          </HoverBtn>
        </form>
      </div>
    </div>
  );
}
