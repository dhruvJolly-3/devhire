import { useEffect, useMemo } from 'react';
import { parseHash } from '../utils/routes';

const EASE = 'cubic-bezier(.22,1,.36,1)';
const reduced = () => !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Page motion for the design: fade the old page out on navigation, fade the new
// one in with its [data-rise] blocks and [data-list] rows, parallax on
// [data-parallax] images, and the scroll progress bar ([data-progress]).
export default function usePageMotion(setLocation) {
  const api = useMemo(() => {
    const rise = (el, delay = 0, duration = 700) => {
      if (reduced() || !el.animate) return;
      el.animate([{ opacity: 0, transform: 'translateY(18px)', filter: 'blur(6px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }], { duration, delay, easing: EASE, fill: 'backwards' });
    };
    const parallax = () => {
      if (reduced()) return;
      const vh = window.innerHeight;
      document.querySelectorAll('[data-parallax]').forEach(el => {
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        const off = (r.top + r.height / 2 - vh / 2) * (+el.dataset.parallax || 0);
        el.style.transform = `translate3d(0,${off.toFixed(1)}px,0)`;
      });
    };
    return {
      rise,
      parallax,
      reveal() {
        window.scrollTo(0, 0);
        requestAnimationFrame(parallax);
        if (reduced()) return;
        document.querySelector('[data-page]')?.animate?.([{ opacity: 0, transform: 'translateY(14px)', filter: 'blur(6px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }], { duration: 520, easing: EASE });
        document.querySelectorAll('[data-rise]').forEach(el => rise(el, (+el.dataset.rise || 0) * 80));
        document.querySelectorAll('[data-list] > *').forEach((el, i) => rise(el, 160 + i * 60));
      },
      riseList(selector) {
        document.querySelectorAll(selector).forEach((el, i) => rise(el, i * 45, 480));
      },
    };
  }, []);

  // Navigation: fade the current page out, then swap the route.
  useEffect(() => {
    let anim = null;
    const onHash = () => {
      anim?.cancel();
      const main = document.querySelector('[data-page]');
      if (!main?.animate || reduced()) return setLocation(parseHash());
      anim = main.animate([{ opacity: 1, transform: 'none', filter: 'blur(0)' }, { opacity: 0, transform: 'translateY(-10px) scale(.995)', filter: 'blur(4px)' }], { duration: 200, easing: 'cubic-bezier(.4,0,1,1)', fill: 'forwards' });
      const swap = () => { setLocation(parseHash()); requestAnimationFrame(() => anim?.cancel()); };
      anim.finished.then(swap, () => {});
    };
    window.addEventListener('hashchange', onHash);
    return () => { window.removeEventListener('hashchange', onHash); anim?.cancel(); };
  }, [setLocation]);

  // Scroll: progress bar + parallax, at most once per frame.
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = 0;
      const m = document.documentElement.scrollHeight - window.innerHeight;
      const bar = document.querySelector('[data-progress]');
      if (bar) bar.style.width = (m > 0 ? (window.scrollY / m) * 100 : 0).toFixed(2) + '%';
      api.parallax();
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf); };
  }, [api]);

  return api;
}
