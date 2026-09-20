import React, { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Star, ShoppingBag, Eye, Bell, Check, Sparkles, Flame, ShieldAlert } from "lucide-react";
import { shopDataContext } from "../context/ShopContext";
import { userDataContext } from "../context/UserContext";

export default function Card({ product }) {
  const navigate = useNavigate();
  const location = useLocation();

  const { currency = "₹", addToCart, setIsCartDrawerOpen } = useContext(shopDataContext) || {};
  const { userData } = useContext(userDataContext) || {};

  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [loginAlert, setLoginAlert] = useState(false);
  const [notified, setNotified] = useState(false);

  const isUpcoming = Boolean(product.isUpcoming);
  const rating = product.rating || 4.9;
  const reviewCount = product.reviewCount || 38;
  const sizes = product.sizes && product.sizes.length ? product.sizes : ["S", "M", "L", "XL", "XXL"];

  const handleCardClick = () => {
    if (isUpcoming) {
      handleNotifyClick();
      return;
    }
    navigate(`/product/${product._id}`);
  };

  const handleQuickAdd = async (e, size) => {
    e.stopPropagation();

    // Check auth first! (Fixes issue #9 from furever problems)
    if (!userData) {
      setLoginAlert(true);
      setTimeout(() => {
        setLoginAlert(false);
        navigate("/login", { state: { from: location.pathname } });
      }, 1200);
      return;
    }

    try {
      setIsAdding(true);
      setSelectedSize(size);
      const success = await addToCart(product._id, size, 1);
      if (success) {
        if (typeof setIsCartDrawerOpen === "function") {
          setIsCartDrawerOpen(true);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAdding(false);
      setShowQuickAdd(false);
    }
  };

  const handleNotifyClick = (e) => {
    if (e) e.stopPropagation();
    setNotified(true);
    setTimeout(() => setNotified(false), 3000);
  };

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowQuickAdd(false);
      }}
      className="group relative flex flex-col w-full bg-white rounded-3xl border border-neutral-200/80 hover:border-neutral-900 transition-all duration-300 hover:shadow-2xl overflow-hidden cursor-pointer"
    >
      {/* ================= IMAGE STAGE ================= */}
      <div className="relative w-full aspect-[4/5] bg-[#F2ECE4] overflow-hidden">
        
        {/* Primary Image */}
        <img
          src={product.image1}
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-700 ease-out ${
            isHovered && product.image2 ? "opacity-0 scale-105" : "opacity-100 scale-100"
          }`}
          loading="lazy"
        />

        {/* Secondary Image on Hover */}
        {product.image2 && (
          <img
            src={product.image2}
            alt={`${product.name} alternate view`}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
              isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"
            }`}
            loading="lazy"
          />
        )}

        {/* Streetwear Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
          {product.bestseller && (
            <span className="badge-streetwear bg-[#0D0D11]/90 text-white border border-white/10 shadow-sm flex items-center gap-1">
              <Flame size={11} className="text-[#FF462D]" fill="currentColor" />
              Bestseller
            </span>
          )}

          {isUpcoming ? (
            <span className="badge-streetwear bg-[#FF462D] text-white shadow-md">
              {product.dropBadge || "DROP 02 • SOON"}
            </span>
          ) : (
            <span className="badge-streetwear bg-white/95 text-neutral-900 border border-neutral-200/80 shadow-sm">
              240 GSM • Oversized
            </span>
          )}
        </div>

        {/* Quick View / Notification Trigger */}
        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md shadow-md flex items-center justify-center text-neutral-800 hover:text-[#FF462D] transition-colors">
            <Eye size={15} />
          </div>
        </div>

        {/* Quick Add Size Bar (Slide Up on Hover) */}
        {!isUpcoming && (
          <div
            className={`absolute inset-x-3 bottom-3 z-20 transition-all duration-300 ${
              isHovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
            }`}
          >
            {showQuickAdd ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#121217]/95 backdrop-blur-xl border border-white/20 p-2.5 rounded-2xl shadow-xl flex flex-col gap-1.5 text-white"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between text-[11px] font-bold text-neutral-300 px-1">
                  <span>SELECT SIZE:</span>
                  <button
                    onClick={() => setShowQuickAdd(false)}
                    className="text-neutral-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex gap-1.5">
                  {sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={(e) => handleQuickAdd(e, sz)}
                      className="flex-1 py-1.5 rounded-lg bg-white/10 hover:bg-[#FF462D] text-white text-xs font-black transition-colors"
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowQuickAdd(true);
                }}
                className="w-full py-3 rounded-2xl bg-[#0D0D11]/90 hover:bg-[#FF462D] text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ShoppingBag size={14} />
                <span>+ Quick Add</span>
              </button>
            )}
          </div>
        )}

        {/* Teaser Drop Action Bar */}
        {isUpcoming && (
          <div
            className={`absolute inset-x-3 bottom-3 z-20 transition-all duration-300 ${
              isHovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
            }`}
          >
            <button
              onClick={handleNotifyClick}
              className={`w-full py-3 rounded-2xl text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-xl flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                notified
                  ? "bg-[#00E599] text-black font-extrabold"
                  : "bg-[#0D0D11]/90 hover:bg-[#FF462D] text-white"
              }`}
            >
              {notified ? (
                <>
                  <Check size={14} />
                  <span>On The VIP List!</span>
                </>
              ) : (
                <>
                  <Bell size={14} />
                  <span>Notify When Live</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Login Prompt Overlay (for issue #9) */}
        <AnimatePresence>
          {loginAlert && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-4 z-30 bg-black/90 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center justify-center text-center text-white"
            >
              <ShieldAlert size={26} className="text-[#FF462D] mb-2" />
              <p className="font-heading font-bold text-sm">Please Sign In First</p>
              <p className="text-[11px] text-neutral-400 mt-1">
                Redirecting to account login...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ================= CONTENT STAGE ================= */}
      <div className="p-5 flex flex-col justify-between flex-1 bg-white">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between gap-2 mb-1.5 text-xs text-neutral-500">
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              {product.category || "Unisex"} • {product.subCategory || "Oversized"}
            </span>

            <div className="flex items-center gap-1 font-bold text-neutral-800 text-xs">
              <Star size={12} className="text-[#FF462D] fill-[#FF462D]" />
              <span>{rating.toFixed(1)}</span>
              <span className="text-neutral-400 font-normal">({reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-heading text-base sm:text-lg font-bold text-neutral-900 line-clamp-1 group-hover:text-[#FF462D] transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Price & Status */}
        <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-lg sm:text-xl font-extrabold text-neutral-900">
              {currency}{product.price}
            </span>
            <span className="text-xs text-neutral-400 line-through">
              {currency}{Math.round(product.price * 1.35)}
            </span>
          </div>

          {isUpcoming ? (
            <span className="text-[11px] font-bold text-[#FF462D] uppercase tracking-wider">
              Drop 02 Preview
            </span>
          ) : (
            <span className="text-[11px] font-semibold text-[#00A878] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00A878] animate-pulse" />
              In Stock
            </span>
          )}
        </div>
      </div>
    </div>
  );
}