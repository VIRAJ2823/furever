import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Flame,
  Heart,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  ChevronDown,
} from "lucide-react";
import paws from "../assets/paws.png";

const STATS = [
  { value: "240 GSM", label: "Pure Combed Cotton" },
  { value: "10% PROFIT", label: "To Animal Rescues" },
  { value: "LIMITED", label: "150 Pcs Per Batch" },
  { value: "BOXY FIT", label: "Tailored Drop Shoulder" },
];

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative w-full bg-[#0D0D11] text-white overflow-hidden pt-8 pb-16 lg:py-20">
      {/* Dynamic Background Glows & Street Grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[38rem] h-[38rem] rounded-full bg-[#FF462D]/12 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[32rem] h-[32rem] rounded-full bg-[#FF462D]/08 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ================= HERO GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: HEADLINE, BADGES, CTAS */}
          <div className="lg:col-span-7 flex flex-col items-start z-10">
            
            {/* Live Drop Pill */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/15 backdrop-blur-md mb-6 sm:mb-8"
            >
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-[#FF462D] text-white">
                <Flame size={12} fill="currentColor" />
              </div>
              <span className="font-heading text-xs font-bold uppercase tracking-wider text-neutral-300">
                GENESIS DROP 01 IS LIVE • <span className="text-[#FF462D]">LIMITED BATCH</span>
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-heading font-black text-4xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl tracking-tight leading-[0.98] sm:leading-[0.95] mb-6 uppercase"
            >
              WEAR THE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-neutral-400">
                REBELLION.
              </span>
              <br />
              <span className="text-[#FF462D] underline decoration-white/20 decoration-wavy decoration-2">
                SAVE THE STRAYS.
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-neutral-400 text-base sm:text-lg md:text-xl font-medium max-w-xl mb-8 sm:mb-10 leading-relaxed"
            >
              Ultra-heavyweight 240 GSM oversized streetwear cut from organic combed cotton. 
              Each limited drop exists for rebels who demand brutalist style and uncompromising compassion.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10 sm:mb-12"
            >
              <button
                onClick={() => navigate("/collections")}
                className="group px-8 sm:px-10 py-4 sm:py-4.5 rounded-full bg-[#FF462D] hover:bg-[#E03B24] active:scale-[0.98] text-white font-heading font-bold text-sm uppercase tracking-wider transition-all shadow-xl shadow-[#FF462D]/30 flex items-center justify-center gap-3 cursor-pointer"
              >
                <span>Shop Genesis Drop</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  const element = document.getElementById("brand-story");
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  } else {
                    navigate("/about");
                  }
                }}
                className="px-8 sm:px-10 py-4 sm:py-4.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white font-heading font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>The Anatomy & Fit</span>
                <ChevronDown size={16} />
              </button>
            </motion.div>

            {/* Fast Stats Rail */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-6 border-t border-white/10 w-full"
            >
              {STATS.map((stat) => (
                <div key={stat.value} className="flex flex-col">
                  <span className="font-heading font-black text-lg sm:text-xl text-white tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-xs text-neutral-400 font-medium">
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>

          </div>

          {/* RIGHT COLUMN: EDITORIAL LIFESTYLE SHOWCASE */}
          <div className="lg:col-span-5 relative w-full flex items-center justify-center">
            
            {/* Background Graphic Card Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative w-full max-w-md aspect-[4/5] rounded-[32px] overflow-hidden border border-white/15 bg-gradient-to-br from-[#16161D] to-[#0A0A0D] shadow-2xl p-4 flex flex-col justify-between"
            >
              {/* Editorial Lookbook Image */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-neutral-900 group">
                <img
                  src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000&auto=format&fit=crop"
                  alt="FurEver Streetwear Model"
                  className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D11] via-transparent to-transparent opacity-80" />

                {/* Floating Badge: Animal Rescue Pledge */}
                <div className="absolute top-4 left-4 z-10">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold uppercase tracking-wider">
                    <Heart size={12} className="text-[#FF462D]" fill="currentColor" />
                    <span>Animal Welfare First</span>
                  </div>
                </div>

                {/* Floating Badge: Drop 01 */}
                <div className="absolute bottom-4 left-4 right-4 z-10 p-4 rounded-xl bg-black/80 backdrop-blur-md border border-white/15 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-[#FF462D] uppercase tracking-widest">
                      NOW STREAMING
                    </p>
                    <h3 className="font-heading font-black text-base text-white tracking-tight uppercase">
                      Genesis Oversized Tee
                    </h3>
                    <p className="text-xs text-neutral-400">240 GSM Combed Cotton • ₹999</p>
                  </div>

                  <button
                    onClick={() => navigate("/collections")}
                    className="w-10 h-10 rounded-full bg-[#FF462D] hover:bg-white hover:text-[#0D0D11] text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                    title="View Drop"
                  >
                    <ArrowUpRight size={18} />
                  </button>
                </div>
              </div>

              {/* Decorative Corner Watermark */}
              <div className="absolute -bottom-6 -right-6 text-white/[0.04] font-heading font-black text-8xl pointer-events-none select-none">
                FE
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}