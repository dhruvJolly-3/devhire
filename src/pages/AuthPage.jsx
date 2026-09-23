import { useState } from 'react';
import api from '../api/axios';
import { tk, MONO, SANS, SERIF } from '../theme';
import Field from '../components/Field';
import { HoverBtn } from '../components/ui';

export default function AuthPage({ dark, mobile, onAuthed }) {
  const t = tk(dark);
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name:'', email:'', password:'' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const payload = isRegister ? form : { email: form.email, password: form.password };
      const res = await api.post(endpoint, payload);
      localStorage.setItem('token', res.data.token);
      onAuthed(res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ background:t.bg, minHeight:'100vh' }}>
      <div style={{ maxWidth:440, margin:'0 auto', padding:`${mobile?100:130}px ${mobile?16:32}px 100px` }}>
        <h1 style={{ fontFamily:SERIF, fontSize:mobile?32:40, fontWeight:400, color:t.t1, margin:'0 0 10px', letterSpacing:'-0.022em', lineHeight:1.1 }}>
          {isRegister ? 'Create an account' : 'Welcome back'}
        </h1>
        <p style={{ fontFamily:SANS, fontSize:15, color:t.t2, margin:'0 0 32px', lineHeight:1.6 }}>
          {isRegister ? 'Sign up to post roles on devhire.' : 'Sign in to post and manage your roles.'}
        </p>

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:18 }}>
          {error && (
            <div style={{ fontFamily:MONO, fontSize:12, color:'#DC2626', background:dark?'rgba(220,38,38,0.12)':'rgba(220,38,38,0.07)', border:'1px solid rgba(220,38,38,0.3)', borderRadius:10, padding:'10px 14px' }}>
              {error}
            </div>
          )}
          {isRegister && (
            <Field dark={dark} label="Name" name="name" value={form.name} onChange={handleChange} placeholder="Ada Lovelace" required/>
          )}
          <Field dark={dark} label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@company.com" required/>
          <Field dark={dark} label="Password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" required/>

          <HoverBtn type="submit" disabled={busy}
            style={{ background:t.accent, border:'none', borderRadius:12, height:48, cursor:busy?'wait':'pointer', fontFamily:MONO, fontSize:13, fontWeight:600, color:'#fff', marginTop:6 }}>
            {busy ? 'working…' : isRegister ? 'Create account →' : 'Sign in →'}
          </HoverBtn>

          <button type="button" onClick={() => { setIsRegister(!isRegister); setError(''); }}
            style={{ background:'none', border:'none', fontFamily:MONO, fontSize:12, color:t.t3, cursor:'pointer', padding:0, textAlign:'center' }}>
            {isRegister ? 'Already have an account? Sign in' : 'New here? Create an account'}
          </button>
        </form>
      </div>
    </div>
  );
}
