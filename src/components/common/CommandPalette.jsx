import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Gamepad2, Cloud, Server, Globe, Bot, Shield, FileText, X, Play } from 'lucide-react';

export const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const commands = [
    { title: 'Minecraft Server Hosting', category: 'Game Hosting', path: '/games?game=minecraft', icon: Gamepad2 },
    { title: 'Rust Server Hosting', category: 'Game Hosting', path: '/games?game=rust', icon: Gamepad2 },
    { title: 'Counter-Strike 2 Hosting', category: 'Game Hosting', path: '/games?game=cs2', icon: Gamepad2 },
    { title: 'Cloud / VPS Hosting', category: 'Cloud Infrastructure', path: '/cloud', icon: Cloud },
    { title: 'Dedicated Bare-Metal Servers', category: 'Infrastructure', path: '/dedicated', icon: Server },
    { title: 'Web Hosting & Domains', category: 'Web Solutions', path: '/web', icon: Globe },
    { title: 'Discord Bot Hosting', category: 'Application Hosting', path: '/bots', icon: Bot },
    { title: 'Pricing Matrix & Calculator', category: 'Products', path: '/pricing', icon: Server },
    { title: 'Client Area Dashboard', category: 'Account', path: '/client/overview', icon: Shield },
    { title: 'Super Admin Control Center', category: 'Administration', path: '/admin/overview', icon: Shield },
    { title: 'Replay Cinematic Intro (Splash Screen)', category: 'Experience', action: 'replay-splash', icon: Play },
    { title: 'Terms of Service', category: 'Legal', path: '/terms', icon: FileText },
    { title: 'Privacy Policy', category: 'Legal', path: '/privacy', icon: FileText },
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onClose(!isOpen);
      }
      if (e.key === 'Escape' && isOpen) {
        onClose(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (cmd) => {
    if (cmd.action === 'replay-splash') {
      sessionStorage.removeItem('zerox_splash_shown');
      window.dispatchEvent(new CustomEvent('zerox-replay-splash'));
    } else if (cmd.path) {
      navigate(cmd.path);
    }
    onClose(false);
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl rounded-2xl bg-[#121814] border border-white/15 shadow-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 gap-3">
          <Search className="w-5 h-5 text-neutral-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search servers, plans, docs, or settings..."
            autoFocus
            className="flex-1 bg-transparent text-white placeholder-neutral-500 focus:outline-none text-sm"
          />
          <button
            onClick={() => onClose(false)}
            className="text-neutral-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length > 0 ? (
            filtered.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleSelect(item)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/10 text-left transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-neutral-300 group-hover:text-[#C5F36A] group-hover:border-[#C5F36A]/30 transition">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white group-hover:text-[#C5F36A] transition">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-neutral-400">{item.category}</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-neutral-500 group-hover:text-white transition font-mono">
                    Jump ↵
                  </span>
                </button>
              );
            })
          ) : (
            <div className="py-8 text-center text-sm text-neutral-400">
              No matching destinations found for "{query}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

