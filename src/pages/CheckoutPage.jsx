import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle,
  Tag,
  ArrowRight,
  Server,
  AlertCircle
} from 'lucide-react';

export const CheckoutPage = () => {
  const {
    items,
    currency,
    subtotal,
    discountAmount,
    taxableAmount,
    gstAmount,
    gstRate,
    total,
    coupon,
    applyCoupon,
    removeCoupon,
    clearCart
  } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(currency === 'INR' ? 'Cashfree Payments' : 'Stripe Card');
  const [gstin, setGstin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [agreedToPolicy, setAgreedToPolicy] = useState(true);

  const symbol = currency === 'USD' ? '$' : '₹';

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponError('');
    try {
      await applyCoupon(couponCode.trim());
      setCouponCode('');
    } catch (err) {
      setCouponError(err.message || 'Invalid coupon');
    }
  };

  const handleCompleteOrder = async () => {
    if (!user) {
      navigate('/login?redirect=/checkout');
      return;
    }

    if (items.length === 0) {
      setError('Your cart is empty');
      return;
    }

    if (!agreedToPolicy) {
      setError('You must acknowledge and agree to the Terms of Service, No-Refund Policy, and Data Loss Disclaimer to complete checkout.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          items,
          coupon_code: coupon ? coupon.code : null,
          currency,
          payment_method: paymentMethod,
          gstin: gstin.trim() || null
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to complete checkout');
      }

      clearCart();
      setOrderSuccess(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="py-20 relative z-10 max-w-2xl mx-auto px-4 text-center">
        <div className="p-8 sm:p-12 rounded-3xl  backdrop-blur-2xl shadow-2xl text-white space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#C5F36A]/20 flex items-center justify-center text-[#C5F36A] mx-auto animate-bounce">
            <CheckCircle className="w-8 h-8" />
          </div>

          <h1 className="text-3xl font-extrabold text-white">Payment Confirmed!</h1>
          <p className="text-sm text-neutral-300">
            Order <span className="font-mono font-bold text-white">#{orderSuccess.order.order_number}</span> has been processed. Your server instances have been automatically provisioned!
          </p>

          {/* Payment & GST Summary */}
          <div className="p-4 rounded-2xl bg-black/40 text-left space-y-2 text-xs">
            <div className="flex justify-between text-neutral-400">
              <span>Subtotal</span>
              <span className="font-mono text-white">
                {orderSuccess.order.currency === 'USD' ? '$' : '₹'}
                {Number(orderSuccess.order.subtotal || orderSuccess.order.taxable_amount || (orderSuccess.order.total_amount / 1.18)).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>GST (18%)</span>
              <span className="font-mono text-white">
                +{orderSuccess.order.currency === 'USD' ? '$' : '₹'}
                {Number(orderSuccess.order.gst_amount || (orderSuccess.order.total_amount - (orderSuccess.order.total_amount / 1.18))).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-white font-bold pt-2 -t">
              <span>Total Paid</span>
              <span className="font-mono text-[#C5F36A]">
                {orderSuccess.order.currency === 'USD' ? '$' : '₹'}
                {Number(orderSuccess.order.total_amount).toFixed(2)}
              </span>
            </div>
            {orderSuccess.order.gstin && (
              <div className="pt-1 text-[11px] text-neutral-400 -t">
                GSTIN: <span className="font-mono text-white">{orderSuccess.order.gstin}</span>
              </div>
            )}
          </div>

          {/* Provisioned Services Summary */}
          <div className="p-4 rounded-2xl bg-black/40 text-left space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase text-[#C5F36A]">
              Active Provisioned Services ({orderSuccess.services.length})
            </h4>
            {orderSuccess.services.map((srv) => (
              <div key={srv.id} className="p-3 rounded-xl bg-white/5 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-white">{srv.name}</p>
                  <p className="text-neutral-400 font-mono text-[11px]">
                    IP: {srv.ip_address}:{srv.port} • Node: {srv.node}
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400">
                  {srv.status}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => navigate('/client/servers')}
              className="flex-1 py-3.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-[#C5F36A] transition flex items-center justify-center gap-1 shadow-lg"
            >
              View My Services &amp; Details &rarr;
            </button>
            <button
              onClick={() => navigate('/client/billing')}
              className="flex-1 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition"
            >
              View Invoices
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-8">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C5F36A]">
            SECURE CHECKOUT
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mt-1">
            Review &amp; Place Order
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Customer & Payment selection */}
          <div className="lg:col-span-7 space-y-6">
            {/* Account Info */}
            <div className="p-6 rounded-3xl bg-[#0e1611]/5 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.35)] space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs">1</span>
                Customer Account
              </h3>
              {user ? (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-white/[0.04] backdrop-blur-sm flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-white">{user.name}</p>
                      <p className="text-neutral-400">{user.email}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#C5F36A]/20 text-[#C5F36A]">
                      Verified
                    </span>
                  </div>

                  {/* Optional GSTIN Input for Business Invoice */}
                  <div className="p-3.5 rounded-xl bg-black/40 space-y-1.5 backdrop-blur-2xl">
                    <label className="text-[11px] font-semibold text-neutral-300 block">
                      GSTIN / Business Tax ID <span className="text-neutral-500 font-normal">(Optional for GST Invoice &amp; ITC)</span>
                    </label>
                    <input
                      type="text"
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value.toUpperCase())}
                      placeholder="e.g. 07AAAAA0000A1Z5"
                      maxLength={15}
                      className="w-full bg-white/5 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 uppercase font-mono focus:outline-none transition"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-amber-500/10 text-xs text-amber-200 flex items-center justify-between">
                  <span>Please sign in or create an account to activate services.</span>
                  <Link
                    to="/login?redirect=/checkout"
                    className="px-3 py-1.5 rounded-lg bg-white text-black font-bold text-xs hover:bg-[#C5F36A] transition"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>

            {/* Payment Method Selector */}
            <div className="p-6 rounded-3xl bg-[#0e1611]/5 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.35)] space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs">2</span>
                Payment Method
              </h3>

              <div className="space-y-2">
                {[
                  {
                    id: 'Cashfree Payments',
                    title: 'Cashfree Payments (UPI, Cards, Netbanking)',
                    subtitle: 'Instant Auto-Activation via UPI, GPay, PhonePe, Paytm, QR & Cards',
                    recommended: currency === 'INR',
                    badge: 'POPULAR'
                  },
                  {
                    id: 'Razorpay UPI',
                    title: 'Razorpay (India & UPI)',
                    subtitle: 'Google Pay, PhonePe, Paytm, QR & Indian NetBanking',
                    recommended: false
                  },
                  {
                    id: 'Stripe Card',
                    title: 'Stripe (Cards & International)',
                    subtitle: 'Visa, MasterCard, Amex, Apple Pay',
                    recommended: currency === 'USD'
                  }
                ].map((pm) => (
                  <button
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id)}
                    className={`w-full p-4 rounded-2xl  text-left flex items-center justify-between transition-all backdrop-blur-2xl ${
                      paymentMethod === pm.id
                        ? 'bg-white/20 -[#C5F36A] text-white shadow-[0_4px_24px_rgba(197,243,106,0.15)]'
                        : 'bg-black/35  text-neutral-300 hover:bg-white/5'
                    }`}
                  >
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                        {pm.title}
                        {pm.badge && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-[#C5F36A] text-black font-extrabold uppercase">
                            {pm.badge}
                          </span>
                        )}
                        {pm.recommended && !pm.badge && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-[#C5F36A] text-black font-extrabold uppercase">
                            Recommended
                          </span>
                        )}
                      </p>
                      <p className="text-[11px] text-neutral-400 mt-0.5">{pm.subtitle}</p>
                    </div>
                    <CreditCard className="w-5 h-5 text-neutral-400" />
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 text-[11px] text-neutral-400 pt-2">
                <ShieldCheck className="w-4 h-4 text-[#C5F36A]" />
                <span>256-bit Encrypted & Verified Server-Side Webhook Integration</span>
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-3xl bg-[#0e1611]/5 backdrop-blur-2xl shadow-[0_16px_48px_rgba(0,0,0,0.45)] space-y-6 sticky top-24">
              <h3 className="text-base font-bold text-white">Order Summary</h3>

              {/* Items List */}
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {items.length === 0 ? (
                  <p className="text-xs text-neutral-400">Cart is empty.</p>
                ) : (
                  items.map((item) => {
                    const price = currency === 'USD' ? item.price_usd : item.price_inr;
                    return (
                      <div
                        key={item.key}
                        className="p-3 rounded-xl bg-white/5 flex items-center justify-between text-xs gap-3"
                      >
                        <div className="flex items-center gap-3">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.plan_name}
                              className="w-10 h-10 rounded-lg object-cover object-top shrink-0 shadow"
                            />
                          )}
                          <div>
                            <p className="font-bold text-white">{item.plan_name}</p>
                            <p className="text-neutral-400 text-[11px]">
                              {item.game} • {item.ram} • {item.software}
                            </p>
                          </div>
                        </div>
                        <span className="font-mono font-bold text-white shrink-0">
                          {symbol}{(price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Coupon Form */}
              {coupon ? (
                <div className="p-3 rounded-xl bg-[#C5F36A]/10 flex items-center justify-between text-xs">
                  <span className="text-[#C5F36A] font-bold">
                    Coupon: {coupon.code} (-{coupon.discount_percent}%)
                  </span>
                  <button onClick={removeCoupon} className="text-neutral-400 hover:text-white underline text-[11px]">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Coupon code (e.g. ZEROXCLOUD)"
                    className="flex-1 bg-black/40 rounded-xl px-3 py-2 text-xs text-white uppercase placeholder-neutral-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && <p className="text-[11px] text-red-400">{couponError}</p>}

              {/* Breakdown with GST */}
              <div className="space-y-2 text-xs text-neutral-400 -t pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-white">{symbol}{subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#C5F36A]">
                    <span>Discount ({coupon?.code})</span>
                    <span className="font-mono">-{symbol}{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Setup Fees</span>
                  <span className="text-emerald-400 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-neutral-300">
                  <span className="flex items-center gap-1.5">
                    <span>GST (18%)</span>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      {currency === 'INR' ? '(CGST 9% + SGST 9%)' : '(18% Tax)'}
                    </span>
                  </span>
                  <span className="font-mono text-white">+{symbol}{gstAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white -t pt-3">
                  <div>
                    <span>Total Due</span>
                    <span className="block text-[10px] font-normal text-neutral-400 font-sans">
                      Includes 18% GST ({symbol}{gstAmount.toFixed(2)})
                    </span>
                  </div>
                  <span className="text-[#C5F36A] font-mono text-lg">{symbol}{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Mandatory Policy Agreement & Disclaimers */}
              <div className="p-3.5 rounded-xl bg-black/40 space-y-2 text-[11px] text-neutral-300">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreedToPolicy}
                    onChange={(e) => setAgreedToPolicy(e.target.checked)}
                    className="mt-0.5 rounded bg-black/60 text-[#C5F36A] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="leading-snug">
                    I agree to the <Link to="/terms" target="_blank" className="text-white underline hover:text-[#C5F36A]">Terms of Service</Link>, <Link to="/refund" target="_blank" className="text-white underline hover:text-[#C5F36A]">Refund Policy</Link>, and <Link to="/rules" target="_blank" className="text-white underline hover:text-[#C5F36A]">Server Rules</Link>.
                  </span>
                </label>
                <div className="text-[10px] text-neutral-400 pl-6 leading-relaxed">
                  <strong className="text-white">Notice:</strong> All sales are final. No refunds once bought (a refund is only provided in case ZEROX CLOUD fails to provision the service). ZEROX CLOUD is strictly not responsible for data loss; customers must maintain their own offsite backups.
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                onClick={handleCompleteOrder}
                disabled={loading || items.length === 0 || !agreedToPolicy}
                className="w-full py-4 rounded-xl bg-white text-black font-extrabold text-sm hover:bg-[#C5F36A] transition-all flex items-center justify-center gap-2 shadow-xl active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? 'Processing & Provisioning...' : `Pay & Deploy Server (${symbol}${total.toFixed(2)})`}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

