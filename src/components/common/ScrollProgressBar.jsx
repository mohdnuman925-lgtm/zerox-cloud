import React, { useState, useEffect } from 'react';

export const ScrollProgressBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) {
        setProgress(0);
        return;
      }
      const currentScroll = window.scrollY || document.documentElement.scrollTop;
      const pct = Math.min(Math.max(currentScroll / scrollHeight, 0), 1);
      setProgress(pct);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (progress <= 0.005) return null;

  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] z-[9999] pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-[#A3E635] via-[#C5F36A] to-[#FFFFFF] transition-all duration-75 ease-out origin-left"
        style={{
          width: `${progress * 100}%`,
          boxShadow: '0 0 12px rgba(197, 243, 106, 0.9), 0 0 24px rgba(197, 243, 106, 0.5)'
        }}
      />
    </div>
  );
};
