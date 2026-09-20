import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Layers,
  Scissors,
  Feather,
  Flame,
  CheckCircle2,
} from "lucide-react";

const CATEGORIES_ROADMAP = [
  {
    id: "01",
    name: "Heavyweight Oversized Tees",
    status: "LIVE NOW • DROP 01",
    statusColor: "bg-[#FF462D] text-white",
    desc: "240 GSM organic combed cotton, relaxed drop shoulder, engineered for the daily streetwear rotation.",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop",
    link: "/collections",
    action: "Shop Live Tees",
  },
  {
    id: "02",
    name: "Boxy French Terry Hoodies",
    status: "DROP 02 • COMING SOON",
    statusColor: "bg-white/10 text-neutral-300",
    desc: "380 GSM ultra-heavy fleeces, double-lined hood, and brutalist minimal silicone accents.",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop",
    link: "/collections",
    action: "Preview Drop 02",
  },
  {
    id: "03",
    name: "Headwear & Club Caps",
    status: "ARCHIVE • IN PRODUCTION",
    statusColor: "bg-white/10 text-neutral-300",
    desc: "6-panel dad caps, distressed brim beanies, and embroidered stray emblem hardware.",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop",
    link: "/collections",
    action: "Explore Archive",
  },
  {
    id: "04",
    name: "Lifestyle & Rescue Gear",
    status: "MISSION LINE • ONGOING",
    statusColor: "bg-[#00E599]/20 text-[#00E599]",
    desc: "Matching vegan leather leads, heavy canvas tote bags, and shelter support bundles.",
    image: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?q=80&w=800&auto=format&fit=crop",
    link: "/about",
    action: "Our Mission",
  },
];

const ANATOMY_POINTS = [
  {
    icon: Layers,
    title: "240 GSM Heavyweight Build",
    desc: "Substantial, luxury hand-feel that drapes with a true structured streetwear boxy silhouette, never clinging.",
  },
  {
    icon: Scissors,
    title: "Tailored Drop Shoulder",
    desc: "Engineered proportions with wider chest and sleeve measurements for a modern Gen-Z streetwear fit.",
  },
  {
    icon: Feather,
    title: "Pre-Shrunk Bio-Washed Cotton",
    desc: "100% combed cotton treated with natural enzyme baths to prevent shrinkage and maintain velvet softness.",
  },
  {
    icon: ShieldCheck,
    title: "Water-Based Non-Toxic Inks",
    desc: "Zero plastisol petroleum runoff. Breathable, crack-proof prints that are 100% cruelty-free and vegan.",
  },
];

export default function BrandStory() {
  const navigate = useNavigate();

  return (
    <div id="brand-story" className="w-full bg-[#FAF8F5] text-[#121217] py-20 sm:py-24 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ================= SECTION 1: THE UNIVERSE (ROADMAP) ================= */}
        <div className="mb-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#FF462D] mb-3">
                <Flame size={14} fill="currentColor" />
                <span>The Lifestyle Roadmap</span>
              </div>
              <h2 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-neutral-950">
                THE FUREVER <span className="text-[#FF462D]">UNIVERSE</span>
              </h2>
            </div>
            <p className="text-sm sm:text-base text-neutral-600 max-w-md font-medium leading-relaxed">
              We aren’t just selling shirts — we are engineering a cruelty-free streetwear ecosystem built on limited drops and premium craftsmanship.
            </p>
          </div>

          {/* Category Roadmap Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES_ROADMAP.map((cat, idx) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                onClick={() => navigate(cat.link)}
                className="group relative flex flex-col justify-between bg-white rounded-3xl border border-neutral-200 overflow-hidden hover:border-neutral-900 transition-all duration-300 hover:shadow-xl cursor-pointer"
              >
                {/* Image */}
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-neutral-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase ${cat.statusColor}`}>
                      {cat.status}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <div className="text-xs font-mono font-bold text-neutral-400 mb-1">
                      LINE // {cat.id}
                    </div>
                    <h3 className="font-heading font-bold text-lg text-neutral-900 mb-2 group-hover:text-[#FF462D] transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-neutral-500 leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-neutral-900 group-hover:text-[#FF462D]">
                    <span>{cat.action}</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ================= SECTION 2: ANATOMY OF THE TEE ================= */}
        <div className="rounded-[36px] bg-[#0D0D11] text-white p-8 sm:p-12 lg:p-16 border border-white/10 shadow-2xl relative overflow-hidden">
          
          {/* Background Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#FF462D]/10 blur-[100px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            
            {/* Left: Manifesto */}
            <div className="lg:col-span-5">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FF462D] mb-4">
                <Sparkles size={14} />
                <span>Craftsmanship & Cut</span>
              </span>

              <h2 className="font-heading font-black text-3xl sm:text-5xl uppercase tracking-tight leading-[1.05] mb-6">
                ANATOMY OF THE <br />
                <span className="text-[#FF462D]">240 GSM</span> TEE
              </h2>

              <p className="text-neutral-400 text-sm sm:text-base leading-relaxed mb-8">
                Mass production cut corners. We refuse to. Every FurEver oversized silhouette is measured and sampled dozens of times before reaching your hands. No transparent fabric. No flimsy necklines.
              </p>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#FF462D]/20 flex items-center justify-center text-[#FF462D] shrink-0">
                  <Heart size={22} fill="currentColor" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-white uppercase">
                    10% Dedicated to Animal Welfare
                  </h4>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Every garment sold directly funds emergency veterinary treatment and stray dog feeding programs.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: 4 Pillar Grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {ANATOMY_POINTS.map((point) => {
                const Icon = point.icon;
                return (
                  <div
                    key={point.title}
                    className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[#FF462D]/40 transition-colors flex flex-col justify-between"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#FF462D] mb-4">
                      <Icon size={20} />
                    </div>
                    <h3 className="font-heading font-bold text-base text-white mb-2">
                      {point.title}
                    </h3>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      {point.desc}
                    </p>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
