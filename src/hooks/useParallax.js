import { useEffect, useState } from 'react';

// Returns how far the page has scrolled past the top of `ref`'s element,
// clamped to that element's height — i.e. only while the hero is on screen.
// Updates at most once per animation frame, and stays 0 for users who
// prefer reduced motion.
export default function useParallax(ref) {
  const [y, setY] = useState(0);

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const h = el.offsetHeight || window.innerHeight;
      setY(Math.min(Math.max(window.scrollY - el.offsetTop, 0), h));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref]);

  return y;
}
