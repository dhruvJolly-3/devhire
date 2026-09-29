import { useEffect, useMemo } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
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
    // Banners ([data-parallax]) drift against the scroll and lean toward the
    // cursor; small illustrations ([data-float]) bob with the scroll.
    const pointer = { x: 0, y: 0 };
    const parallax = () => {
      if (reduced()) return;
      const vh = window.innerHeight;
      document.querySelectorAll('[data-parallax],[data-float]').forEach(el => {
        const box = el.dataset.parallax ? el.parentElement : el;
        const r = box.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        const k = +(el.dataset.parallax || el.dataset.float) || 0;
        const off = (r.top + r.height / 2 - vh / 2) * k;
        const px = el.dataset.parallax ? pointer.x * k * 60 : 0, py = el.dataset.parallax ? pointer.y * k * 40 : 0;
        el.style.transform = `translate3d(${px.toFixed(1)}px,${(off + py).toFixed(1)}px,0)`;
      });
    };
    // Scroll-reveal: blocks below the fold fade up as they enter the viewport.
    const io = typeof IntersectionObserver !== 'undefined' && new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.dataset.reveal = 'in';
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    const watchReveal = () => {
      if (!io || reduced()) return;
      const vh = window.innerHeight;
      document.querySelectorAll('main section, main [data-rise], main [data-list] > *, main h2, footer .dh-foot > *').forEach(el => {
        if (el.dataset.reveal || el.getBoundingClientRect().top < vh) return;
        el.dataset.reveal = 'wait';
        io.observe(el);
      });
    };
    return {
      rise,
      parallax,
      pointer,
      watchReveal,
      reveal() {
        if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true, force: true }); else window.scrollTo(0, 0);
        requestAnimationFrame(parallax);
        if (reduced()) return;
        document.querySelector('[data-page]')?.animate?.([{ opacity: 0, transform: 'translateY(14px)', filter: 'blur(6px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }], { duration: 520, easing: EASE });
        document.querySelectorAll('[data-rise]').forEach(el => rise(el, (+el.dataset.rise || 0) * 80));
        document.querySelectorAll('[data-list] > *').forEach((el, i) => rise(el, 160 + i * 60));
        setTimeout(watchReveal, 60);
      },
      riseList(selector) {
        // Tab / filter / page changes flash the top loading bar briefly.
        window.dispatchEvent(new CustomEvent('dh:busy', { detail: 1 }));
        setTimeout(() => window.dispatchEvent(new CustomEvent('dh:busy', { detail: -1 })), 260);
        document.querySelectorAll(selector).forEach((el, i) => rise(el, i * 45, 480));
        setTimeout(watchReveal, 60);
      },
    };
  }, []);

  // Navigation: fade the current page out, then swap the route.
  useEffect(() => {
    let anim = null;
    const onHash = () => {
      // Show the top loading bar across the page swap.
      window.dispatchEvent(new CustomEvent('dh:busy', { detail: 1 }));
      setTimeout(() => window.dispatchEvent(new CustomEvent('dh:busy', { detail: -1 })), 420);
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

  // Smooth, inertia-style scrolling (Lenis). Skipped for reduced motion; touch
  // devices keep their native scrolling.
  useEffect(() => {
    if (reduced()) return;
    const lenis = new Lenis({ duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true });
    window.__lenis = lenis;
    let raf = requestAnimationFrame(function loop(time) { lenis.raf(time); raf = requestAnimationFrame(loop); });
    return () => { cancelAnimationFrame(raf); lenis.destroy(); window.__lenis = null; };
  }, []);

  // Scroll: progress bar + parallax, at most once per frame.
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = 0;
      const m = document.documentElement.scrollHeight - window.innerHeight;
      const bar = document.querySelector('[data-progress]');
      if (bar) bar.style.transform = `scaleX(${(m > 0 ? window.scrollY / m : 0).toFixed(4)})`;
      api.parallax();
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf); };
  }, [api]);

  // Cursor: card spotlight (--mx/--my on the hovered list card) + banner lean.
  useEffect(() => {
    let raf = 0;
    const onMove = (e) => {
      api.pointer.x = e.clientX / window.innerWidth - 0.5;
      api.pointer.y = e.clientY / window.innerHeight - 0.5;
      const card = e.target.closest?.('[data-list] > *');
      if (card) {
        const r = card.getBoundingClientRect();
        card.classList.add('dh-spot');
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      }
      if (!raf) raf = requestAnimationFrame(() => { raf = 0; api.parallax(); });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => { window.removeEventListener('pointermove', onMove); cancelAnimationFrame(raf); };
  }, [api]);

  return api;
}
