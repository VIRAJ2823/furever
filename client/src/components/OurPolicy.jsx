
import React from "react";
import { motion } from "framer-motion";
import { HeartHandshake } from "lucide-react";

export default function OurPolicy() {
  return (
    <section className="w-full bg-[#F5EFEB] py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-6 sm:gap-8 p-6 sm:p-8 rounded-2xl bg-white border border-[#EDE4DD] hover:border-[#DC8E90] shadow-sm hover:shadow-md transition-all duration-300"
      >
        {/* Icon */}
        <div className="w-16 h-16 shrink-0 rounded-2xl bg-[#FAF6F2] border border-[#EDE4DD] flex items-center justify-center text-[#DC8E90]">
          <HeartHandshake size={32} strokeWidth={2} />
        </div>

        {/* Content */}
        <div className="flex-1 text-center sm:text-left">
          <h2 className="font-display font-black text-lg sm:text-xl uppercase tracking-wide text-[#2B2730] mb-2">
            Our Animal Welfare Commitment
          </h2>

          <p className="text-sm text-[#58545F] leading-relaxed font-medium">
            We donate 10% of our net profit to animal rescue organizations,
            supporting food, medical care, vaccinations, and shelter for
            animals in need.
          </p>
        </div>

        {/* Percentage */}
        <div className="shrink-0 text-center sm:border-l sm:border-[#EDE4DD] sm:pl-8">
          <span className="font-display font-black text-4xl sm:text-5xl text-[#DC8E90]">
            10%
          </span>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#58545F] mt-1">
            Net Profit
          </p>
        </div>
      </motion.div>
    </section>
  );
}
