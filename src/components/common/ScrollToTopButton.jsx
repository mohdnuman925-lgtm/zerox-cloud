import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { scrollTo } from '../../hooks/useLenis';

export const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY || document.documentElement.scrollTop;

      if (currentScroll > 280) {
        setVisible(true);
      } else {
        setVisible(false);
      }

      if (scrollHeight > 0) {
        const pct = Math.min(Math.max(currentScroll / scrollHeight, 0), 1);
        setProgress(pct);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    scrollTo(0);
  };

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div
      className={`fixed bottom-24 right-6 sm:bottom-8 sm:right-24 z-40 transition-all duration-300 ${
        visible
          ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
          : 'opacity-0 translate-y-4 scale-90 pointer-events-none'
      }`}
    >
      <button
        onClick={handleClick}
        aria-label="Scroll to top"
        title="Scroll to top"
        className="relative group w-12 h-12 rounded-full bg-[#121814]/90 backdrop-blur-md border border-white/15 hover:border-[#C5F36A]/50 flex items-center justify-center text-white hover:text-[#C5F36A] shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
      >
        {/* SVG Circular Progress Track */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-1"
          viewBox="0 0 44 44"
        >
          <circle
            cx="22"
            cy="22"
            r={radius}
            stroke="currentColor"
            strokeWidth="2.5"
            fill="transparent"
            className="text-white/10"
          />
          <circle
            cx="22"
            cy="22"
            r={radius}
            stroke="#C5F36A"
            strokeWidth="2.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-[stroke-dashoffset] duration-150 ease-out"
          />
        </svg>

        {/* Center Arrow Icon */}
        <ArrowUp className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
      </button>
    </div>
  );
};
