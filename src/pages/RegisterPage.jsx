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

  const { register } = useAuth();
  const navigate = useNavigate();

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
      <div className="hidden lg:flex flex-col justify-between p-12 bg-[#060807] border-r border-white/10 text-white">
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
        <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-[#121814]/90 backdrop-blur-xl border border-white/15 shadow-2xl text-white space-y-6">
          <div className="text-left">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Create your account</h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Get started in under a minute.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

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
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C5F36A]"
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
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C5F36A]"
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
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C5F36A]"
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
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C5F36A]"
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
                  <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
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

