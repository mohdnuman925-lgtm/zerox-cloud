import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BrandLogo } from './BrandLogo';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useSound } from '../../context/SoundContext';
import {
  Gamepad2,
  Cloud,
  Bot,
  Globe,
  ChevronDown,
  Search,
  ShoppingCart,
  User,
  LogOut,
  ShieldAlert,
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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
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
    <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${isScrolled ? 'bg-[#080B0A]/95 backdrop-blur-2xl border-b border-white/15 shadow-2xl py-0' : 'bg-[#080B0A]/70 backdrop-blur-md border-b border-white/10'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo matching video identity */}
        <BrandLogo />

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {/* Games Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setGamesOpen(true)}
            onMouseLeave={() => setGamesOpen(false)}
          >
            <Link
              to="/games"
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition ${
                location.pathname === '/games'
                  ? 'text-white bg-white/10'
                  : 'text-neutral-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Games
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
            </Link>

            {gamesOpen && (
              <div className="absolute top-full left-0 w-72 p-2 rounded-2xl bg-[#121814] border border-white/15 shadow-2xl space-y-1 animate-fade-in">
                <Link
                  to="/games?game=minecraft"
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/10 text-neutral-200 hover:text-white transition group"
                >
                  <div className="flex items-center gap-3">
                    <Gamepad2 className="w-4 h-4 text-[#C5F36A]" />
                    <div>
                      <p className="text-xs font-bold text-white">Minecraft</p>
                      <p className="text-[10px] text-neutral-400">Paper, Purpur, Forge, Bedrock</p>
                    </div>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    LIVE
                  </span>
                </Link>
                <Link
                  to="/games?game=rust"
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/10 text-neutral-200 hover:text-white transition group"
                >
                  <div className="flex items-center gap-3">
                    <Gamepad2 className="w-4 h-4 text-orange-400" />
                    <div>
                      <p className="text-xs font-bold text-white">Rust</p>
                      <p className="text-[10px] text-neutral-400">Oxide / uMod high-tick</p>
                    </div>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30">
                    SOON
                  </span>
                </Link>
                <Link
                  to="/games?game=cs2"
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/10 text-neutral-200 hover:text-white transition group"
                >
                  <div className="flex items-center gap-3">
                    <Gamepad2 className="w-4 h-4 text-sky-400" />
                    <div>
                      <p className="text-xs font-bold text-white">Counter-Strike 2</p>
                      <p className="text-[10px] text-neutral-400">128-tick tournament nodes</p>
                    </div>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-sky-500/20 text-sky-400 border border-sky-500/30">
                    SOON
                  </span>
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/cloud"
            className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition ${
              location.pathname === '/cloud' ? 'text-white bg-white/10' : 'text-neutral-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Cloud
          </Link>

          <Link
            to="/dedicated"
            className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition ${
              location.pathname === '/dedicated' ? 'text-white bg-white/10' : 'text-neutral-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Dedicated
          </Link>

          <Link
            to="/bots"
            className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition ${
              location.pathname === '/bots' ? 'text-white bg-white/10' : 'text-neutral-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Bots
          </Link>

          <Link
            to="/web"
            className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition ${
              location.pathname === '/web' ? 'text-white bg-white/10' : 'text-neutral-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Web
          </Link>

          <Link
            to="/pricing"
            className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition ${
              location.pathname === '/pricing' ? 'text-white bg-white/10' : 'text-neutral-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Pricing
          </Link>

          <Link
            to="/about"
            className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition ${
              location.pathname === '/about' ? 'text-white bg-white/10' : 'text-neutral-300 hover:text-white hover:bg-white/5'
            }`}
          >
            About Us
          </Link>

          <Link
            to="/blog"
            className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition ${
              location.pathname === '/blog' ? 'text-white bg-white/10' : 'text-neutral-300 hover:text-white hover:bg-white/5'
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
            <button className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide text-neutral-300 hover:text-white hover:bg-white/5 transition">
              Legal
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
            </button>
            {legalOpen && (
              <div className="absolute top-full left-0 w-44 p-2 rounded-2xl bg-[#121814] border border-white/15 shadow-2xl space-y-1 animate-fade-in">
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

        {/* Right Nav Utilities */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Discord Button */}
          <a
            href="https://discord.gg/zeroxcloud"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-[#5865F2] transition border border-white/10"
            title="Join ZEROX CLOUD Discord"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
          </a>

          {/* Search Trigger */}
          <button
            onClick={() => onOpenSearch(true)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition border border-white/10 text-xs"
            title="Search (Ctrl + K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Search</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.5 rounded bg-black/40 text-[10px] font-mono text-neutral-400 border border-white/10">
              ⌘K
            </kbd>
          </button>

          {/* Currency Toggle */}
          <button
            onClick={handleCurrencyToggle}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-white transition border border-white/10 font-mono"
            title="Switch currency"
          >
            <span>{currency === 'INR' ? '🇮🇳 ₹ INR' : '🇺🇸 $ USD'}</span>
          </button>

          {/* Sound FX Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-lg transition border text-xs flex items-center justify-center ${
              soundEnabled
                ? 'bg-white/5 hover:bg-white/10 text-[#C5F36A] border-white/10'
                : 'bg-white/5 hover:bg-white/10 text-neutral-500 border-white/5'
            }`}
            title={soundEnabled ? 'Click sound: ON (click to mute)' : 'Click sound: MUTED (click to enable)'}
            aria-label="Toggle clicking sound"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#C5F36A]" />
            ) : (
              <VolumeX className="w-4 h-4 text-neutral-500" />
            )}
          </button>

          {/* Cart Drawer Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition border border-white/10"
            aria-label="View shopping cart"
          >
            <ShoppingCart className="w-4 h-4" />
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#C5F36A] text-black font-extrabold text-[10px] flex items-center justify-center ring-2 ring-[#080B0A]">
                {totalCount}
              </span>
            )}
          </button>

          {/* Auth State / Profile */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-white/10 hover:bg-white/15 transition border border-white/10 text-xs font-semibold text-white"
              >
                <div className="w-6 h-6 rounded-lg bg-[#C5F36A] text-black flex items-center justify-center font-bold text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline max-w-[100px] truncate">
                  {user.name}
                </span>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 p-2 rounded-2xl bg-[#121814] border border-white/15 shadow-2xl space-y-1 text-xs animate-fade-in z-50">
                  <div className="px-3 py-2 border-b border-white/10 mb-1">
                    <p className="font-bold text-white truncate">{user.name}</p>
                    <p className="text-[10px] text-neutral-400 truncate">{user.email}</p>
                    <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider bg-white/10 text-[#C5F36A]">
                      {user.role}
                    </span>
                  </div>

                  <Link
                    to="/client/overview"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-xl text-neutral-200 hover:text-white hover:bg-white/10 transition"
                  >
                    <User className="w-4 h-4 text-[#C5F36A]" />
                    Client Dashboard
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin/overview"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 p-2 rounded-xl text-[#C5F36A] hover:bg-[#C5F36A]/10 transition font-bold"
                    >
                      <ShieldAlert className="w-4 h-4" />
                      Super Admin Panel
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                      navigate('/');
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-xl text-red-400 hover:bg-red-500/10 transition text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-neutral-300 hover:text-white hover:bg-white/10 transition"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white text-black hover:bg-[#C5F36A] transition shadow-md active:scale-95"
              >
                Sign up
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-white/5 text-neutral-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0D120E] border-b border-white/10 px-4 py-4 space-y-2 text-sm animate-fade-in">
          <div>
            <Link
              to="/games"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-neutral-200 hover:text-white font-semibold"
            >
              Game Servers
            </Link>
            <div className="pl-3 pb-1 space-y-1 border-l border-white/10 ml-2">
              <Link
                to="/games?game=minecraft"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-1 text-xs text-neutral-300 hover:text-white"
              >
                <span>Minecraft</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">LIVE</span>
              </Link>
              <Link
                to="/games?game=rust"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-1 text-xs text-neutral-300 hover:text-white"
              >
                <span>Rust</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 font-bold">SOON</span>
              </Link>
              <Link
                to="/games?game=cs2"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-1 text-xs text-neutral-300 hover:text-white"
              >
                <span>Counter-Strike 2</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 font-bold">SOON</span>
              </Link>
            </div>
          </div>
          <Link
            to="/cloud"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-neutral-200 hover:text-white font-semibold"
          >
            Cloud / VPS
          </Link>
          <Link
            to="/dedicated"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-neutral-200 hover:text-white font-semibold"
          >
            Dedicated Servers
          </Link>
          <Link
            to="/web"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-neutral-200 hover:text-white font-semibold"
          >
            Web Hosting
          </Link>
          <Link
            to="/bots"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-neutral-200 hover:text-white font-semibold"
          >
            Discord Bots
          </Link>
          <Link
            to="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-neutral-200 hover:text-white font-semibold"
          >
            Pricing
          </Link>
          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-neutral-400">Currency</span>
            <button
              onClick={handleCurrencyToggle}
              className="text-xs font-bold text-white px-2 py-1 bg-white/10 rounded"
            >
              {currency === 'INR' ? '🇮🇳 ₹ INR' : '🇺🇸 $ USD'}
            </button>
          </div>
          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-neutral-400">Clicking Sound</span>
            <button
              onClick={toggleSound}
              className={`text-xs font-bold px-2 py-1 rounded flex items-center gap-1.5 transition ${
                soundEnabled
                  ? 'bg-[#C5F36A]/20 text-[#C5F36A] border border-[#C5F36A]/30'
                  : 'bg-white/10 text-neutral-400 border border-white/10'
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
    </header>
  );
};

