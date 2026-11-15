import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CreditCard, Calendar, Download, FileText, CheckCircle } from 'lucide-react';

export const ClientBilling = () => {
  const { token } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invRes, srvRes] = await Promise.all([
          fetch('/api/billing/invoices', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/services', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        const invData = await invRes.json();
        const srvData = await srvRes.json();
        setInvoices(invData.invoices || []);
        setServices(srvData.services || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
  }, [token]);

  const nextRenewal = services.length > 0 && services[0].renewal_date
    ? new Date(services[0].renewal_date).toLocaleDateString()
    : 'None scheduled';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
          BILLING
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white mt-0.5">
          Payments &amp; invoices
        </h1>
      </div>

      {/* Next renewal card matching video frame 045 */}
      <div className="p-6 rounded-3xl  backdrop-blur-2xl flex items-center gap-4 shadow-xl">
        <div className="p-3 rounded-2xl bg-white/5 text-[#C5F36A]">
          <Calendar className="w-6 h-6" />
        </div>
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400 block">
            NEXT RENEWAL
          </span>
          <span className="text-xl sm:text-2xl font-extrabold text-white">
            {nextRenewal}
          </span>
        </div>
      </div>

      {/* Recent transactions card & table matching video frame 045 */}
      <div className="rounded-3xl  backdrop-blur-2xl overflow-hidden shadow-xl">
        <div className="p-5 -b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#C5F36A]" />
            <h3 className="text-sm font-bold text-white">Recent transactions</h3>
          </div>
          <span className="text-xs text-neutral-400">{invoices.length} records</span>
        </div>

        {invoices.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center p-8 space-y-2 text-neutral-400">
            <CreditCard className="w-8 h-8 text-neutral-600 mb-2" />
            <p className="text-sm font-semibold text-white">No transactions yet</p>
            <p className="text-xs text-neutral-500">Your future payment receipts and invoices will show up here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-black/30 -b text-neutral-400 font-mono text-[10px] uppercase">
                <tr>
                  <th className="p-4 pl-6">DATE</th>
                  <th className="p-4">INVOICE</th>
                  <th className="p-4">DESCRIPTION</th>
                  <th className="p-4">AMOUNT</th>
                  <th className="p-4">STATUS</th>
                  <th className="p-4 pr-6 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-neutral-300">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-white/5 transition">
                    <td className="p-4 pl-6 font-mono text-[11px]">
                      {new Date(inv.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 font-mono font-bold text-white">
                      {inv.invoice_number}
                    </td>
                    <td className="p-4">
                      {inv.items && inv.items[0] ? inv.items[0].description : 'Hosting Services'}
                    </td>
                    <td className="p-4 font-mono font-bold text-white">
                      {inv.currency === 'USD' ? '$' : '₹'}{Number(inv.total).toFixed(2)}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400">
                        <CheckCircle className="w-3 h-3" />
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={() => alert(`Downloading Invoice PDF: ${inv.invoice_number}`)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white transition font-medium"
                      >
                        <Download className="w-3.5 h-3.5 text-[#C5F36A]" />
                        PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

