import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Play } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export const Footer = () => {
  return (
    <footer className="relative bg-[#060807] -t text-neutral-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <BrandLogo size="md" />

            <p className="text-xs text-neutral-400 leading-relaxed">
              Premium hosting solutions for gamers and developers. Experience unmatched performance with our cutting-edge infrastructure.
            </p>

            <div className="flex items-center gap-2 text-[11px] text-neutral-500">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Game Panel: panel.zeroxcloud.site</span>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-4">
              Products
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/games" className="hover:text-white transition">
                  Game servers
                </Link>
              </li>
              <li>
                <Link to="/cloud" className="hover:text-white transition">
                  Cloud servers
                </Link>
              </li>
              <li>
                <Link to="/dedicated" className="hover:text-white transition">
                  Dedicated servers
                </Link>
              </li>
              <li>
                <Link to="/web" className="hover:text-white transition">
                  Web hosting
                </Link>
              </li>
              <li>
                <Link to="/bots" className="hover:text-white transition">
                  Discord bots
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-4">
              Account
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/client/overview" className="hover:text-white transition">
                  Client area
                </Link>
              </li>
              <li>
                <Link to="/client/support" className="hover:text-white transition">
                  Support tickets
                </Link>
              </li>
              <li>
                <Link to="/client/billing" className="hover:text-white transition">
                  Billing
                </Link>
              </li>
              <li>
                <Link to="/checkout" className="hover:text-white transition">
                  Cart & Checkout
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-4">
              Legal & Policies
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/terms" className="hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/refund" className="hover:text-white transition">
                  Refund Policy (Strict)
                </Link>
              </li>
              <li>
                <Link to="/dataloss" className="hover:text-white transition">
                  Data Loss & Backups
                </Link>
              </li>
              <li>
                <Link to="/rules" className="hover:text-white transition">
                  Server Rules & AUP
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 -t flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <p>© {new Date().getFullYear()} ZEROX CLOUD. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                sessionStorage.removeItem('zerox_splash_shown');
                window.dispatchEvent(new CustomEvent('zerox-replay-splash'));
              }}
              className="flex items-center gap-1.5 text-neutral-400 hover:text-[#C5F36A] transition px-2.5 py-1 rounded-md bg-white/[0.02]"
              title="Replay cinematic video intro"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Replay Intro</span>
            </button>
            <span className="flex items-center gap-1.5 text-neutral-400">
              <ShieldCheck className="w-4 h-4 text-[#C5F36A]" />
              Enterprise DDoS Protected Nodes
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

