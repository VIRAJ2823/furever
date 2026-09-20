import React, { useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Flame } from "lucide-react";
import { shopDataContext } from "../context/ShopContext";
import Card from "./Card";

export default function LatestCollection() {
  const navigate = useNavigate();
  const { products = [], loading } = useContext(shopDataContext) || {};

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#58545F] border-t-transparent animate-spin mb-4" />
        <p className="font-heading text-xs uppercase tracking-widest text-[#7E7785] font-bold">
          Loading 240 GSM Streetwear Drops...
        </p>
      </div>
    );
  }

  // Display top 4 pieces (both Drop 001 and Customs)
  const displayRoster = products.slice(0, 4);

  return (
    <section className="w-full">
      {/* Product Grid: 1 col mobile, 2 col tablet, 4 col desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayRoster.map((item) => (
          <Card key={item._id || item.id} product={item} />
        ))}
      </div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 sm:mt-16"
      >
        <button
          onClick={() => navigate("/collections")}
          className="pill-button px-8 py-4 rounded-full bg-[#58545F] hover:bg-[#2B2730] text-white font-heading text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Explore All Drops & Customs</span>
          <ArrowRight size={15} />
        </button>
      </motion.div>
    </section>
  );
}