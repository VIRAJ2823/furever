import { useContext, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Nav from "../components/Nav";
import Card from "../components/Card";
import Footer from "../components/Footer";
import { shopDataContext } from "../context/ShopContext";

export default function Originals() {
  const { products = [], loading = false } = useContext(shopDataContext) || {};
  const shouldReduceMotion = useReducedMotion();

  const [sortOption, setSortOption] = useState("featured");

  // Keep all existing products in the Originals collection, with clean sorting
  const sortedProducts = useMemo(() => {
    let list = [...products];

    if (sortOption === "priceLowHigh") {
      list.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortOption === "priceHighLow") {
      list.sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    return list;
  }, [products, sortOption]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#141414] flex flex-col selection:bg-[#141414] selection:text-[#FAF8F5]">
      <Nav />

      <main className="flex-1 max-w-7xl mx-auto w-full px-3.5 sm:px-6 lg:px-8 py-8 sm:py-14 lg:py-18">
        {/* ================= EDITORIAL HEADER ================= */}
        <div className="max-w-2xl mb-8 sm:mb-12">
          <motion.h1
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-heading font-black text-2xl sm:text-4xl lg:text-5xl uppercase tracking-[0.18em] text-[#141414] mb-2 leading-none"
          >
            ORIGINALS
          </motion.h1>

          <motion.p
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="text-xs sm:text-sm text-[#141414]/65 font-medium tracking-wide leading-relaxed"
          >
            Heavyweight graphic streetwear crafted from 240 GSM combed cotton.
          </motion.p>
        </div>

        {/* ================= RESTRAINED UTILITY BAR ================= */}
        <div className="flex items-center justify-between pb-4 sm:pb-5 mb-8 sm:mb-10 border-b border-[#141414]/10">
          <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#141414]/50">
            {sortedProducts.length} {sortedProducts.length === 1 ? "Piece" : "Pieces"}
          </span>

          {/* Minimal Sort Control */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#141414]/40 hidden sm:inline">
              Sort:
            </span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="text-xs font-heading font-semibold uppercase tracking-wider bg-transparent border-none py-1 pr-4 text-[#141414] focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="priceLowHigh">Price: Low to High</option>
              <option value="priceHighLow">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* ================= RESPONSIVE PRODUCT GRID ================= */}
        {loading && products.length === 0 ? (
          <div className="py-24 text-center text-xs font-mono uppercase tracking-widest text-[#141414]/40">
            Loading collection...
          </div>
        ) : sortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3.5 sm:gap-x-6 lg:gap-x-8 gap-y-8 sm:gap-y-12">
            {sortedProducts.map((product) => (
              <Card key={product._id || product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border border-[#141414]/10 rounded-2xl p-8 max-w-md mx-auto">
            <p className="text-xs font-heading font-bold uppercase tracking-wider text-[#141414]">
              No products found
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
