import { useCallback, useEffect, useState } from 'react';

// Light / dark theme. index.html sets data-theme before first paint (saved
// choice, else the OS setting) so there is no flash; this keeps it in sync.
const current = () => document.documentElement.dataset.theme === 'dark';

export default function useTheme() {
  const [dark, setDark] = useState(current);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#111014' : '#FAF8F3');
  }, [dark]);

  // Follow the OS setting until the user picks one themselves.
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    const on = (e) => { if (!localStorage.getItem('theme')) setDark(e.matches); };
    mq?.addEventListener?.('change', on);
    return () => mq?.removeEventListener?.('change', on);
  }, []);

  // Circular reveal from the button that was clicked (View Transitions API).
  const toggle = useCallback((e) => {
    const next = !current();
    try { localStorage.setItem('theme', next ? 'dark' : 'light'); } catch { /* storage unavailable */ }
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!document.startViewTransition || reduced) return setDark(next);
    const x = e?.clientX ?? window.innerWidth - 60, y = e?.clientY ?? 30;
    const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    document.startViewTransition(() => {
      document.documentElement.dataset.theme = next ? 'dark' : 'light';
      setDark(next);
    }).ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 560, easing: 'cubic-bezier(.22,1,.36,1)', pseudoElement: '::view-transition-new(root)' },
      );
    }).catch(() => {});
  }, []);

  return { dark, toggle };
}
