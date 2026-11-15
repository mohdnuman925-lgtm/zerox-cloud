import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Check, ArrowRight, AlertCircle } from 'lucide-react';
import { BrandLogo } from '../components/common/BrandLogo';

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, discordLogin } = useAuth();
  const navigate = useNavigate();

  const handleDiscord = async () => {
    setError('');
    try {
      const res = await fetch('/api/auth/discord/url?redirect=/client/overview');
      const data = await res.json();
      if (data.configured && data.url) {
        window.location.href = data.url;
      } else {
        await discordLogin();
        navigate('/client/overview');
      }
    } catch (err) {
      await discordLogin();
      navigate('/client/overview');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters for security');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/client/overview');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] grid grid-cols-1 lg:grid-cols-2 relative z-10">
      {/* Left Pane */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-[#060807] -r text-white">
        {/* Brand matching video frame 040 */}
        <div>
          <BrandLogo size="md" />
        </div>

        <div className="space-y-8 max-w-md">
          <h2 className="text-4xl font-extrabold tracking-tight leading-tight">
            Global cloud &amp; game server hosting., built clean.
          </h2>

          <div className="space-y-4 text-sm text-neutral-300">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[#C5F36A]">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span>Instant provisioning after payment</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[#C5F36A]">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span>DDoS-filtered global network</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[#C5F36A]">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span>Manage everything from one dashboard</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[#C5F36A]">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span>24/7 ticket &amp; Discord support</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-neutral-500">
          © {new Date().getFullYear()} ZEROX CLOUD. All rights reserved.
        </p>
      </div>

      {/* Right Pane: Register Form */}
      <div className="flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-[#0c140f]/5 backdrop-blur-xl shadow-2xl text-white space-y-6">
          <div className="text-left">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Create your account</h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Get started in under a minute.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Discord Quick Register */}
          <button
            type="button"
            onClick={handleDiscord}
            className="w-full py-3 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow-lg"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
            Sign up with Discord
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[11px] font-mono text-neutral-500 uppercase">OR</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                NAME
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Mohd Numan"
                  className="w-full bg-black/40 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                EMAIL
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="mohdnuman925@gmail.com"
                  className="w-full bg-black/40 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                PASSWORD
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-black/40 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                CONFIRM PASSWORD
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-black/40 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-white text-black font-extrabold text-xs hover:bg-[#C5F36A] transition-all flex items-center justify-center gap-1.5 shadow-lg active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 -2 -black -t-transparent rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          <div className="text-center text-xs text-neutral-400 space-y-2 pt-2">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="text-white font-semibold hover:text-[#C5F36A] underline">
                Sign in
              </Link>
            </p>
            <Link to="/" className="inline-block text-[11px] text-neutral-500 hover:text-neutral-300">
              &larr; Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

