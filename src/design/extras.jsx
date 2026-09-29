// Site-wide UI: nav tools (search + theme), command palette, toasts, back-to-top.
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const Sun = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>
  </svg>
);
const Moon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>
  </svg>
);
const Search = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
  </svg>
);

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

export function NavTools({ dark, onToggleTheme, onSearch }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <button className="dh-tool" onClick={onSearch} aria-label="Search (Command K)">
        <Search/><span className="dh-tool-label">Search</span><span className="dh-kbd">{isMac ? '⌘K' : 'Ctrl K'}</span>
      </button>
      <button className="dh-tool dh-theme" onClick={onToggleTheme} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} title={dark ? 'Light mode' : 'Dark mode'}>
        {dark ? <Sun/> : <Moon/>}
      </button>
    </div>
  );
}

// ⌘K / Ctrl+K palette: jump to pages, run actions, or open a job by typing.
// `sections` = [{ title, items: [{ label, sub, icon, run }] }]
export function CommandPalette({ open, onClose, query, onQuery, sections }) {
  const [sel, setSel] = useState(0);
  const inputRef = useRef(null);
  const items = sections.flatMap(s => s.items);
  const cur = Math.min(sel, Math.max(0, items.length - 1));

  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);

  if (!open) return null;
  const run = (it) => { onClose(); it?.run(); };
  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSel((cur + 1) % Math.max(1, items.length)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSel((cur - 1 + items.length) % Math.max(1, items.length)); }
    else if (e.key === 'Enter') { e.preventDefault(); run(items[cur]); }
    else if (e.key === 'Escape') onClose();
  };
  const offsets = sections.reduce((acc, sec, k) => [...acc, k ? acc[k - 1] + sections[k - 1].items.length : 0], []);
  return (
    <div className="dh-cmd-back" onMouseDown={onClose}>
      <div className="dh-cmd" role="dialog" aria-modal="true" aria-label="Command palette" onMouseDown={e => e.stopPropagation()}>
        <input ref={inputRef} value={query} onChange={e => { onQuery(e.target.value); setSel(0); }} onKeyDown={onKey}
          placeholder="Search jobs, companies, or type a command…" aria-label="Search" role="combobox" aria-expanded="true"/>
        <div className="dh-cmd-list" role="listbox" data-lenis-prevent>
          {!items.length && <div style={{ padding: 20, color: 'var(--c-muted)', fontSize: 14 }}>No matches for “{query}”.</div>}
          {sections.map((s, k) => !s.items.length ? null : (
            <div key={s.title}>
              <div className="dh-cmd-sec">{s.title}</div>
              {s.items.map((it, n) => {
                const idx = offsets[k] + n;
                return (
                  <button key={s.title + it.label + (it.sub || '')} role="option" aria-selected={idx === cur} className="dh-cmd-item"
                    onMouseMove={() => idx !== cur && setSel(idx)} onClick={() => run(it)}>
                    <span aria-hidden="true" style={{ width: 20, textAlign: 'center' }}>{it.icon}</span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.label}</span>
                    {it.sub && <span className="dh-cmd-sub">{it.sub}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <div className="dh-cmd-foot"><span>↑↓ to move</span><span>↵ to open</span><span>esc to close</span></div>
      </div>
    </div>
  );
}

export function Toasts({ toasts }) {
  return (
    <div className="dh-toasts" role="status" aria-live="polite">
      {toasts.map(t => <div key={t.id} className="dh-toast"><b>{t.icon || '✓'}</b>{t.text}</div>)}
    </div>
  );
}

export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 900);
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <button className="dh-top" data-hidden={!show} aria-label="Back to top" tabIndex={show ? 0 : -1}
      onClick={() => (window.__lenis ? window.__lenis.scrollTo(0, { duration: 1.2 }) : window.scrollTo({ top: 0, behavior: 'smooth' }))}>↑</button>
  );
}

export function SkeletonList({ rows = 5 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} aria-busy="true" aria-label="Loading jobs">
      {Array.from({ length: rows }, (_, i) => <div key={i} className="dh-skel" style={{ animationDelay: `${i * 90}ms` }}/>)}
    </div>
  );
}

// Thin progress bar at the very top while API requests or page changes are in
// flight. Listens for "dh:busy" events ({ detail: +1 | -1 }).
export function TopLoader() {
  const [pending, setPending] = useState(0);
  const [done, setDone] = useState(true);
  useEffect(() => {
    let hide = 0;
    const on = (e) => setPending(p => {
      const n = Math.max(0, p + e.detail);
      clearTimeout(hide);
      if (n > 0) setDone(false); else hide = setTimeout(() => setDone(true), 350);
      return n;
    });
    window.addEventListener('dh:busy', on);
    return () => { window.removeEventListener('dh:busy', on); clearTimeout(hide); };
  }, []);
  return <div className="dh-loader" data-state={pending > 0 ? 'run' : done ? 'idle' : 'end'} aria-hidden="true"/>;
}

// Hamburger + slide-in sheet for narrow screens. Rendered into <body>: the
// nav's backdrop-filter would otherwise trap position:fixed inside it.
// `items` = [{ label, current, onClick }]
export function MobileMenu({ items }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    window.__lenis?.stop();
    return () => { window.removeEventListener('keydown', onKey); window.__lenis?.start(); };
  }, [open]);
  return (
    <>
      <button className="dh-burger" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
      </button>
      {open && createPortal(
        <>
          <div className="dh-sheet-back" onClick={() => setOpen(false)}/>
          <nav className="dh-sheet" aria-label="Menu">
            <button aria-label="Close menu" onClick={() => setOpen(false)} style={{ justifyContent: 'flex-end', fontSize: 22 }}>✕</button>
            {items.map(it => it.divider ? <hr key={it.label}/> : (
              <button key={it.label} aria-current={it.current ? 'page' : undefined} onClick={() => { setOpen(false); it.onClick(); }}>
                {it.label}<span aria-hidden="true" style={{ opacity: 0.4 }}>→</span>
              </button>
            ))}
          </nav>
        </>,
        document.body,
      )}
    </>
  );
}
