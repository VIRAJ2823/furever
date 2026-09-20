import React, { useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Flame } from "lucide-react";
import { shopDataContext } from "../context/ShopContext";
import Card from "./Card";

export default function BestSeller() {
  const navigate = useNavigate();
  const { products = [], upcomingDrops = [], loading } = useContext(shopDataContext) || {};

  if (loading) {
    return (
      <div className="py-16 text-center text-neutral-500 font-medium text-sm">
        Loading Bestsellers...
      </div>
    );
  }

  // Filter bestseller products; if only 1 or 2 exist, include top products or popular drop preview
  let bestSellerProducts = products.filter((p) => p.bestseller);
  if (bestSellerProducts.length === 0) {
    bestSellerProducts = products.slice(0, 2);
  }

  // Combine with a teaser to ensure a balanced 3 or 4 item grid
  const displayItems = [...bestSellerProducts, ...upcomingDrops.filter((u) => u.bestseller)].slice(0, 4);

  if (displayItems.length === 0) {
    return (
      <div className="text-center py-10 text-neutral-400 font-medium">
        Bestsellers dropping soon.
      </div>
    );
  }

  return (
    <section className="w-full">
      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6 lg:gap-8">
        {displayItems.map((product) => (
          <Card key={product._id} product={product} />
        ))}
      </div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex justify-center mt-12 sm:mt-16"
      >
        <button
          onClick={() =>
            navigate("/collections", {
              state: { filter: "bestseller" },
            })
          }
          className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#FF462D] hover:bg-[#E03B24] active:scale-[0.98] text-white font-heading text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-xl shadow-[#FF462D]/20 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Shop High-Demand Drops</span>
          <ArrowRight size={15} />
        </button>
      </motion.div>
    </section>
  );
}