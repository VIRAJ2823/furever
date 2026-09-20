import React, { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Sparkles, Heart } from "lucide-react";
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
  } = useContext(shopDataContext) || {};

  const cartCount = typeof getCartCount === "function" ? getCartCount() : 0;
  const subtotal = typeof getCartAmount === "function" ? getCartAmount() : 0;
  const freeShippingThreshold = 999;
  const progressToFreeShipping = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const ngoContribution = Math.round(subtotal * 0.10);

  // Flatten cart items
  const cartEntries = Object.entries(cartItems || {}).flatMap(([productId, sizes]) => {
    const product = products?.find((p) => p._id === productId || p.id === productId);
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
            className="absolute inset-0 bg-[#2B2730]/60 backdrop-blur-xs cursor-pointer"
          />

          {/* Drawer Sheet */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative w-full max-w-md bg-[#FAF6F2] text-[#2B2730] h-full shadow-2xl flex flex-col z-10 border-l border-[#EDE4DD]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#EDE4DD] bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#58545F] flex items-center justify-center text-white font-bold text-sm shadow-xs">
                  🐾
                </div>
                <div>
                  <h2 className="font-display text-lg font-black uppercase tracking-tight text-[#2B2730]">
                    Your Street Bag
                  </h2>
                  <p className="text-[11px] text-[#58545F] font-semibold">
                    {cartCount} {cartCount === 1 ? "tee" : "tees"} in bag • 10% to Animal NGOs
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsCartDrawerOpen(false)}
                className="w-9 h-9 rounded-full bg-[#FAF6F2] hover:bg-[#EDE4DD] text-[#58545F] hover:text-[#2B2730] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close cart drawer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Free Shipping & Mission Bar */}
            <div className="px-6 py-3.5 bg-white border-b border-[#EDE4DD]">
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span className="flex items-center gap-1.5 text-[#2B2730]">
                  <Sparkles size={14} className="text-[#DC8E90]" />
                  {subtotal >= freeShippingThreshold ? (
                    <span className="font-black text-emerald-700 uppercase tracking-wider text-[11px]">
                      🎉 You unlocked FREE Prepaid Express Shipping!
                    </span>
                  ) : (
                    <span className="text-[11px] text-[#58545F]">
                      Add <strong className="text-[#2B2730]">{currency}{amountToFreeShipping}</strong> more for FREE Shipping
                    </span>
                  )}
                </span>
                <span className="text-[#7E7785] text-[11px] font-black">{progressToFreeShipping}%</span>
              </div>
              <div className="w-full h-2 bg-[#FAF6F2] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToFreeShipping}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`h-full rounded-full ${
                    subtotal >= freeShippingThreshold ? "bg-emerald-700" : "bg-[#DC8E90]"
                  }`}
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3.5">
              {cartEntries.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4">
                  <div className="w-20 h-20 rounded-3xl bg-white border border-[#EDE4DD] flex items-center justify-center mb-4 text-[#DC8E90] shadow-sm">
                    <ShoppingBag size={32} />
                  </div>
                  <h3 className="font-display font-black text-base uppercase tracking-tight text-[#2B2730] mb-1.5">
                    Your street bag is empty
                  </h3>
                  <p className="text-xs text-[#58545F] max-w-xs mb-6 font-medium">
                    Cop our 240 GSM heavyweight oversized graphic tees or customize your pet line art memory tee.
                  </p>
                  <button
                    onClick={() => {
                      setIsCartDrawerOpen(false);
                      navigate("/collections");
                    }}
                    className="px-6 py-3 rounded-full bg-[#58545F] hover:bg-[#DC8E90] text-white text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer"
                  >
                    Explore Drop 001 🐾
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
                    className="flex gap-4 p-3.5 rounded-2xl bg-white border border-[#EDE4DD] hover:border-[#DC8E90] transition-all shadow-2xs"
                  >
                    {/* Thumbnail (Authentic PDF Art) */}
                    <img
                      src={product.images?.black || product.image1 || product.image?.[0]}
                      alt={product.name}
                      className="w-20 h-24 rounded-xl object-contain p-1 bg-[#F8F3EE] shrink-0 border border-[#EDE4DD]"
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-black uppercase tracking-tight text-[#2B2730] truncate">
                            {product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(productId, size)}
                            className="text-[#7E7785] hover:text-rose-600 transition-colors p-1 cursor-pointer"
                            title="Remove tee"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded-md bg-[#58545F] text-[10px] font-black uppercase tracking-wider text-white">
                            SIZE: {size}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-[#DC8E90]/15 text-[10px] font-black uppercase tracking-wider text-[#A97882]">
                            240 GSM
                          </span>
                          <span className="text-xs font-bold text-[#58545F]">
                            {currency}{product.price}
                          </span>
                        </div>
                      </div>

                      {/* Quantity & Price */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="inline-flex items-center border border-[#EDE4DD] rounded-full bg-[#FAF6F2]">
                          <button
                            onClick={() => updateQuantity(productId, size, quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-[#58545F] hover:text-[#2B2730] hover:bg-[#EDE4DD] rounded-full transition-colors cursor-pointer"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-7 text-center text-xs font-black text-[#2B2730]">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(productId, size, quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-[#58545F] hover:text-[#2B2730] hover:bg-[#EDE4DD] rounded-full transition-colors cursor-pointer"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <span className="font-display font-black text-sm text-[#2B2730]">
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
              <div className="p-6 border-t border-[#EDE4DD] bg-white space-y-4">
                
                {/* 10% Social Mission Net Profit Highlight */}
                <div className="p-3 rounded-2xl bg-[#DC8E90]/15 border border-[#DC8E90]/30 flex items-center gap-2.5">
                  <Heart size={16} className="text-[#DC8E90] shrink-0 fill-[#DC8E90]" />
                  <span className="text-[11px] font-bold text-[#2B2730] leading-tight">
                    🐾 Your order donates <strong className="text-[#A97882]">₹{ngoContribution}</strong> directly to local animal rescue and sterilization programs!
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-[#58545F] font-medium">
                    <span>Subtotal</span>
                    <span className="font-black text-[#2B2730]">
                      {currency}{subtotal}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#58545F] font-medium">
                    <span>Express Shipping</span>
                    <span>
                      {subtotal >= freeShippingThreshold ? (
                        <span className="text-emerald-700 font-black">FREE</span>
                      ) : (
                        `${currency}${deliveryFee}`
                      )}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-[#EDE4DD] flex justify-between items-baseline">
                    <span className="font-display text-sm font-black uppercase tracking-wider text-[#2B2730]">Total Amount</span>
                    <span className="font-display text-2xl font-black text-[#2B2730]">
                      {currency}{subtotal + (subtotal >= freeShippingThreshold ? 0 : deliveryFee)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <button
                    onClick={handleCheckout}
                    className="w-full py-4 rounded-full bg-[#58545F] hover:bg-[#2B2730] text-white font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight size={16} />
                  </button>

                  <button
                    onClick={handleViewCart}
                    className="w-full py-2.5 rounded-full bg-[#FAF6F2] hover:bg-[#EDE4DD] border border-[#EDE4DD] text-[#2B2730] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    View Bag Details ({cartCount})
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 text-[10px] text-[#7E7785] font-semibold pt-1">
                  <ShieldCheck size={14} className="text-[#DC8E90]" />
                  <span>240 GSM Heavyweight Cotton • 7-Day Size Swaps • 10% NGO Grant</span>
                </div>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
