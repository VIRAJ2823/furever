import { Link, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import Nav from "../components/Nav";
import Hero from "../components/Hero";
import FeaturedPieces from "../components/FeaturedPieces";
import Feedback from "../components/Feedback";
import Footer from "../components/Footer";

export default function Home() {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#141414] flex flex-col font-sans selection:bg-[#141414] selection:text-[#FAF8F5]">
      {/* 1. NAVBAR */}
      <Nav />

      <main className="flex-1 w-full">
        {/* 2. CINEMATIC HERO SECTION */}
        <Hero />

        {/* 3. CONTINUOUS HORIZONTAL FEATURED PIECES SLIDESHOW (LEFT-TO-RIGHT) */}
        <FeaturedPieces />


        {/* 6. SOCIAL PROOF & FEEDBACK */}
        <Feedback />

        {/* 7. FINAL CTA BANNER */}
        <section className="w-full py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#141414] text-[#FAF8F5] text-center relative overflow-hidden">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 max-w-3xl mx-auto"
          >
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#FAF8F5]/60 block mb-4">
              Wear What You Believe In
            </span>

            <h2 className="font-heading font-black text-4xl sm:text-6xl uppercase tracking-tight text-[#FAF8F5] mb-6">
              KEEP THE BOND CLOSE.
            </h2>

            <p className="text-sm sm:text-base text-[#FAF8F5]/75 leading-relaxed max-w-xl mx-auto mb-10 font-medium">
              Join thousands of animal lovers celebrating their companions.
              Every piece donates 10% of net profits to local animal rescue
              programs.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                type="button"
                whileHover={shouldReduceMotion ? {} : { scale: 1.03, y: -2 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                onClick={() => navigate("/originals")}
                className="w-full sm:w-auto px-10 py-4 rounded-full bg-[#FAF8F5] hover:bg-white text-[#141414] font-heading font-bold text-xs uppercase tracking-[0.14em] transition-all shadow-md cursor-pointer"
              >
                Explore Originals
              </motion.button>

              <motion.button
                type="button"
                whileHover={shouldReduceMotion ? {} : { scale: 1.03, y: -2 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                onClick={() => navigate("/customs")}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-transparent hover:bg-white/10 border border-[#FAF8F5]/30 text-[#FAF8F5] font-heading font-bold text-xs uppercase tracking-[0.14em] transition-all cursor-pointer"
              >
                Create Custom Pet Tee
              </motion.button>
            </div>
          </motion.div>
        </section>
      </main>

      {/* 8. FOOTER */}
      <Footer />
    </div>
  );
}
