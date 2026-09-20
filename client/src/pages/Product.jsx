import React from "react";
import { motion } from "framer-motion";
import Title from "../components/Title";
import LatestCollection from "../components/LatestCollection";
import BestSeller from "../components/BestSeller";

export default function Product() {
  return (
    <section className="w-full bg-[#FAF8F5] py-20 sm:py-24 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ================= LATEST COLLECTION ================= */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Title text1="GENESIS" text2="DROPS" subtitle="BATCH 001 ARCHIVE" />

          <p className="text-center text-neutral-500 max-w-2xl mx-auto mt-4 mb-12 sm:mb-16 text-sm sm:text-base font-medium leading-relaxed">
            Curated oversized fits cut from 240 GSM organic combed cotton. Limited to 150 pieces per run — once gone, they will not be re-pressed.
          </p>

          <LatestCollection />
        </motion.div>

        <div className="py-12 sm:py-16" />

        {/* ================= BEST SELLERS ================= */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Title text1="HIGH DEMAND" text2="ROTATION" subtitle="COMMUNITY FAVOURITES" />

          <p className="text-center text-neutral-500 max-w-2xl mx-auto mt-4 mb-12 sm:mb-16 text-sm sm:text-base font-medium leading-relaxed">
            The pieces in heaviest rotation across our rebel community. Built for comfort, wash resilience, and timeless oversized draping.
          </p>

          <BestSeller />
        </motion.div>

      </div>
    </section>
  );
}