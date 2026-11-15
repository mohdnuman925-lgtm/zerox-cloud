import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LifeBuoy, MessageSquare, Send, Shield, X, RefreshCw } from 'lucide-react';

export const AdminTickets = () => {
  const { token, user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTicket, setActiveTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [statusVal, setStatusVal] = useState('answered');

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/tickets', {
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

  const handleSelectTicket = async (ticket) => {
    setActiveTicket(ticket);
    setStatusVal(ticket.status);
    try {
      const res = await fetch(`/api/admin/tickets/${ticket.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicket) return;

    try {
      const res = await fetch(`/api/admin/tickets/${activeTicket.id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          message: replyText,
          is_internal: isInternal,
          status: statusVal
        })
      });
      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, data.newMessage]);
        setReplyText('');
        setIsInternal(false);
        await fetchTickets();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
            SUPPORT DESK
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
            Customer Support Tickets
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Handle customer requests, add staff-only internal notes, and manage resolutions.
          </p>
        </div>

        <button
          onClick={fetchTickets}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-neutral-300 hover:text-white transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tickets Queue */}
        <div className="lg:col-span-5 space-y-3">
          {tickets.map((t) => {
            const isSelected = activeTicket && activeTicket.id === t.id;
            return (
              <div
                key={t.id}
                onClick={() => handleSelectTicket(t)}
                className={`p-4 rounded-2xl  cursor-pointer transition ${
                  isSelected
                    ? 'bg-[#18241B] -[#C5F36A] shadow-lg'
                    : ' backdrop-blur-2xl  hover:'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-neutral-400 font-bold uppercase">
                    {t.ticket_number} • {t.department}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      t.status === 'open'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mt-1">{t.subject}</h4>
                <p className="text-xs text-neutral-400 mt-0.5 font-mono">
                  {t.user_name} ({t.user_email})
                </p>
              </div>
            );
          })}
        </div>

        {/* Conversation & Reply Thread */}
        <div className="lg:col-span-7">
          {activeTicket ? (
            <div className="rounded-3xl  backdrop-blur-2xl overflow-hidden flex flex-col h-[580px] shadow-2xl">
              <div className="p-4  backdrop-blur-2xl -b flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">{activeTicket.subject}</h3>
                  <p className="text-xs text-neutral-400 font-mono">
                    User: {activeTicket.user_name} ({activeTicket.user_email})
                  </p>
                </div>
                <select
                  value={statusVal}
                  onChange={(e) => setStatusVal(e.target.value)}
                  className="bg-black/50 rounded-xl px-2.5 py-1 text-xs text-white"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="answered">Answered</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              {/* Message History */}
              <div className="flex-1 p-5 overflow-y-auto space-y-3 text-xs">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`p-4 rounded-2xl ${
                      m.is_internal
                        ? 'bg-amber-500/10   text-amber-200'
                        : m.sender_role !== 'customer'
                        ? 'bg-[#18241B]  text-neutral-200'
                        : 'bg-black/40  text-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        {m.sender_name}
                        {m.is_internal && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-500 text-black font-extrabold uppercase">
                            INTERNAL NOTE (Customer Cannot See)
                          </span>
                        )}
                        {!m.is_internal && m.sender_role !== 'customer' && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-[#C5F36A] text-black font-extrabold uppercase">
                            STAFF
                          </span>
                        )}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-500">
                        {new Date(m.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap leading-relaxed">{m.message}</p>
                  </div>
                ))}
              </div>

              {/* Reply Box */}
              <form onSubmit={handleSendReply} className="p-4  backdrop-blur-2xl -t space-y-3">
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={isInternal ? 'Type private internal note for other staff...' : 'Type response to customer...'}
                  className={`w-full  rounded-xl px-3 py-2 text-xs text-white focus:outline-none ${
                    isInternal
                      ? 'bg-amber-950/20  focus:-amber-400'
                      : 'bg-black/40  focus:-[#C5F36A]'
                  }`}
                />

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isInternal}
                      onChange={(e) => setIsInternal(e.target.checked)}
                      className="accent-amber-500 w-4 h-4 rounded"
                    />
                    <span>Post as Internal Staff Note</span>
                  </label>

                  <button
                    type="submit"
                    className={`px-4 py-2 rounded-xl font-bold text-xs transition flex items-center gap-1.5 ${
                      isInternal
                        ? 'bg-amber-500 text-black hover:bg-amber-400'
                        : 'bg-white text-black hover:bg-[#C5F36A]'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    {isInternal ? 'Add Internal Note' : 'Send Customer Reply'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="rounded-3xl  backdrop-blur-2xl p-12 text-center text-neutral-400">
              Select a ticket from the left to view the thread and respond.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

