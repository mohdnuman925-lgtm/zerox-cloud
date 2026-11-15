import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BrandLogo } from './BrandLogo';
import { GameLogo } from './GameLogo';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useSound } from '../../context/SoundContext';
import {
  ChevronDown,
  Search,
  ShoppingCart,
  User,
  LogOut,
  LogIn,
  Menu,
  X,
  Volume2,
  VolumeX
} from 'lucide-react';

export const Navbar = ({ onOpenSearch }) => {
  const { user, isAdmin, logout } = useAuth();
  const { totalCount, setIsCartOpen, currency, setCurrency } = useCart();
  const { soundEnabled, toggleSound } = useSound();
  const [gamesOpen, setGamesOpen] = useState(false);
  const [legalOpen, setLegalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigate = useNavigate();
  const location = useLocation();

  const handleCurrencyToggle = () => {
    setCurrency(currency === 'INR' ? 'USD' : 'INR');
  };

  return (
    <header className="sticky top-0 z-40 w-full px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4 transition-all duration-300 pointer-events-none">
      <div className="max-w-7xl mx-auto pointer-events-auto">
        <div
          className={`rounded-full bg-[#0e1611]/5 backdrop-blur-2xl px-4 sm:px-6 h-14 flex items-center justify-between gap-3 sm:gap-4 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.35)] ${
            isScrolled
              ? 'bg-[#0e1611]/10 shadow-[0_12px_40px_rgba(0,0,0,0.55)]'
              : ''
          }`}
        >
          {/* Brand Logo matching reference identity */}
          <BrandLogo size="md" />

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-[13px] font-medium text-neutral-300">
            {/* Games Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setGamesOpen(true)}
              onMouseLeave={() => setGamesOpen(false)}
            >
              <button
                onClick={() => navigate('/games')}
                className={`flex items-center gap-1 transition ${
                  location.pathname === '/games' ? 'text-white font-semibold' : 'hover:text-white'
                }`}
              >
                <span>Games</span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              {gamesOpen && (
                <div className="absolute top-full left-0 mt-3 w-72 p-2 rounded-2xl bg-[#0e1611]/5 backdrop-blur-2xl shadow-2xl space-y-1 animate-fade-in z-50">
                  <Link
                    to="/games?game=minecraft"
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/10 text-neutral-200 hover:text-white transition group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-lg bg-emerald-950/80 p-1 flex items-center justify-center shrink-0">
                        <GameLogo game="minecraft" className="w-full h-full" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Minecraft</p>
                        <p className="text-[10px] text-neutral-400">Paper, Purpur, Forge, Bedrock</p>
                      </div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400">
                      LIVE
                    </span>
                  </Link>
                  <Link
                    to="/games?game=rust"
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/10 text-neutral-200 hover:text-white transition group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-lg bg-orange-950/80 p-1 flex items-center justify-center shrink-0">
                        <GameLogo game="rust" className="w-full h-full" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Rust</p>
                        <p className="text-[10px] text-neutral-400">Oxide / uMod high-tick</p>
                      </div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-orange-500/20 text-orange-400">
                      SOON
                    </span>
                  </Link>
                  <Link
                    to="/games?game=cs2"
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/10 text-neutral-200 hover:text-white transition group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-lg bg-sky-950/80 p-1 flex items-center justify-center shrink-0">
                        <GameLogo game="cs2" className="w-full h-full" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Counter-Strike 2</p>
                        <p className="text-[10px] text-neutral-400">128-tick tournament nodes</p>
                      </div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-sky-500/20 text-sky-400">
                      SOON
                    </span>
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/cloud"
              className={`transition ${
                location.pathname === '/cloud' ? 'text-white font-semibold' : 'hover:text-white'
              }`}
            >
              Cloud
            </Link>

            <Link
              to="/bots"
              className={`transition ${
                location.pathname === '/bots' ? 'text-white font-semibold' : 'hover:text-white'
              }`}
            >
              Bots
            </Link>

            <Link
              to="/web"
              className={`transition ${
                location.pathname === '/web' ? 'text-white font-semibold' : 'hover:text-white'
              }`}
            >
              Web
            </Link>

            <Link
              to="/about"
              className={`transition ${
                location.pathname === '/about' ? 'text-white font-semibold' : 'hover:text-white'
              }`}
            >
              About Us
            </Link>

            <Link
              to="/blog"
              className={`transition ${
                location.pathname === '/blog' ? 'text-white font-semibold' : 'hover:text-white'
              }`}
            >
              Blog
            </Link>

            {/* Legal Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setLegalOpen(true)}
              onMouseLeave={() => setLegalOpen(false)}
            >
              <button className="flex items-center gap-1 text-neutral-300 hover:text-white transition">
                <span>Legal</span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              </button>
              {legalOpen && (
                <div className="absolute top-full left-0 mt-3 w-48 p-2 rounded-2xl bg-[#0e1611]/5 backdrop-blur-2xl shadow-2xl space-y-1 animate-fade-in z-50">
                  <Link
                    to="/terms"
                    className="block p-2 rounded-xl text-xs text-neutral-200 hover:text-white hover:bg-white/10 transition"
                  >
                    Terms of Service
                  </Link>
                  <Link
                    to="/privacy"
                    className="block p-2 rounded-xl text-xs text-neutral-200 hover:text-white hover:bg-white/10 transition"
                  >
                    Privacy Policy
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Right Nav Utilities matching reference layout */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Discord Icon */}
            <a
              href="https://discord.gg/zeroxcloud"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-white transition p-1.5 flex items-center justify-center"
              title="Join ZeroxCloud Discord"
              aria-label="Discord"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.078.078 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
            </a>

            {/* Search Pill */}
            <button
              onClick={() => onOpenSearch(true)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-neutral-400 hover:text-white transition text-xs shadow-sm"
              title="Search (Ctrl + K)"
            >
              <Search className="w-3.5 h-3.5 text-neutral-400" />
              <span>Search</span>
              <kbd className="px-1.5 py-0.5 rounded bg-black/40 text-[10px] font-mono text-neutral-400">
                ⌘K
              </kbd>
            </button>

            {/* Currency / Region Flag Pill */}
            <button
              onClick={handleCurrencyToggle}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-white transition shadow-sm"
              title={`Currency: ${currency} (Click to toggle)`}
            >
              <span className="w-4 h-4 rounded-full overflow-hidden flex items-center justify-center text-sm shadow-sm select-none">
                {currency === 'INR' ? '🇮🇳' : '🇺🇸'}
              </span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {/* Click Sound FX Toggle */}
            <button
              onClick={toggleSound}
              className="text-neutral-400 hover:text-[#C5F36A] transition p-1.5 hidden sm:flex items-center justify-center"
              title={soundEnabled ? 'Click sound: ON (click to mute)' : 'Click sound: MUTED (click to enable)'}
              aria-label="Toggle clicking sound"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-[#C5F36A]" />
              ) : (
                <VolumeX className="w-4 h-4 text-neutral-500" />
              )}
            </button>

            {/* Shopping Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-1.5 text-neutral-300 hover:text-white transition flex items-center justify-center"
              aria-label="View shopping cart"
            >
              <ShoppingCart className="w-4 h-4" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-[#C5F36A] text-black font-extrabold text-[9px] flex items-center justify-center ring-2 ring-black">
                  {totalCount}
                </span>
              )}
            </button>

            {/* White Dashboard Capsule Button */}
            <button
              onClick={() => {
                if (user) {
                  navigate(isAdmin ? '/admin/overview' : '/client/overview');
                } else {
                  navigate('/login?redirect=/client/overview');
                }
              }}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-white hover:bg-[#C5F36A] text-black font-bold text-xs shadow-md transition-all active:scale-95 flex-shrink-0"
            >
              <User className="w-3.5 h-3.5 stroke-[2.2]" />
              <span>Dashboard</span>
            </button>

            {/* Exit / Door Icon (Sign In / Sign Out) */}
            {user ? (
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="text-neutral-400 hover:text-white transition p-1.5 flex items-center justify-center"
                title="Sign out"
                aria-label="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <Link
                to="/login"
                className="text-neutral-400 hover:text-white transition p-1.5 flex items-center justify-center"
                title="Sign in"
                aria-label="Sign in"
              >
                <LogIn className="w-4 h-4" />
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg text-neutral-300 hover:text-white"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer with Matching 95% Transparency and No Outline */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 p-4 rounded-3xl bg-[#0e1611]/5 backdrop-blur-2xl shadow-2xl space-y-2 text-sm animate-fade-in text-white">
            <div>
              <Link
                to="/games"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-neutral-200 hover:text-white font-semibold"
              >
                Game Servers
              </Link>
              <div className="pl-3 pb-1 space-y-1 -l ml-2">
                <Link
                  to="/games?game=minecraft"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-1 text-xs text-neutral-300 hover:text-white"
                >
                  <span className="flex items-center gap-2">
                    <GameLogo game="minecraft" className="w-4 h-4" />
                    <span>Minecraft</span>
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                    LIVE
                  </span>
                </Link>
                <Link
                  to="/games?game=rust"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-1 text-xs text-neutral-300 hover:text-white"
                >
                  <span className="flex items-center gap-2">
                    <GameLogo game="rust" className="w-4 h-4" />
                    <span>Rust</span>
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 font-bold">
                    SOON
                  </span>
                </Link>
                <Link
                  to="/games?game=cs2"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-1 text-xs text-neutral-300 hover:text-white"
                >
                  <span className="flex items-center gap-2">
                    <GameLogo game="cs2" className="w-4 h-4" />
                    <span>Counter-Strike 2</span>
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 font-bold">
                    SOON
                  </span>
                </Link>
              </div>
            </div>

            <Link
              to="/cloud"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-neutral-200 hover:text-white font-semibold"
            >
              Cloud
            </Link>
            <Link
              to="/bots"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-neutral-200 hover:text-white font-semibold"
            >
              Bots
            </Link>
            <Link
              to="/web"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-neutral-200 hover:text-white font-semibold"
            >
              Web
            </Link>
            <Link
              to="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-neutral-200 hover:text-white font-semibold"
            >
              Pricing
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-neutral-200 hover:text-white font-semibold"
            >
              About Us
            </Link>
            <Link
              to="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-neutral-200 hover:text-white font-semibold"
            >
              Blog
            </Link>
            <Link
              to="/terms"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-neutral-200 hover:text-white font-semibold"
            >
              Terms of Service
            </Link>
            <Link
              to="/privacy"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-neutral-200 hover:text-white font-semibold"
            >
              Privacy Policy
            </Link>

            <div className="pt-2 -t flex items-center justify-between">
              <span className="text-xs text-neutral-400">Currency</span>
              <button
                onClick={handleCurrencyToggle}
                className="text-xs font-bold text-white px-2.5 py-1 bg-white/10 rounded-full"
              >
                {currency === 'INR' ? '🇮🇳 ₹ INR' : '🇺🇸 $ USD'}
              </button>
            </div>

            <div className="pt-2 -t flex items-center justify-between">
              <span className="text-xs text-neutral-400">Clicking Sound</span>
              <button
                onClick={toggleSound}
                className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 transition ${
                  soundEnabled
                    ? 'bg-[#C5F36A]/20 text-[#C5F36A] '
                    : 'bg-white/10 text-neutral-400 '
                }`}
              >
                {soundEnabled ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>ON</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>MUTED</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
