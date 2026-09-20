import React from "react";
import { motion } from "framer-motion";

export default function Title({ text1, text2, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="text-center"
    >
      {subtitle && (
        <p className="font-heading text-xs font-bold uppercase tracking-[0.25em] text-[#FF462D] mb-3">
          {subtitle}
        </p>
      )}

      <h2 className="font-heading font-black text-3xl sm:text-5xl md:text-6xl tracking-tight uppercase leading-none">
        <span className="text-[#121217]">{text1} </span>
        <span className="text-[#FF462D]">{text2}</span>
      </h2>

      <div className="w-16 h-1 bg-[#FF462D] rounded-full mx-auto mt-4"></div>
    </motion.div>
  );
}