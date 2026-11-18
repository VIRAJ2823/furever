import { useContext, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { shopDataContext } from "../context/ShopContext";

export default function Card({ product }) {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const {
    currency = "₹",
    addToCart,
    setIsCartDrawerOpen,
  } = useContext(shopDataContext) || {};

  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState("black");
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const isCustom =
    product.category === "Furever Customs" ||
    product.category === "Customs" ||
    product.customizable;
  const sizes =
    product.sizes && product.sizes.length
      ? product.sizes
      : ["S", "M", "L", "XL", "XXL"];

  // Balenciaga-inspired primary and alternate image selection
  const primaryImage =
    selectedColor === "white"
      ? product.images?.white ||
        product.image2 ||
        product.images?.black ||
        product.image1 ||
        product.image?.[0]
      : product.images?.black ||
        product.image1 ||
        product.image?.[0] ||
        product.image;

  // Alternate image for hover (model image or opposite color view)
  const alternateImage =
    product.modelImage ||
    product.images?.model ||
    (selectedColor === "black"
      ? product.images?.white || product.image2
      : product.images?.black || product.image1);

  // Only consider as alternate if it's genuinely different from primary
  const hasAlternate = Boolean(
    alternateImage && alternateImage !== primaryImage
  );

  const handleCardClick = () => {
    navigate(`/product/${product._id || product.id}`);
  };

  const handleQuickAdd = async (e, size) => {
    e.stopPropagation();

    try {
      setIsAdding(true);
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
    <motion.div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowQuickAdd(false);
      }}
      whileHover={shouldReduceMotion ? {} : { y: -3 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col w-full text-left cursor-pointer select-none"
    >
      {/* ================= EDITORIAL IMAGE STAGE ================= */}
      <div className="relative w-full aspect-[3/4] bg-[#F2EFE9]/70 rounded-xl sm:rounded-2xl overflow-hidden flex items-center justify-center p-3 sm:p-5 transition-colors duration-300 group-hover:bg-[#ECE8DF]">
        {/* Primary Product Image */}
        <img
          src={primaryImage}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-contain p-3 sm:p-4 transition-all duration-500 ease-[0.16,1,0.3,1] ${
            isHovered && hasAlternate && !shouldReduceMotion
              ? "opacity-0 scale-[1.03]"
              : isHovered && hasAlternate && shouldReduceMotion
              ? "opacity-0 scale-100"
              : isHovered && !shouldReduceMotion
              ? "opacity-100 scale-[1.03]"
              : "opacity-100 scale-100"
          }`}
          loading="lazy"
        />

        {/* Authentic Alternate Image of the SAME piece (Smooth Crossfade on Hover) */}
        {hasAlternate && (
          <img
            src={alternateImage}
            alt={`${product.name} alternate view`}
            className={`absolute inset-0 w-full h-full object-contain p-3 sm:p-4 transition-all duration-500 ease-[0.16,1,0.3,1] ${
              isHovered && !shouldReduceMotion
                ? "opacity-100 scale-[1.03] pointer-events-auto"
                : isHovered && shouldReduceMotion
                ? "opacity-100 scale-100 pointer-events-auto"
                : "opacity-0 scale-100 pointer-events-none"
            }`}
            loading="lazy"
          />
        )}

        {/* Minimal Understated Colorway Dot / Subtle Indicator */}
        {product.colors && product.colors.length > 1 && (
          <div
            className="absolute top-2.5 right-2.5 z-10 hidden sm:flex items-center gap-1.5 p-1 rounded-full bg-white/70 backdrop-blur-xs border border-[#141414]/8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedColor("black")}
              className={`w-2.5 h-2.5 rounded-full bg-[#111111] transition-transform ${
                selectedColor === "black" ? "ring-1.5 ring-[#141414] scale-110" : "opacity-60 hover:opacity-100"
              }`}
              title="Vintage Black"
            />
            <button
              type="button"
              onClick={() => setSelectedColor("white")}
              className={`w-2.5 h-2.5 rounded-full bg-[#FAF8F5] border border-neutral-300 transition-transform ${
                selectedColor === "white" ? "ring-1.5 ring-[#141414] scale-110" : "opacity-60 hover:opacity-100"
              }`}
              title="Cloud White"
            />
          </div>
        )}

        {/* Desktop Quick Add Action Bar (Hidden on Mobile, Appears Smoothly on Desktop Hover) */}
        {!isCustom && (
          <div
            className={`hidden lg:block absolute inset-x-3 bottom-3 z-20 transition-all duration-300 ease-[0.16,1,0.3,1] ${
              isHovered
                ? "translate-y-0 opacity-100 pointer-events-auto"
                : "translate-y-2 opacity-0 pointer-events-none"
            }`}
          >
            {showQuickAdd ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#141414] text-[#FAF8F5] p-2 rounded-xl shadow-xl flex flex-col gap-1 border border-white/10"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between text-[9px] font-mono text-neutral-300 px-1">
                  <span>SIZE:</span>
                  <button
                    onClick={() => setShowQuickAdd(false)}
                    className="text-neutral-400 hover:text-white cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex gap-1">
                  {sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={(e) => handleQuickAdd(e, sz)}
                      className="flex-1 py-1 rounded-md bg-white/10 hover:bg-white hover:text-[#141414] text-white text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowQuickAdd(true);
                }}
                className="w-full py-2.5 rounded-full bg-[#141414]/90 hover:bg-[#141414] text-[#FAF8F5] text-[11px] font-heading font-bold uppercase tracking-[0.12em] shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer backdrop-blur-xs"
              >
                <ShoppingBag size={12} />
                <span>{isAdding ? "Adding..." : "+ Quick Add"}</span>
              </button>
            )}
          </div>
        )}

        {/* Custom Piece Action Bar on Hover */}
        {isCustom && (
          <div
            className={`hidden lg:block absolute inset-x-3 bottom-3 z-20 transition-all duration-300 ease-[0.16,1,0.3,1] ${
              isHovered
                ? "translate-y-0 opacity-100 pointer-events-auto"
                : "translate-y-2 opacity-0 pointer-events-none"
            }`}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              className="w-full py-2.5 rounded-full bg-[#141414]/90 hover:bg-[#141414] text-[#FAF8F5] text-[11px] font-heading font-bold uppercase tracking-[0.12em] shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer backdrop-blur-xs"
            >
              <span>Customize</span>
              <ArrowRight size={12} />
            </button>
          </div>
        )}
      </div>

      {/* ================= EDITORIAL PRODUCT DETAILS ================= */}
      <div className="pt-3 sm:pt-3.5 flex flex-col justify-between flex-1">
        {/* Title */}
        <h3 className="font-heading font-bold text-xs sm:text-sm text-[#141414] uppercase tracking-wide line-clamp-1 group-hover:opacity-70 transition-opacity">
          {product.name}
        </h3>

        {/* Price & Material Note */}
        <div className="flex items-baseline justify-between mt-1">
          <span className="font-heading font-semibold text-xs sm:text-sm text-[#141414]">
            {currency}{product.price}
          </span>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#141414]/45 hidden sm:inline">
            240 GSM
          </span>
        </div>
      </div>
    </motion.div>
  );
}