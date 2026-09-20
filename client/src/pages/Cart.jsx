import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Zap,
  Truck,
  Package,
} from "lucide-react";
import { shopDataContext } from "../context/ShopContext";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

export default function Cart() {
  const navigate = useNavigate();

  const {
    cartItems,
    products = [],
    currency = "₹",
    deliveryFee = 50,
    cartLoading,
    updateQuantity,
    removeFromCart,
    getCartCount,
    getCartAmount,
  } = useContext(shopDataContext) || {};

  const [removingKey, setRemovingKey] = useState(null);

  const cartEntries = Object.entries(cartItems || {}).flatMap(([productId, sizes]) => {
    const product = products.find((item) => item._id === productId);
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

  const subtotal = typeof getCartAmount === "function" ? getCartAmount() : 0;
  const cartCount = typeof getCartCount === "function" ? getCartCount() : 0;
  const freeShippingThreshold = 999;
  const isFreeDelivery = subtotal >= freeShippingThreshold;
  const finalDeliveryFee = subtotal > 0 && !isFreeDelivery ? deliveryFee : 0;
  const total = subtotal + finalDeliveryFee;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressToFreeShipping = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-between">
        <Nav />
        <div className="py-24 text-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#FF462D] border-t-transparent animate-spin mx-auto mb-4" />
          <p className="font-heading text-xs uppercase tracking-widest text-neutral-400 font-bold">
            Loading Your Bag...
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#121217] flex flex-col justify-between">
      <Nav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex-1 w-full">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-neutral-200">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FF462D] mb-1">
              <ShoppingBag size={14} />
              <span>Checkout Review</span>
            </div>
            <h1 className="font-heading font-black text-3xl sm:text-4xl uppercase tracking-tight text-neutral-950">
              YOUR SHOPPING BAG <span className="text-neutral-400 font-normal">({cartCount})</span>
            </h1>
          </div>

          <Link
            to="/collections"
            className="hidden sm:flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-neutral-950 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Continue Browsing</span>
          </Link>
        </div>

        {cartEntries.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-neutral-200 p-8 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4 text-neutral-400">
              <Package size={28} />
            </div>
            <h2 className="font-heading font-black text-2xl uppercase text-neutral-900 mb-2">
              Your Bag is Empty
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mb-6">
              Our limited batch Genesis Drop pieces are going fast. Explore the archive and claim your fit.
            </p>
            <button
              onClick={() => navigate("/collections")}
              className="px-8 py-4 rounded-full bg-[#0D0D11] hover:bg-[#FF462D] text-white font-heading text-xs font-bold uppercase tracking-widest transition-all shadow-lg cursor-pointer"
            >
              Shop Drop 01
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* LEFT: CART ITEMS */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Free Shipping Meter */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-sm">
                <div className="flex items-center justify-between text-xs font-bold mb-2">
                  <span className="flex items-center gap-1.5 text-neutral-800">
                    <Zap size={14} className="text-[#FF462D]" />
                    {isFreeDelivery ? (
                      <span className="text-[#00A878]">Congratulations! You unlocked FREE Express Delivery</span>
                    ) : (
                      <span>
                        Add <strong className="text-[#FF462D]">{currency}{amountToFreeShipping}</strong> more for FREE Shipping
                      </span>
                    )}
                  </span>
                  <span className="text-neutral-400">{progressToFreeShipping}%</span>
                </div>
                <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isFreeDelivery ? "bg-[#00A878]" : "bg-[#FF462D]"
                    }`}
                    style={{ width: `${progressToFreeShipping}%` }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {cartEntries.map(({ productId, size, quantity, product }) => (
                  <div
                    key={`${productId}-${size}`}
                    className="p-4 sm:p-5 rounded-3xl bg-white border border-neutral-200/80 shadow-sm flex gap-4 sm:gap-6 items-center"
                  >
                    <img
                      src={product.image1}
                      alt={product.name}
                      className="w-20 h-24 sm:w-24 sm:h-28 rounded-2xl object-cover bg-neutral-100 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF462D]">
                            {product.category} • 240 GSM
                          </span>
                          <h3 className="font-heading font-bold text-base sm:text-lg text-neutral-900 truncate">
                            {product.name}
                          </h3>
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-neutral-100 text-[11px] font-extrabold text-neutral-700 uppercase mt-1">
                            SIZE: {size}
                          </span>
                        </div>

                        <button
                          onClick={() => removeFromCart(productId, size)}
                          className="p-2 text-neutral-400 hover:text-[#FF462D] transition-colors"
                          title="Remove piece"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-neutral-100">
                        {/* Quantity Incrementer */}
                        <div className="flex items-center border border-neutral-200 rounded-full bg-neutral-50 overflow-hidden">
                          <button
                            onClick={() => updateQuantity(productId, size, quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:bg-neutral-200 transition-colors"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-neutral-900">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(productId, size, quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:bg-neutral-200 transition-colors"
                          >
                            <Plus size={11} />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <span className="font-heading font-extrabold text-base sm:text-lg text-neutral-950">
                            {currency}{product.price * quantity}
                          </span>
                          {quantity > 1 && (
                            <span className="block text-[11px] text-neutral-400">
                              ({currency}{product.price} each)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: ORDER SUMMARY */}
            <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-md sticky top-28 space-y-6">
              <h2 className="font-heading font-black text-lg uppercase tracking-tight text-neutral-950 pb-4 border-b border-neutral-100">
                Order Summary
              </h2>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between text-neutral-500">
                  <span>Subtotal ({cartCount} {cartCount === 1 ? "piece" : "pieces"})</span>
                  <span className="font-bold text-neutral-900">{currency}{subtotal}</span>
                </div>

                <div className="flex justify-between text-neutral-500">
                  <span>Shipping & Handling</span>
                  <span>
                    {isFreeDelivery ? (
                      <strong className="text-[#00A878] uppercase">FREE</strong>
                    ) : (
                      `${currency}${deliveryFee}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-neutral-500">
                  <span>Animal Welfare Contribution</span>
                  <strong className="text-[#FF462D]">10% Included</strong>
                </div>

                <div className="pt-4 border-t border-neutral-200 flex justify-between items-baseline">
                  <span className="font-heading font-bold text-base text-neutral-900">Total</span>
                  <span className="font-heading font-black text-2xl text-[#FF462D]">
                    {currency}{total}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate("/placeorder")}
                className="w-full py-4 rounded-full bg-[#0D0D11] hover:bg-[#FF462D] active:scale-[0.99] text-white font-heading text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={15} />
              </button>

              <div className="space-y-2 pt-2 text-[11px] text-neutral-500">
                <div className="flex items-center gap-2">
                  <Truck size={14} className="text-[#FF462D]" />
                  <span>Ships in 24 hours with live SMS tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-[#00A878]" />
                  <span>Razorpay 256-bit encrypted checkout & COD</span>
                </div>
              </div>
            </div>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}