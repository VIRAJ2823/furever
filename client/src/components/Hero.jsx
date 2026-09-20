import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  Flame,
  Heart,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

const STATS = [
  { value: "240 GSM", label: "Pure Combed Cotton" },
  { value: "10% NET PROFIT", label: "Direct to Animal NGOs" },
  { value: "DROP 001", label: "Limited Batch Production" },
  { value: "BOXY FIT", label: "Tailored Drop Shoulder" },
];

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative w-full bg-[#FAF6F2] text-[#2B2730] overflow-hidden pt-8 pb-16 lg:py-20 border-b border-[#EDE4DD]">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ================= HERO GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* LEFT: EDITORIAL COPY & CTAS (7 COLS) */}
          <div className="lg:col-span-7 flex flex-col items-start z-10">
            
            {/* Mission Badge - Warm Sophistication */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#EDE4DD] text-[#58545F] mb-6 shadow-2xs"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#DC8E90] animate-pulse" />
              <span className="font-heading text-[11px] font-extrabold uppercase tracking-wider">
                DROP 001 IS LIVE • <span className="text-[#DC8E90]">10% TO ANIMAL WELFARE</span>
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-heading font-black text-4xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl tracking-tighter leading-[0.95] mb-6 uppercase text-[#2B2730]"
            >
              WEAR YOUR LOVE. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2B2730] via-[#58545F] to-[#DC8E90]">
                IMPACT A LIFE.
              </span>
            </motion.h1>

            {/* Subhead */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-[#58545F] text-base sm:text-lg md:text-xl font-medium max-w-xl mb-8 leading-relaxed"
            >
              Heavyweight 240 GSM Cotton Streetwear Drops. Animal-inspired line art & customizable pet memory tees designed for clean, boxy drape.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10"
            >
              {/* Primary Davy's Gray / Accent Button */}
              <button
                onClick={() => navigate("/collections")}
                className="pill-button px-8 sm:px-10 py-4 rounded-full bg-[#58545F] hover:bg-[#2B2730] text-white font-heading font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-3 cursor-pointer"
              >
                <span>Shop Drop 001</span>
                <ArrowRight size={16} />
              </button>

              {/* Light Coral / Apricot Accent Button */}
              <button
                onClick={() => navigate("/product/fur-custom-01")}
                className="pill-button px-7 py-4 rounded-full bg-white hover:bg-[#FAF6F2] border-2 border-[#DC8E90] text-[#2B2730] font-heading font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Customize My Pet Tee ₹429</span>
                <span className="text-xs">🐾</span>
              </button>
            </motion.div>

            {/* Micro Highlights */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-[#58545F] font-semibold">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-[#DC8E90]" />
                Zero Plastic Plastisol Inks
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-[#DC8E90]" />
                Unisex Boxy Oversized Drape
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-[#DC8E90]" />
                WhatsApp Art Proof in 24h
              </span>
            </div>

          </div>

          {/* RIGHT: AUTHENTIC CUSTOMS ARTWORK DISPLAY (NO FAKE CLOTHES) (5 COLS) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden bg-white border border-[#EDE4DD] shadow-lg"
            >
              <img
                src="/images/customs/lineart-black.png"
                alt="240 GSM Custom Pet Line Art Tee"
                className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700"
              />

              {/* Floating Pill Tag */}
              <div className="absolute top-4 left-4 bg-[#2B2730]/90 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase flex items-center gap-1.5 shadow-sm">
                <Flame size={12} className="text-[#FDAC98]" fill="currentColor" />
                <span>Memory Series Customs • ₹429</span>
              </div>

              {/* Bottom Card Spotlight */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-[#EDE4DD] shadow-md flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#DC8E90] block">
                    Make It Wearable
                  </span>
                  <span className="text-sm font-black text-[#2B2730] block">
                    Custom Pet Line Art Tee
                  </span>
                  <span className="text-xs text-[#58545F] font-medium">From ₹429 • Line Art or Stencil</span>
                </div>
                <button
                  onClick={() => navigate("/product/fur-custom-01")}
                  className="pill-button px-4 py-2 rounded-full bg-[#58545F] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#DC8E90] transition-colors cursor-pointer"
                >
                  Create
                </button>
              </div>
            </motion.div>
          </div>

        </div>

        {/* ================= FAST STATS RAIL ================= */}
        <div className="mt-14 sm:mt-16 pt-8 border-t border-[#EDE4DD] grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {STATS.map((s) => (
            <div key={s.value} className="border-l-2 border-[#DC8E90] pl-4">
              <p className="font-heading font-black text-xl sm:text-2xl text-[#2B2730] uppercase tracking-tight leading-none">
                {s.value}
              </p>
              <p className="text-xs text-[#58545F] font-semibold mt-1 tracking-wide uppercase">
                {s.label}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}