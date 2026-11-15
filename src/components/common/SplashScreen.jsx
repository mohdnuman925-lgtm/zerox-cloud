import React, { useState, useEffect } from 'react';

// Exact vector coordinates of the ZC monogram mark extracted from reference recording
const ZC_PATH =
  'M 193 10 L 219 10 L 232 13 L 256 26 L 268 39 L 246 61 L 230 46 L 213 40 L 195 41 L 178 49 L 170 57 L 162 71 L 160 80 L 159 123 L 155 135 L 150 143 L 141 152 L 129 159 L 117 162 L 10 162 L 10 140 L 92 45 L 14 44 L 12 43 L 13 12 L 141 12 L 140 37 L 61 129 L 62 131 L 93 131 L 114 130 L 123 123 L 125 119 L 126 107 L 127 72 L 132 56 L 143 39 L 153 29 L 172 16 L 192 11 Z M 166 112 L 182 127 L 197 133 L 216 133 L 226 130 L 240 120 L 246 113 L 268 134 L 268 136 L 257 147 L 240 158 L 217 164 L 190 163 L 171 156 L 157 146 L 158 140 L 163 131 L 166 113 Z';

/**
 * SplashScreen - Cinematic brand intro matching the video recording
 * 
 * Animation Stages:
 * 0.0s - 0.7s: White SVG stroke outlines the stylized geometric "ZC" monogram
 * 0.7s - 1.5s: Monogram smoothly fills with solid white while cursive "ZeroxCloud" handwriting draws letter-by-letter
 * 1.5s - 2.3s: Completed brand mark holds with gentle ambient bloom and pulsing "STARTING CLOUD..."
 * 2.3s - 2.8s: Cinematic dissolve/fade-out into the main website
 */
export const SplashScreen = ({ onFinish, forceShow = false }) => {
  const [phase, setPhase] = useState(0); // 0: outline, 1: fill & handwriting, 2: hold glow, 3: fading out, 4: complete
  const [typedLetters, setTypedLetters] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);

  const FULL_BRAND_NAME = 'ZeroxCloud';

  useEffect(() => {
    // Check if splash was already shown this session (unless forceShow is true)
    const hasSeenSplash = sessionStorage.getItem('zerox_splash_shown');
    if (hasSeenSplash && !forceShow) {
      setIsDismissed(true);
      if (onFinish) onFinish();
      return;
    }

    // Phase 0 -> 1: Stroke completes at 650ms, start fill and handwriting
    const t1 = setTimeout(() => {
      setPhase(1);
    }, 650);

    // Phase 1 -> 2: Handwriting completes around 1450ms, hold completed brand
    const t2 = setTimeout(() => {
      setPhase(2);
    }, 1450);

    // Phase 2 -> 3: Begin smooth fade-out at 2400ms
    const t3 = setTimeout(() => {
      setPhase(3);
    }, 2400);

    // Phase 3 -> 4: Fully hidden at 2900ms
    const t4 = setTimeout(() => {
      setPhase(4);
      setIsDismissed(true);
      sessionStorage.setItem('zerox_splash_shown', 'true');
      if (onFinish) onFinish();
    }, 2900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [forceShow, onFinish]);

  // Handwriting typewriter interval during Phase 1
  useEffect(() => {
    if (phase < 1) {
      setTypedLetters(0);
      return;
    }
    if (phase >= 2) {
      setTypedLetters(FULL_BRAND_NAME.length);
      return;
    }

    const interval = setInterval(() => {
      setTypedLetters((prev) => {
        if (prev < FULL_BRAND_NAME.length) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 85);

    return () => clearInterval(interval);
  }, [phase]);

  // Allow manual skip with Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsDismissed(true);
        sessionStorage.setItem('zerox_splash_shown', 'true');
        if (onFinish) onFinish();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onFinish]);

  if (isDismissed || phase === 4) {
    return null;
  }

  const isOutlineActive = phase === 0;
  const isSolidFillActive = phase >= 1;
  const isFadingOut = phase === 3;

  return (
    <div
      data-testid="splash-screen"
      data-phase={phase}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#080B0A] select-none transition-all duration-500 ease-out ${
        isFadingOut ? 'opacity-0 scale-[1.02] pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        backgroundColor: '#080B0A',
      }}
    >
      {/* Radial ambient glow behind the logo */}
      <div
        className={`absolute w-[440px] h-[440px] rounded-full pointer-events-none transition-opacity duration-1000 ${
          phase >= 1 ? 'opacity-100' : 'opacity-35'
        }`}
        style={{
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.09) 0%, rgba(197, 243, 106, 0.04) 40%, transparent 70%)',
        }}
      />

      {/* Main Brand Assembly */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Monogram SVG "ZC" */}
        <div className="relative w-[240px] sm:w-[280px] h-[144px] sm:h-[168px] mb-4">
          <svg
            viewBox="0 0 300 180"
            className="w-full h-full overflow-visible"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outline Stroke Layer (Active in Phase 0) */}
            <path
              d={ZC_PATH}
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="1400"
              style={{
                strokeDashoffset: 0,
                opacity: phase === 0 ? 1 : 0,
                animation: phase === 0 ? 'drawStroke 0.65s cubic-bezier(0.25, 1, 0.5, 1) forwards' : 'none',
                transition: 'opacity 0.2s ease-in-out',
                filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))',
              }}
            />

            {/* Solid Pure White Fill Layer (Active in Phase 1+) */}
            <path
              d={ZC_PATH}
              fill="#ffffff"
              stroke="none"
              fillRule="evenodd"
              style={{
                display: phase >= 1 ? 'block' : 'none',
                filter: 'drop-shadow(0 0 24px rgba(255, 255, 255, 0.55)) drop-shadow(0 0 50px rgba(197, 243, 106, 0.25))',
              }}
            />
          </svg>
        </div>

        {/* Cursive Handwriting Brand Name */}
        <div className="h-14 sm:h-16 flex items-center justify-center mb-4">
          {phase >= 1 && (
            <div
              className="text-4xl sm:text-5xl text-white font-normal tracking-tight flex items-baseline select-none"
              style={{
                fontFamily: "'Brush Script MT', 'Kaushan Script', 'Caveat', cursive",
                textShadow: '0 0 20px rgba(255, 255, 255, 0.45), 0 0 40px rgba(197, 243, 106, 0.2)',
              }}
            >
              <span>{FULL_BRAND_NAME.slice(0, typedLetters)}</span>
              {/* Glowing ink tip cursor during writing */}
              {phase === 1 && typedLetters < FULL_BRAND_NAME.length && (
                <span className="inline-block w-1 h-6 ml-0.5 bg-[#C5F36A] rounded-full animate-pulse shadow-[0_0_10px_#C5F36A]" />
              )}
            </div>
          )}
        </div>

        {/* Subtitle: "STARTING CLOUD..." */}
        <div className="flex items-center gap-1 font-mono text-[10px] sm:text-[11px] tracking-[0.38em] text-neutral-400 font-semibold uppercase select-none">
          <span>STARTING CLOUD</span>
          <span className="inline-flex">
            <span className="animate-[pulse_1.2s_infinite_100ms] text-[#C5F36A]">.</span>
            <span className="animate-[pulse_1.2s_infinite_300ms] text-[#C5F36A]">.</span>
            <span className="animate-[pulse_1.2s_infinite_500ms] text-[#C5F36A]">.</span>
          </span>
        </div>
      </div>

      {/* Skip button for user convenience */}
      <button
        onClick={() => {
          setIsDismissed(true);
          sessionStorage.setItem('zerox_splash_shown', 'true');
          if (onFinish) onFinish();
        }}
        className="absolute bottom-6 right-6 text-[10px] uppercase font-mono tracking-widest text-neutral-500 hover:text-white transition px-3 py-1.5 rounded-lg bg-white/[0.02]"
      >
        Skip [ESC]
      </button>

      {/* Embedded CSS for stroke drawing animation */}
      <style>{`
        @keyframes drawStroke {
          0% {
            stroke-dashoffset: 1400;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
};
