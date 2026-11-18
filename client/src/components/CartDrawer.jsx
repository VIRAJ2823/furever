import React, { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Heart } from "lucide-react";
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
                <div className="w-10 h-10 rounded-2xl bg-[#2B2730] flex items-center justify-center text-white shadow-xs">
                  <ShoppingBag size={18} />
                </div>
                <div>
                  <h2 className="font-heading text-lg font-black uppercase tracking-tight text-[#2B2730]">
                    Your Bag
                  </h2>
                  <p className="text-[11px] text-[#58545F] font-semibold">
                    {cartCount} {cartCount === 1 ? "item" : "items"} • 10% to Animal Welfare
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

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3.5">
              {cartEntries.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4">
                  <div className="w-20 h-20 rounded-3xl bg-white border border-[#EDE4DD] flex items-center justify-center mb-4 text-[#DC8E90] shadow-sm">
                    <ShoppingBag size={32} />
                  </div>
                  <h3 className="font-heading font-black text-base uppercase tracking-tight text-[#2B2730] mb-1.5">
                    Your bag is empty
                  </h3>
                  <p className="text-xs text-[#58545F] max-w-xs mb-6 font-medium">
                    Explore our original animal graphic silhouettes or create a custom memory tee for your companion.
                  </p>
                  <button
                    onClick={() => {
                      setIsCartDrawerOpen(false);
                      navigate("/originals");
                    }}
                    className="px-6 py-3 rounded-full bg-[#2B2730] hover:bg-[#58545F] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
                  >
                    Explore Originals
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
                    {/* Thumbnail */}
                    <img
                      src={product.images?.black || product.image1 || product.image?.[0]}
                      alt={product.name}
                      className="w-20 h-24 rounded-xl object-contain p-1 bg-[#FAF6F2] shrink-0 border border-[#EDE4DD]"
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-heading font-black text-xs uppercase tracking-tight text-[#2B2730] line-clamp-1">
                            {product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(productId, size)}
                            className="text-[#7E7785] hover:text-rose-600 transition-colors p-1"
                            aria-label="Remove item"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                        <p className="text-[11px] text-[#58545F] font-bold mt-0.5">
                          Size: <span className="text-[#DC8E90]">{size}</span> • {currency}{product.price}
                        </p>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center border border-[#EDE4DD] rounded-lg bg-[#FAF6F2] overflow-hidden">
                          <button
                            onClick={() => updateQuantity(productId, size, quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-[#58545F] hover:bg-[#EDE4DD] transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-xs font-black text-[#2B2730]">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(productId, size, quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-[#58545F] hover:bg-[#EDE4DD] transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <span className="font-heading font-black text-sm text-[#2B2730]">
                          {currency}{product.price * quantity}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {cartEntries.length > 0 && (
              <div className="p-6 bg-white border-t border-[#EDE4DD] space-y-4">
                {/* 10% Contribution Banner */}
                <div className="p-3 rounded-xl bg-[#FAF6F2] border border-[#EDE4DD] flex items-center gap-2.5 text-xs text-[#2B2730]">
                  <Heart size={14} className="text-[#DC8E90] fill-[#DC8E90] shrink-0" />
                  <span className="text-[11px] font-medium">
                    This order contributes <strong>{currency}{ngoContribution}</strong> directly to animal welfare.
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
                    <span>Shipping</span>
                    <span>{currency}{deliveryFee}</span>
                  </div>
                  <div className="pt-2 border-t border-[#EDE4DD] flex justify-between items-baseline">
                    <span className="font-heading text-sm font-black uppercase tracking-wider text-[#2B2730]">Total</span>
                    <span className="font-heading text-2xl font-black text-[#2B2730]">
                      {currency}{subtotal + deliveryFee}
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
                  <span>Heavyweight Cotton • 7-Day Size Exchanges • 10% to Welfare</span>
                </div>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
