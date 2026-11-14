import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('zx_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('zx_currency') || 'INR';
  });

  const [coupon, setCoupon] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('zx_cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('zx_currency', currency);
  }, [currency]);

  const addToCart = (productPlan, config = {}) => {
    setItems((prev) => {
      const itemKey = `${productPlan.id}-${config.location || 'default'}-${config.software || 'default'}`;
      const existing = prev.find((item) => item.key === itemKey);

      if (existing) {
        return prev.map((item) =>
          item.key === itemKey ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [
        ...prev,
        {
          key: itemKey,
          plan_id: productPlan.id,
          plan_name: productPlan.name,
          category: productPlan.category,
          game: config.game || productPlan.game_slug || 'Game Server',
          software: config.software || config.instance_type || 'Paper',
          location: config.location || productPlan.location || 'India (Noida & Mumbai)',
          price_inr: productPlan.price_inr,
          price_usd: productPlan.price_usd,
          ram: productPlan.ram,
          cpu: productPlan.cpu,
          storage: productPlan.storage,
          quantity: 1
        }
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (key) => {
    setItems((prev) => prev.filter((item) => item.key !== key));
  };

  const updateQuantity = (key, delta) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.key === key) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
  };

  const applyCoupon = async (code) => {
    try {
      const res = await fetch('/api/products/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid coupon');
      }
      setCoupon(data);
      return data;
    } catch (err) {
      throw err;
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => {
    const unitPrice = currency === 'USD' ? item.price_usd : item.price_inr;
    return sum + unitPrice * item.quantity;
  }, 0);

  const discountAmount = coupon ? (subtotal * coupon.discount_percent) / 100 : 0;
  const total = Math.max(0, subtotal - discountAmount);
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        currency,
        setCurrency,
        coupon,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        subtotal,
        discountAmount,
        total,
        totalCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

