import React, { useEffect, useRef, useState } from 'react';

export const ScrollReveal = ({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 750,
  threshold = 0.12,
  rootMargin = '0px 0px -40px 0px',
  once = true,
  className = '',
  as: Component = 'div',
  ...rest
}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(el);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  const animationClass = {
    'fade-up': 'scroll-reveal',
    'fade-down': 'scroll-reveal-down',
    'fade-left': 'scroll-reveal-left',
    'fade-right': 'scroll-reveal-right',
    'zoom-in': 'scroll-reveal-zoom',
    'fade': 'scroll-reveal-fade'
  }[animation] || 'scroll-reveal';

  return (
    <Component
      ref={ref}
      className={`${animationClass} ${isVisible ? 'revealed' : ''} ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`
      }}
      {...rest}
    >
      {children}
    </Component>
  );
};
