import { tk, MONO } from '../theme';
import { pageList } from '../utils/pagination';

export default function Pagination({ dark, page, total, onChange }) {
  const t = tk(dark);
  if (total <= 1) return null;

  const btn = (active, disabled) => ({
    minWidth:40, height:40, padding:'0 12px', borderRadius:10, cursor:disabled ? 'not-allowed' : 'pointer',
    fontFamily:MONO, fontSize:13, fontWeight:active ? 600 : 400,
    border:`1px solid ${active ? t.accent : t.border}`,
    background:active ? t.accent : t.surface, color:active ? '#fff' : disabled ? t.t3 : t.t1,
    opacity:disabled ? 0.5 : 1, transition:'all 160ms',
  });

  return (
    <nav aria-label="Pagination" style={{ display:'flex', gap:6, justifyContent:'center', alignItems:'center', flexWrap:'wrap', marginTop:32 }}>
      <button type="button" style={btn(false, page === 1)} disabled={page === 1} onClick={() => onChange(page - 1)}>← Prev</button>
      {pageList(page, total).map((p, i) => p === '…'
        ? <span key={`gap${i}`} style={{ fontFamily:MONO, fontSize:13, color:t.t3, padding:'0 4px' }}>…</span>
        : <button type="button" key={p} aria-current={p === page ? 'page' : undefined} style={btn(p === page, false)} onClick={() => onChange(p)}>{p}</button>)}
      <button type="button" style={btn(false, page === total)} disabled={page === total} onClick={() => onChange(page + 1)}>Next →</button>
    </nav>
  );
}
