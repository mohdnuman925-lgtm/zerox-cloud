import React, { useState } from 'react';
import { Mail, MessageCircle, MapPin, Send, CheckCircle } from 'lucide-react';

export const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="py-16 relative z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-left">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C5F36A]">
            CONTACT US
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mt-1">
            Get in touch with ZEROX CLOUD
          </h1>
          <p className="mt-2 text-sm text-neutral-300">
            Have a custom enterprise inquiry or partnership request? Drop us a line.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="p-6 rounded-3xl  backdrop-blur-2xl space-y-4 shadow-xl">
              <h3 className="text-base font-bold text-white">Direct Contacts</h3>

              <div className="space-y-3 text-xs text-neutral-300">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#C5F36A]" />
                  <span>support@zeroxcloud.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-4 h-4 text-[#5865F2]" />
                  <span>discord.gg/zeroxcloud</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>Noida &amp; Mumbai Edge Datacenters, India</span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 rounded-3xl  backdrop-blur-2xl space-y-4 shadow-xl text-xs">
            {sent && (
              <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Message received! Our team will respond shortly.</span>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-mono text-neutral-400 mb-1">NAME</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-black/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-neutral-400 mb-1">EMAIL</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full bg-black/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-neutral-400 mb-1">MESSAGE</label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us about your project..."
                className="w-full bg-black/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-white text-black font-bold text-xs hover:bg-[#C5F36A] transition flex items-center justify-center gap-1.5 shadow-lg"
            >
              <Send className="w-4 h-4" />
              Send Inquiry
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

