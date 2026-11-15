import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LifeBuoy,
  Plus,
  Search,
  MessageSquare,
  Send,
  X,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

export const ClientSupport = () => {
  const { token, user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [activeTicket, setActiveTicket] = useState(null);
  const [threadMessages, setThreadMessages] = useState([]);
  const [replyInput, setReplyInput] = useState('');

  // New ticket state
  const [department, setDepartment] = useState('Game Server Support');
  const [priority, setPriority] = useState('medium');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/tickets', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setTickets(data.tickets || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchTickets();
  }, [token]);

  const handleOpenThread = async (ticket) => {
    setActiveTicket(ticket);
    try {
      const res = await fetch(`/api/tickets/${ticket.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setThreadMessages(data.messages || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyInput.trim() || !activeTicket) return;

    try {
      const res = await fetch(`/api/tickets/${activeTicket.id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ message: replyInput })
      });
      const data = await res.json();
      if (res.ok) {
        setThreadMessages((prev) => [...prev, data.newMessage]);
        setReplyInput('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitLoading(true);

    try {
      const res = await fetch('/api/tickets/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ department, priority, subject, message })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setNewModalOpen(false);
      setSubject('');
      setMessage('');
      await fetchTickets();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const filtered = tickets.filter((t) =>
    t.subject.toLowerCase().includes(search.toLowerCase()) ||
    t.ticket_number.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header matching video frame 046 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
            SUPPORT
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white mt-0.5">
            How can we help?
          </h1>
        </div>

        <button
          onClick={() => setNewModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-black text-xs font-bold hover:bg-[#C5F36A] transition shadow-lg"
        >
          <Plus className="w-4 h-4" />
          New ticket
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tickets..."
          className="w-full backdrop-blur-2xl rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none"
        />
      </div>

      {/* Tickets List / Empty State */}
      {filtered.length === 0 ? (
        <div className="bg-[#0c140f]/5 border border-white/15 py-20 rounded-3xl backdrop-blur-2xl text-center flex flex-col items-center justify-center p-8 space-y-2 text-neutral-400 shadow-xl">
          <LifeBuoy className="w-8 h-8 text-neutral-600 mb-2" />
          <h3 className="text-base font-bold text-white">No tickets yet</h3>
          <p className="text-xs text-neutral-500">
            Need a hand? Open a ticket and our 24/7 staff will get back to you.
          </p>
          <button
            onClick={() => setNewModalOpen(true)}
            className="mt-3 px-5 py-2 rounded-xl bg-white text-black font-bold text-xs hover:bg-[#C5F36A] transition"
          >
            Create Ticket
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filtered.map((t) => (
            <div
              key={t.id}
              onClick={() => handleOpenThread(t)}
              className="bg-[#0c140f]/5 border border-white/15 p-5 rounded-2xl backdrop-blur-2xl transition duration-200 cursor-pointer flex items-center justify-between gap-4 group shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-white/5 text-[#C5F36A] group-hover:bg-[#C5F36A]/10 transition">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-neutral-500 font-bold uppercase">
                      {t.ticket_number}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-[#C5F36A] px-1.5 py-0.5 rounded bg-[#C5F36A]/10">
                      {t.department}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-[#C5F36A] transition mt-0.5">
                    {t.subject}
                  </h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Updated {new Date(t.updated_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <span
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase ${
                  t.status === 'open'
                    ? 'bg-amber-500/20 text-amber-400  '
                    : t.status === 'answered'
                    ? 'bg-emerald-500/20 text-emerald-400  '
                    : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                {t.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Ticket Conversation Thread Modal */}
      {activeTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0c140f]/5 border border-white/15 w-full max-w-2xl rounded-3xl backdrop-blur-2xl shadow-2xl overflow-hidden flex flex-col h-[560px]">
            {/* Header */}
            <div className="p-4 backdrop-blur-2xl border-b border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-[#C5F36A] uppercase font-bold">
                  {activeTicket.ticket_number} • {activeTicket.department}
                </span>
                <h3 className="text-sm font-bold text-white mt-0.5">{activeTicket.subject}</h3>
              </div>
              <button
                onClick={() => setActiveTicket(null)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs">
              {threadMessages.map((msg) => {
                const isStaff = msg.sender_role !== 'customer';
                return (
                  <div
                    key={msg.id}
                    className={`p-4 rounded-2xl ${
                      isStaff
                        ? 'bg-[#18241B]  text-neutral-200'
                        : 'bg-black/40  text-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        {msg.sender_name}
                        {isStaff && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-[#C5F36A] text-black">
                            ZEROX STAFF
                          </span>
                        )}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-500">
                        {new Date(msg.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                  </div>
                );
              })}
            </div>

            {/* Reply Input */}
            <form onSubmit={handleSendReply} className="p-3 backdrop-blur-2xl border-t border-white/10 flex gap-2">
              <input
                type="text"
                value={replyInput}
                onChange={(e) => setReplyInput(e.target.value)}
                placeholder="Type your response to staff..."
                className="flex-1 bg-black/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs hover:bg-[#C5F36A] transition flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
                Reply
              </button>
            </form>
          </div>
        </div>
      )}

      {/* New Ticket Modal */}
      {newModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0c140f]/5 border border-white/15 w-full max-w-lg p-6 rounded-3xl backdrop-blur-2xl shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Open Support Ticket</h3>
              <button
                onClick={() => setNewModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && <p className="text-xs text-red-400">{error}</p>}

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">
                    DEPARTMENT
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-black/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="Game Server Support">Game Server Support</option>
                    <option value="Cloud / VPS Support">Cloud / VPS Support</option>
                    <option value="Billing & Invoices">Billing &amp; Invoices</option>
                    <option value="General Technical">General Technical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">
                    PRIORITY
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full bg-black/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">
                  SUBJECT
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Modpack crashes on boot"
                  className="w-full bg-black/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">
                  MESSAGE
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please describe what you are trying to do and any error messages..."
                  className="w-full bg-black/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="flex-1 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-[#C5F36A] transition"
                >
                  {submitLoading ? 'Submitting...' : 'Submit Ticket'}
                </button>
                <button
                  type="button"
                  onClick={() => setNewModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 text-white text-xs hover:bg-white/15 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

