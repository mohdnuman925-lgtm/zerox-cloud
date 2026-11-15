import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

let globalLenis = null;

export const useLenis = (options = {}) => {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Prevent multiple instances on hot reload
    if (globalLenis) {
      globalLenis.destroy();
      globalLenis = null;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
      infinite: false,
      autoResize: true,
      ...options
    });

    lenisRef.current = lenis;
    globalLenis = lenis;
    window.lenis = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      if (globalLenis === lenis) {
        globalLenis = null;
        delete window.lenis;
      }
    };
  }, []);

  return lenisRef.current;
};

export const scrollTo = (target, options = {}) => {
  if (window.lenis) {
    window.lenis.scrollTo(target, {
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      ...options
    });
  } else {
    if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: 'smooth' });
    } else if (typeof target === 'string') {
      const el = document.querySelector(target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }
};
