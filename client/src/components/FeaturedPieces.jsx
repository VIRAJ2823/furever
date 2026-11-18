import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { shopDataContext } from "../context/ShopContext";

// Fallback image helper to resolve real product images cleanly
function getProductImage(product) {
  if (!product) return "/images/products/vibin-black.png";
  if (product.images?.black) return product.images.black;
  if (product.image1) return product.image1;
  if (product.images?.white) return product.images.white;
  if (product.image2) return product.image2;
  if (Array.isArray(product.image) && product.image.length > 0) return product.image[0];
  if (typeof product.image === "string" && product.image.trim()) return product.image;
  return "/images/products/vibin-black.png";
}

// Minimal Streetwear Product Card for the Slideshow
function FeaturedProductCard({ product, isDuplicate = false, currency = "₹" }) {
  const productId = product._id || product.id;
  const imageUrl = getProductImage(product);

  return (
    <Link
      to={`/product/${productId}`}
      tabIndex={isDuplicate ? -1 : 0}
      aria-hidden={isDuplicate ? "true" : undefined}
      className="group relative flex flex-col w-[260px] sm:w-[300px] md:w-[340px] lg:w-[360px] shrink-0 text-left cursor-pointer select-none focus:outline-hidden"
    >
      {/* Editorial Image Stage: Large, clean image on white canvas */}
      <div className="relative aspect-[4/5] w-full bg-white rounded-2xl sm:rounded-3xl border border-[#141414]/10 p-6 sm:p-8 flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:border-[#141414]/30 group-hover:shadow-xl">
        <img
          src={imageUrl}
          alt={product.name}
          loading="lazy"
          draggable={false}
          className="w-full h-full object-contain transform transition-transform duration-700 ease-[0.16,1,0.3,1] group-hover:scale-106 pointer-events-none"
        />
      </div>

      {/* Minimal Product Information with Generous Whitespace */}
      <div className="mt-4 sm:mt-5 px-1 flex flex-col gap-1">
        <h3 className="font-heading font-black text-sm sm:text-base uppercase tracking-tight text-[#141414] truncate group-hover:opacity-75 transition-opacity">
          {product.name}
        </h3>
        <p className="text-xs sm:text-sm font-mono font-bold text-[#141414]/75">
          {currency}{product.price}
        </p>
      </div>
    </Link>
  );
}

export default function FeaturedPieces() {
  const { products = [], loading = false, currency = "₹" } =
    useContext(shopDataContext) || {};
  const shouldReduceMotion = useReducedMotion();

  // Use genuine products from the catalog
  const baseProducts = products && products.length > 0 ? products : [];

  // Ensure sequence has enough cards to loop smoothly across wide displays
  let displayList = [...baseProducts];
  if (displayList.length > 0 && displayList.length < 8) {
    while (displayList.length < 8) {
      displayList = [...displayList, ...baseProducts];
    }
  }

  return (
    <section className="w-full py-20 sm:py-28 lg:py-32 bg-[#FAF8F5] text-[#141414] border-b border-[#141414]/10 overflow-hidden">
      {/* Section Header: Minimal Streetwear Aesthetic */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 sm:mb-14">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
          <div>
            <h2 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-[#141414]">
              FEATURED PIECES
            </h2>
            <p className="text-sm sm:text-base text-[#141414]/70 font-medium mt-2 max-w-lg">
              Pieces made to carry your story.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/collections"
              className="inline-flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-[0.16em] text-[#141414] hover:opacity-70 transition-opacity group"
            >
              <span>View Full Catalog</span>
              <ArrowRight
                size={14}
                className="transform group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Loading State Skeleton */}
      {loading && displayList.length === 0 ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6 overflow-hidden">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="w-[280px] sm:w-[320px] aspect-[4/5] bg-white rounded-3xl border border-[#141414]/10 animate-pulse shrink-0"
              />
            ))}
          </div>
        </div>
      ) : shouldReduceMotion ? (
        /* Reduced Motion Mode: Non-moving, accessible, usable horizontal product layout */
        <div className="w-full overflow-x-auto px-4 sm:px-6 lg:px-8 pb-6 no-scrollbar scroll-smooth">
          <div className="flex gap-6 sm:gap-8 max-w-7xl mx-auto">
            {baseProducts.map((product) => (
              <FeaturedProductCard
                key={`static-${product._id || product.id}`}
                product={product}
                currency={currency}
              />
            ))}
          </div>
        </div>
      ) : (
        /* Continuous Moving Horizontal Product Slideshow (LEFT TO RIGHT) */
        <div className="relative w-full overflow-hidden">
          {/* Subtle Edge Gradients for Smooth Luxury Fade */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-20 md:w-28 bg-gradient-to-r from-[#FAF8F5] to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-20 md:w-28 bg-gradient-to-l from-[#FAF8F5] to-transparent z-10" />

          {/* Continuously Moving Track */}
          <div className="featured-slideshow-track flex select-none">
            {/* Primary Visual Track */}
            <div className="flex shrink-0 gap-6 sm:gap-8 lg:gap-10 pr-6 sm:pr-8 lg:pr-10">
              {displayList.map((product, idx) => (
                <FeaturedProductCard
                  key={`track1-${product._id || product.id}-${idx}`}
                  product={product}
                  currency={currency}
                />
              ))}
            </div>

            {/* Duplicate Visual Track for Seamless Continuous Looping */}
            <div
              className="flex shrink-0 gap-6 sm:gap-8 lg:gap-10 pr-6 sm:pr-8 lg:pr-10"
              aria-hidden="true"
            >
              {displayList.map((product, idx) => (
                <FeaturedProductCard
                  key={`track2-${product._id || product.id}-${idx}`}
                  product={product}
                  isDuplicate
                  currency={currency}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
