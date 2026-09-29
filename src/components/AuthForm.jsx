import { useState } from 'react';
import api from '../api/axios';
import { tk, MONO, SANS, SERIF } from '../theme';
import Field from './Field';
import { HoverBtn } from './ui';

// Sign-in / create-account form. Used on the landing page (compact) and on
// the full sign-in page. `mode` is 'login' or 'register'.
export default function AuthForm({ dark, mode, onModeChange, onAuthed, notice, compact }) {
  const t = tk(dark);
  const isRegister = mode === 'register';
  const [form, setForm] = useState({ name:'', email:'', password:'' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (isRegister && form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setBusy(true);
    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const payload = isRegister ? form : { email: form.email, password: form.password };
      const res = await api.post(endpoint, payload);
      localStorage.setItem('token', res.data.token);
      onAuthed(res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not reach the server. Try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <h2 style={{ fontFamily:SERIF, fontSize:compact ? 30 : 38, fontWeight:400, color:t.t1, margin:'0 0 8px', letterSpacing:'-0.02em', lineHeight:1.1 }}>
        {isRegister ? 'Create your account' : 'Welcome back'}
      </h2>
      <p style={{ fontFamily:SANS, fontSize:14, color:t.t2, margin:'0 0 24px', lineHeight:1.6 }}>
        {isRegister ? 'Free for developers. Save jobs, track applications, get AI match scores.' : 'Sign in to apply, save jobs and see your match score.'}
      </p>

      <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:compact ? 14 : 18 }}>
        {(error || notice) && (
          <div role="alert" style={{ fontFamily:MONO, fontSize:12, lineHeight:1.5, borderRadius:10, padding:'10px 14px',
            ...(error
              ? { color:'#DC2626', background:dark?'rgba(220,38,38,0.12)':'rgba(220,38,38,0.07)', border:'1px solid rgba(220,38,38,0.3)' }
              : { color:t.t1, background:dark?'rgba(205,235,74,0.12)':'rgba(205,235,74,0.35)', border:`1px solid ${t.lime}` }) }}>
            {error || notice}
          </div>
        )}
        {isRegister && (
          <Field dark={dark} label="Name" name="name" value={form.name} onChange={handleChange} placeholder="Your full name" required/>
        )}
        <Field dark={dark} label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required/>
        <Field dark={dark} label="Password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" required
          hint={isRegister ? 'At least 6 characters.' : undefined}/>

        <HoverBtn type="submit" disabled={busy}
          style={{ background:t.accent, border:'none', borderRadius:12, height:48, cursor:busy?'wait':'pointer', fontFamily:MONO, fontSize:13, fontWeight:600, color:'#fff', marginTop:4 }}>
          {busy ? 'working…' : isRegister ? 'Create account →' : 'Sign in →'}
        </HoverBtn>

        <button type="button" onClick={() => { onModeChange(isRegister ? 'login' : 'register'); setError(''); }}
          style={{ background:'none', border:'none', fontFamily:MONO, fontSize:12, color:t.t3, cursor:'pointer', padding:0, textAlign:'center' }}>
          {isRegister ? 'Already have an account? ' : 'New to devhire? '}
          <span style={{ color:t.accent }}>{isRegister ? 'Sign in' : 'Create an account'}</span>
        </button>
      </form>
    </div>
  );
}
