import React, { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { shopDataContext } from "../context/ShopContext";

export default function CartDrawer() {
  const navigate = useNavigate();
  const {
    cartItems,
    products,
    currency = "₹",
    deliveryFee = 50,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateQuantity,
    removeFromCart,
    getCartCount,
    getCartAmount,
  } = useContext(shopDataContext);

  const cartCount = typeof getCartCount === "function" ? getCartCount() : 0;
  const subtotal = typeof getCartAmount === "function" ? getCartAmount() : 0;
  const freeShippingThreshold = 999;
  const progressToFreeShipping = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  // Flatten cart items
  const cartEntries = Object.entries(cartItems || {}).flatMap(([productId, sizes]) => {
    const product = products?.find((p) => p._id === productId);
    if (!product || !sizes) return [];
    return Object.entries(sizes).map(([size, quantity]) => {
      if (Number(quantity) <= 0) return null;
      return {
        productId,
        size,
        quantity: Number(quantity),
        product,
      };
    }).filter(Boolean);
  });

  const handleCheckout = () => {
    setIsCartDrawerOpen(false);
    navigate("/placeorder");
  };

  const handleViewCart = () => {
    setIsCartDrawerOpen(false);
    navigate("/cart");
  };

  return (
    <AnimatePresence>
      {isCartDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setIsCartDrawerOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Drawer Sheet */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="relative w-full max-w-md bg-[#101014] text-white h-full shadow-2xl flex flex-col z-10 border-l border-white/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-[#15151A]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#FF462D]/15 flex items-center justify-center text-[#FF462D]">
                  <ShoppingBag size={18} />
                </div>
                <div>
                  <h2 className="font-heading text-lg font-bold tracking-tight uppercase">
                    Your Cart
                  </h2>
                  <p className="text-xs text-neutral-400 font-medium">
                    {cartCount} {cartCount === 1 ? "Drop" : "Drops"} reserved
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsCartDrawerOpen(false)}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close cart drawer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Free Shipping Meter */}
            <div className="px-6 py-3.5 bg-[#191920] border-b border-white/5">
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className="flex items-center gap-1.5 text-neutral-300">
                  <Zap size={14} className="text-[#FF462D]" />
                  {subtotal >= freeShippingThreshold ? (
                    <span className="text-[#00E599] font-bold">You've unlocked FREE Shipping!</span>
                  ) : (
                    <span>
                      Add <strong className="text-white">{currency}{amountToFreeShipping}</strong> for FREE delivery
                    </span>
                  )}
                </span>
                <span className="text-neutral-400">{progressToFreeShipping}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToFreeShipping}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`h-full rounded-full ${
                    subtotal >= freeShippingThreshold ? "bg-[#00E599]" : "bg-[#FF462D]"
                  }`}
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {cartEntries.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4 text-neutral-500">
                    <ShoppingBag size={32} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-white mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-sm text-neutral-400 max-w-xs mb-6">
                    Genesis Drop 01 pieces are selling fast. Grab yours before the batch sells out.
                  </p>
                  <button
                    onClick={() => {
                      setIsCartDrawerOpen(false);
                      navigate("/collections");
                    }}
                    className="px-6 py-3 rounded-full bg-[#FF462D] hover:bg-[#E03B24] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-[#FF462D]/20 cursor-pointer"
                  >
                    Explore Drop 01
                  </button>
                </div>
              ) : (
                cartEntries.map(({ productId, size, quantity, product }) => (
                  <motion.div
                    key={`${productId}-${size}`}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex gap-4 p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors"
                  >
                    {/* Thumbnail */}
                    <img
                      src={product.image1}
                      alt={product.name}
                      className="w-20 h-20 rounded-xl object-cover bg-neutral-900 shrink-0"
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-semibold text-white truncate">
                            {product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(productId, size)}
                            className="text-neutral-500 hover:text-[#FF462D] transition-colors p-1"
                            title="Remove item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="inline-flex items-center gap-2 mt-1">
                          <span className="px-2 py-0.5 rounded bg-white/10 text-[11px] font-bold text-neutral-300">
                            SIZE: {size}
                          </span>
                          <span className="text-xs text-neutral-500">
                            {currency}{product.price}
                          </span>
                        </div>
                      </div>

                      {/* Quantity & Price */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="inline-flex items-center border border-white/15 rounded-full bg-white/5">
                          <button
                            onClick={() => updateQuantity(productId, size, quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-neutral-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="w-7 text-center text-xs font-bold text-white">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(productId, size, quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-neutral-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                          >
                            <Plus size={11} />
                          </button>
                        </div>

                        <span className="font-heading font-bold text-sm text-white">
                          {currency}{product.price * quantity}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Drawer Footer */}
            {cartEntries.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-[#15151A] space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-neutral-400">
                    <span>Subtotal</span>
                    <span className="font-semibold text-white">
                      {currency}{subtotal}
                    </span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Shipping</span>
                    <span>
                      {subtotal >= freeShippingThreshold ? (
                        <span className="text-[#00E599] font-bold">FREE</span>
                      ) : (
                        `${currency}${deliveryFee}`
                      )}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-white/5 flex justify-between items-baseline">
                    <span className="font-heading text-base font-bold text-white">Total</span>
                    <span className="font-heading text-xl font-extrabold text-[#FF462D]">
                      {currency}{subtotal + (subtotal >= freeShippingThreshold ? 0 : deliveryFee)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <button
                    onClick={handleCheckout}
                    className="w-full py-4 rounded-full bg-[#FF462D] hover:bg-[#E03B24] active:scale-[0.99] text-white font-bold text-sm uppercase tracking-wider transition-all shadow-xl shadow-[#FF462D]/25 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight size={16} />
                  </button>

                  <button
                    onClick={handleViewCart}
                    className="w-full py-3 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-semibold tracking-wide transition-colors cursor-pointer"
                  >
                    View Bag Details ({cartCount})
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-400 pt-1">
                  <ShieldCheck size={14} className="text-[#00E599]" />
                  <span>100% Authenticity Guaranteed • Fast 24h Dispatch</span>
                </div>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
