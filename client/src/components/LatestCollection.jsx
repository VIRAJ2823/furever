import React, { useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Flame, Sparkles } from "lucide-react";
import { shopDataContext } from "../context/ShopContext";
import Card from "./Card";

export default function LatestCollection() {
  const navigate = useNavigate();
  const { products = [], upcomingDrops = [], loading } = useContext(shopDataContext) || {};

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#FF462D] border-t-transparent animate-spin mb-4" />
        <p className="font-heading text-sm uppercase tracking-wider text-neutral-500 font-bold">
          Loading Genesis Archive...
        </p>
      </div>
    );
  }

  // Combine live products with upcoming teaser drops so the drop roster is full and curated!
  const liveItems = [...products].sort((a, b) => (b.date || 0) - (a.date || 0));
  const combinedRoster = [...liveItems, ...upcomingDrops].slice(0, 4);

  return (
    <section className="w-full">
      {/* Product Grid: 1 col on mobile, 2 on tablet, 4 on desktop/laptop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6 lg:gap-8">
        {combinedRoster.map((item) => (
          <Card key={item._id} product={item} />
        ))}
      </div>

      {/* CTA Strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 sm:mt-16"
      >
        <button
          onClick={() =>
            navigate("/collections", {
              state: { filter: "latest" },
            })
          }
          className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#0D0D11] hover:bg-[#FF462D] text-white font-heading text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Explore All Archive Drops</span>
          <ArrowRight size={15} />
        </button>
      </motion.div>
    </section>
  );
}