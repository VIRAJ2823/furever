import React, { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Star, ShoppingBag, Eye, Check, Sparkles, Flame, ShieldAlert, ArrowRight } from "lucide-react";
import { shopDataContext } from "../context/ShopContext";
import { userDataContext } from "../context/UserContext";

export default function Card({ product }) {
  const navigate = useNavigate();
  const location = useLocation();

  const { currency = "₹", addToCart, setIsCartDrawerOpen } = useContext(shopDataContext) || {};
  const { userData } = useContext(userDataContext) || {};

  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState("black");
  const [selectedSize, setSelectedSize] = useState("");
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [loginAlert, setLoginAlert] = useState(false);

  const isCustom = product.category === "Customs" || product.customizable;
  const rating = product.rating || 4.9;
  const reviewCount = product.reviewCount || 36;
  const sizes = product.sizes && product.sizes.length ? product.sizes : ["S", "M", "L", "XL", "XXL"];

  // Image selection based on active color
  const displayImage =
    selectedColor === "white" && (product.images?.white || product.image2)
      ? product.images?.white || product.image2
      : product.images?.black || product.image1 || product.image?.[0];

  const secondaryImage =
    selectedColor === "black" && (product.images?.white || product.image2)
      ? product.images?.white || product.image2
      : null;

  const handleCardClick = () => {
    navigate(`/product/${product._id || product.id}`);
  };

  const handleQuickAdd = async (e, size) => {
    e.stopPropagation();

    // Check auth guard
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
      const success = await addToCart(product._id || product.id, size, 1);
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

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowQuickAdd(false);
      }}
      className="group relative flex flex-col w-full bg-white rounded-3xl border border-[#EDE4DD] hover:border-[#DC8E90] transition-all duration-300 hover:shadow-xl overflow-hidden cursor-pointer street-card"
    >
      {/* ================= IMAGE STAGE ================= */}
      <div className="relative w-full aspect-[4/5] bg-[#F8F3EE] overflow-hidden flex items-center justify-center">
        
        {/* Main Image with Smooth Subtle Scale */}
        <img
          src={displayImage}
          alt={product.name}
          className={`w-full h-full object-contain p-2 transition-all duration-500 ease-out ${
            isHovered && secondaryImage ? "opacity-0 scale-105" : "opacity-100 scale-100"
          }`}
          loading="lazy"
        />

        {/* Hover Alternate Image */}
        {secondaryImage && (
          <img
            src={secondaryImage}
            alt={`${product.name} alternate`}
            className={`absolute inset-0 w-full h-full object-contain p-2 transition-all duration-500 ease-out ${
              isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"
            }`}
            loading="lazy"
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
          {product.badge && (
            <span
              className={`badge-street ${
                product.badge.includes("10%") || product.badge.includes("NGO")
                  ? "bg-[#DC8E90] text-white shadow-xs"
                  : "bg-[#58545F] text-white shadow-xs"
              }`}
            >
              {product.badge === "Bestseller" && <Flame size={11} fill="currentColor" />}
              {product.badge}
            </span>
          )}
          <span className="badge-street bg-white/95 text-[#58545F] border border-[#EDE4DD] shadow-2xs">
            {product.specs?.gsm || 240} GSM • BOXY FIT
          </span>
        </div>

        {/* Quick View Icon */}
        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-[#58545F] hover:bg-[#DC8E90] hover:text-white transition-colors">
            <Eye size={14} />
          </div>
        </div>

        {/* Quick Add Size Bar (Slide Up on Hover) */}
        {!isCustom && (
          <div
            className={`absolute inset-x-3 bottom-3 z-20 transition-all duration-300 ${
              isHovered ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0 pointer-events-none"
            }`}
          >
            {showQuickAdd ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#58545F] text-white p-2.5 rounded-2xl shadow-xl flex flex-col gap-1.5"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between text-[10px] font-bold text-neutral-200 px-1">
                  <span>SELECT SIZE:</span>
                  <button
                    onClick={() => setShowQuickAdd(false)}
                    className="text-neutral-300 hover:text-white cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex gap-1.5">
                  {sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={(e) => handleQuickAdd(e, sz)}
                      className="flex-1 py-1.5 rounded-lg bg-white/20 hover:bg-[#DC8E90] text-white text-xs font-black transition-colors cursor-pointer"
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
                className="pill-button w-full py-2.5 rounded-full bg-[#58545F] hover:bg-[#DC8E90] text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ShoppingBag size={14} />
                <span>+ Quick Add</span>
              </button>
            )}
          </div>
        )}

        {/* Custom Pet Tee Action Bar */}
        {isCustom && (
          <div
            className={`absolute inset-x-3 bottom-3 z-20 transition-all duration-300 ${
              isHovered ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0 pointer-events-none"
            }`}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              className="pill-button w-full py-2.5 rounded-full bg-[#58545F] hover:bg-[#DC8E90] text-white text-xs font-bold uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Customize Pet Art</span>
              <ArrowRight size={13} />
            </button>
          </div>
        )}

        {/* Auth Guard Alert */}
        <AnimatePresence>
          {loginAlert && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-4 z-30 bg-[#2B2730]/95 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center justify-center text-center text-white"
            >
              <ShieldAlert size={24} className="text-[#DC8E90] mb-2" />
              <p className="font-heading font-bold text-xs uppercase tracking-wider">Please Login First</p>
              <p className="text-[11px] text-neutral-300 mt-1">
                Taking you to sign in...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ================= CONTENT STAGE ================= */}
      <div className="p-5 flex flex-col justify-between flex-1 bg-white">
        <div>
          {/* Top Line: Category & Color Switcher */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#7E7785]">
              {product.drop || "Drop 001"} • {product.category}
            </span>

            {/* Color Switcher Dots */}
            <div
              className="flex items-center gap-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelectedColor("black")}
                className={`w-4 h-4 rounded-full bg-[#111111] border transition-transform ${
                  selectedColor === "black" ? "ring-2 ring-[#DC8E90] scale-110" : "border-neutral-300"
                }`}
                title="Vintage Black"
              />
              <button
                type="button"
                onClick={() => setSelectedColor("white")}
                className={`w-4 h-4 rounded-full bg-[#F5F5F3] border transition-transform ${
                  selectedColor === "white" ? "ring-2 ring-[#DC8E90] scale-110" : "border-neutral-300"
                }`}
                title="Cloud White"
              />
            </div>
          </div>

          {/* Title */}
          <h3 className="font-heading font-black text-sm sm:text-base text-[#2B2730] uppercase tracking-tight line-clamp-1 group-hover:text-[#DC8E90] transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Price & Rating */}
        <div className="mt-4 pt-3 border-t border-[#EDE4DD] flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-heading font-black text-base sm:text-lg text-[#2B2730]">
              {currency}{product.price}
            </span>
            <span className="text-xs text-[#7E7785] line-through">
              {currency}{product.originalPrice || 899}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-bold text-[#58545F]">
            <Star size={12} className="text-amber-500 fill-amber-500" />
            <span>{rating.toFixed(1)}</span>
            <span className="text-[#7E7785] font-normal">({reviewCount})</span>
          </div>
        </div>
      </div>
    </div>
  );
}