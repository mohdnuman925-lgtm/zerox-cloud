import React, { useState } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hi there! Welcome to ZEROX CLOUD. How can we help you deploy your next server today?'
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      let replyText = 'Thanks for reaching out! Our high-performance nodes in Noida & Mumbai feature sub-15ms latency and instant provisioning. You can also join our Discord or submit a ticket from your Client Area.';
      if (input.toLowerCase().includes('minecraft') || input.toLowerCase().includes('forge')) {
        replyText = 'Our Minecraft plans support Paper, Purpur, Forge, Fabric, and Bedrock with 1-click startup and automated mod support starting at ₹40/mo!';
      } else if (input.toLowerCase().includes('vps') || input.toLowerCase().includes('cloud')) {
        replyText = 'All Cloud VPS instances come with dedicated IPv4, NVMe Gen4 storage, and full root access in Mumbai & Noida!';
      }
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'bot', text: replyText }
      ]);
    }, 700);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {isOpen ? (
        <div className="bg-[#0c140f]/5 border border-white/15 w-80 sm:w-96 rounded-2xl backdrop-blur-2xl shadow-2xl overflow-hidden flex flex-col h-[450px] animate-scale-up">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-[#17201a] border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-[#C5F36A] flex items-center justify-center text-black font-bold text-xs">
                  ZX
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#17201a]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">ZEROX Live Support</h4>
                <p className="text-[11px] text-[#C5F36A]">Online • Instant Replies</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-neutral-400 hover:text-white transition"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Message List */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-sm">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[#C5F36A] flex-shrink-0 mt-1">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[80%] text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#C5F36A] text-black font-medium rounded-tr-none'
                      : 'bg-white/5  text-neutral-200 rounded-tl-none'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSend} className="p-3 backdrop-blur-2xl border-t border-white/10 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about hosting..."
              className="flex-1 bg-black/40 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-white text-black hover:bg-[#C5F36A] transition"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 rounded-full bg-white text-black hover:bg-[#C5F36A] transition-all duration-200 shadow-xl flex items-center justify-center group active:scale-95"
          aria-label="Open support chat"
        >
          <MessageSquare className="w-5 h-5 transition-transform group-hover:scale-110" />
        </button>
      )}
    </div>
  );
};

