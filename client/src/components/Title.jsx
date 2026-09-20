import React from "react";
import { motion } from "framer-motion";

export default function Title({ text1, text2, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className="text-center max-w-2xl mx-auto"
    >
      {subtitle && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#EDE4DD] text-[#58545F] text-[10px] font-extrabold uppercase tracking-widest mb-3 shadow-2xs">
          <span className="text-[#DC8E90]">⚡</span>
          <span>{subtitle}</span>
        </div>
      )}

      <h2 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl tracking-tighter uppercase text-[#2B2730] leading-tight">
        <span>{text1} </span>
        <span className="text-[#DC8E90]">{text2}</span>
      </h2>

      <div className="w-12 h-1 bg-[#DC8E90] rounded-full mx-auto mt-3" />
    </motion.div>
  );
}