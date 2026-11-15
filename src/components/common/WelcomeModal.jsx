import React, { useState, useEffect } from 'react';
import { Sparkles, Copy, Check, X } from 'lucide-react';

export const WelcomeModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [siteSettings, setSiteSettings] = useState(null);

  useEffect(() => {
    fetch('/api/products/settings')
      .then((r) => r.json())
      .then((d) => {
        const s = d.settings || {};
        setSiteSettings(s);
        if (s.welcome_modal_enabled === false) {
          return;
        }
        const hasSeen = sessionStorage.getItem('zx_welcome_seen');
        if (!hasSeen) {
          const timer = setTimeout(() => {
            setIsOpen(true);
          }, 1200);
          return () => clearTimeout(timer);
        }
      })
      .catch(() => {
        const hasSeen = sessionStorage.getItem('zx_welcome_seen');
        if (!hasSeen) {
          const timer = setTimeout(() => {
            setIsOpen(true);
          }, 1200);
          return () => clearTimeout(timer);
        }
      });
  }, []);

  const couponCode = siteSettings?.welcome_coupon_code || 'ZEROXCLOUD';
  const discountPercent = siteSettings?.welcome_discount_percent || 10;

  const handleCopy = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    sessionStorage.setItem('zx_welcome_seen', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md p-7 rounded-2xl bg-[#121814] border border-white/15 shadow-2xl shadow-black text-center text-white">
        {/* Close X */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition"
          aria-label="Close welcome modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/10 text-white/90 mb-4 border border-white/10">
          <Sparkles className="w-3.5 h-3.5 text-[#C5F36A]" />
          Welcome Offer
        </div>

        <h3 className="text-2xl font-bold tracking-tight text-white mb-2">
          Welcome to ZEROX CLOUD
        </h3>

        <div className="my-3 text-4xl font-extrabold tracking-tight text-white">
          {discountPercent}% OFF
        </div>

        <p className="text-sm text-neutral-400 mb-1">
          Start your hosting journey with a special discount.
        </p>
        <span className="text-xs uppercase tracking-widest text-[#C5F36A] font-semibold block mb-5">
          New Users Only
        </span>

        {/* Coupon Box */}
        <div className="flex items-center justify-between p-3 px-4 rounded-xl bg-black/40 border border-white/10 mb-4">
          <span className="font-mono font-bold tracking-wider text-base text-white">
            {couponCode}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#C5F36A]" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy
              </>
            )}
          </button>
        </div>

        {/* Primary CTA */}
        <button
          onClick={handleClose}
          className="w-full py-3 rounded-xl bg-white text-black font-semibold hover:bg-[#C5F36A] transition-all duration-200 shadow-lg shadow-white/10 active:scale-[0.99]"
        >
          Got it
        </button>

        <p className="text-[11px] text-neutral-500 mt-3">
          Valid on all ZEROX CLOUD game servers and cloud instances.
        </p>
      </div>
    </div>
  );
};

