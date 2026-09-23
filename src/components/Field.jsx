import { useState } from 'react';
import { tk, MONO } from '../theme';

// Shared form control styled with the design's tokens.
export default function Field({ dark, label, name, value, onChange, placeholder, type = 'text', required, textarea, hint }) {
  const t = tk(dark);
  const [focused, setFocused] = useState(false);
  const Tag = textarea ? 'textarea' : 'input';

  return (
    <label style={{ display:'flex', flexDirection:'column', gap:7 }}>
      <span style={{ fontFamily:MONO, fontSize:11, color:t.t3, letterSpacing:'0.08em', textTransform:'uppercase' }}>
        {label}{required && <span style={{ color:t.accent }}> *</span>}
      </span>
      <Tag
        name={name} value={value} onChange={onChange} placeholder={placeholder}
        type={textarea ? undefined : type} required={required}
        rows={textarea ? 6 : undefined}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width:'100%', boxSizing:'border-box',
          background: t.surface,
          border:`1.5px solid ${focused ? t.accent : t.border}`,
          borderRadius:12, padding:textarea ? '14px 16px' : '0 16px',
          height: textarea ? 'auto' : 48,
          fontFamily:MONO, fontSize:13, color:t.t1, outline:'none',
          boxShadow: focused ? `0 0 0 3px ${t.accent}22` : 'none',
          resize: textarea ? 'vertical' : undefined,
          lineHeight: textarea ? 1.6 : undefined,
          transition:'border-color 180ms, box-shadow 200ms',
        }}/>
      {hint && <span style={{ fontFamily:MONO, fontSize:11, color:t.t3 }}>{hint}</span>}
    </label>
  );
}
