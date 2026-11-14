import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { X, Trash2, Plus, Minus, ArrowRight, Tag, ShoppingCart } from 'lucide-react';

export const CartDrawer = () => {
  const {
    items,
    currency,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    discountAmount,
    total,
    coupon,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    try {
      await applyCoupon(couponInput.trim());
      setCouponInput('');
    } catch (err) {
      setCouponError(err.message || 'Invalid coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const symbol = currency === 'USD' ? '$' : '₹';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#121814] border-l border-white/10 shadow-2xl flex flex-col text-white">
          {/* Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingCart className="w-5 h-5 text-[#C5F36A]" />
              <h3 className="text-lg font-bold">Your Order Cart</h3>
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs font-semibold">
                {items.length}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-neutral-400 hover:text-white p-1 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400">
                <ShoppingCart className="w-12 h-12 stroke-[1.2] text-neutral-600 mb-3" />
                <p className="text-base font-semibold text-white">Your cart is empty</p>
                <p className="text-xs text-neutral-400 mt-1 max-w-xs">
                  Browse our game hosting and cloud infrastructure catalog to configure your server.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/games');
                  }}
                  className="mt-5 px-5 py-2.5 rounded-xl bg-white text-black text-xs font-bold hover:bg-[#C5F36A] transition"
                >
                  Explore Game Servers
                </button>
              </div>
            ) : (
              items.map((item) => {
                const itemPrice = currency === 'USD' ? item.price_usd : item.price_inr;
                return (
                  <div
                    key={item.key}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-2 relative group"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#C5F36A]">
                          {item.game || item.category}
                        </span>
                        <h4 className="text-sm font-bold text-white leading-tight">
                          {item.plan_name}
                        </h4>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          {item.ram} • {item.cpu} • {item.software}
                        </p>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          📍 {item.location}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.key)}
                        className="text-neutral-500 hover:text-red-400 p-1 transition"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-1">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-black/40 px-2 py-1 rounded-lg border border-white/10">
                        <button
                          onClick={() => updateQuantity(item.key, -1)}
                          className="text-neutral-400 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-mono font-bold w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.key, 1)}
                          className="text-neutral-400 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-bold text-white font-mono">
                          {symbol}{(itemPrice * item.quantity).toFixed(2)}
                        </span>
                        <span className="text-[10px] text-neutral-400 block">/month</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Breakdown */}
          {items.length > 0 && (
            <div className="p-5 bg-[#151c17] border-t border-white/10 space-y-4">
              {/* Coupon Form */}
              {coupon ? (
                <div className="flex items-center justify-between p-2.5 px-3 rounded-xl bg-[#C5F36A]/10 border border-[#C5F36A]/30 text-xs">
                  <div className="flex items-center gap-2 text-[#C5F36A] font-medium">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Coupon {coupon.code} (-{coupon.discount_percent}%)</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-neutral-400 hover:text-white underline text-[11px]"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Coupon code (e.g. ZEROXCLOUD)"
                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white uppercase placeholder-neutral-500 focus:outline-none focus:border-[#C5F36A]"
                  />
                  <button
                    type="submit"
                    disabled={couponLoading}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition disabled:opacity-50"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && (
                <p className="text-[11px] text-red-400">{couponError}</p>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-neutral-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-white">
                    {symbol}{subtotal.toFixed(2)}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#C5F36A]">
                    <span>Discount ({coupon.code})</span>
                    <span className="font-mono">
                      -{symbol}{discountAmount.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/10">
                  <span>Total Due Today</span>
                  <span className="font-mono text-[#C5F36A]">
                    {symbol}{total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full py-3 rounded-xl bg-white text-black font-bold text-sm hover:bg-[#C5F36A] transition-all duration-200 flex items-center justify-center gap-2 shadow-lg active:scale-[0.99]"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

