import React, { useState, useEffect } from 'react';
import { Cookie, Settings } from 'lucide-react';

export const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('zx_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConsent = (type) => {
    localStorage.setItem('zx_cookie_consent', type);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-5 left-5 z-40 max-w-sm p-4 rounded-2xl bg-[#0c140f]/5 backdrop-blur-2xl shadow-2xl text-white animate-slide-up">
      <div className="flex items-start gap-3 mb-3">
        <div className="p-2 rounded-xl bg-white/5 text-white">
          <Cookie className="w-5 h-5 text-[#C5F36A]" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Cookie Preferences</h4>
          <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">
            We use cookies to enhance your browsing experience, analyze traffic, and remember your preferences.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() => handleConsent('all')}
          className="flex-1 py-1.5 px-3 rounded-lg bg-white text-black font-semibold text-xs hover:bg-[#C5F36A] transition"
        >
          Accept All
        </button>
        <button
          onClick={() => handleConsent('reject')}
          className="flex-1 py-1.5 px-3 rounded-lg bg-white/10 text-white font-medium text-xs hover:bg-white/15 transition"
        >
          Reject All
        </button>
        <button
          onClick={() => handleConsent('custom')}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition"
          title="Customize settings"
          aria-label="Customize settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

