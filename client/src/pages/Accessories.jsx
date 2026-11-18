import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

export default function Accessories() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#141414] flex flex-col selection:bg-[#141414] selection:text-[#FAF8F5]">
      <Nav />

      <main className="flex-1 flex items-center justify-center py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Visual: Authentic Dog Asset */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative order-2 md:order-1 flex justify-center"
          >
            <div className="relative w-full max-w-sm rounded-2xl overflow-hidden border border-[#141414]/10 shadow-xl bg-white p-3">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-[#FAF8F5]">
                <img
                  src="/images/accessories/furever-dog.png"
                  alt="Furever companion"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="pt-3 pb-1 px-2 flex items-center justify-between text-[#141414]/60">
                <span className="text-[10px] font-mono tracking-widest uppercase">
                  Furever Archives
                </span>
                <span className="text-[10px] font-mono tracking-widest uppercase">
                  Edition 01
                </span>
              </div>
            </div>
          </motion.div>

          {/* Editorial Content */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="order-1 md:order-2 flex flex-col items-start"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#141414]/15 bg-[#141414]/5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#141414] animate-pulse" />
              <span className="text-[11px] font-mono font-medium uppercase tracking-[0.16em] text-[#141414]/80">
                In Studio Development
              </span>
            </div>

            <h1 className="font-heading font-black text-4xl sm:text-5xl md:text-6xl uppercase tracking-[0.16em] text-[#141414] leading-none mb-4">
              Accessories
            </h1>

            <p className="font-heading font-bold text-lg sm:text-xl text-[#141414]/90 tracking-wide uppercase mb-4">
              Coming Soon
            </p>

            <p className="text-sm sm:text-base text-[#141414]/70 leading-relaxed max-w-md mb-8">
              Everyday companion essentials, premium hardware, and animal-inspired lifestyle accents. Crafted with the same heavyweight integrity as our original streetwear silhouettes.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <Link
                to="/collections"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#141414] hover:bg-[#141414]/90 text-[#FAF8F5] font-heading font-bold text-xs uppercase tracking-[0.14em] transition-all shadow-md hover:shadow-lg group"
              >
                <span>Explore Collections</span>
                <ArrowRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
              <Link
                to="/customs"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-full border border-[#141414]/25 hover:border-[#141414] bg-transparent text-[#141414] font-heading font-bold text-xs uppercase tracking-[0.14em] transition-all"
              >
                Custom Prints
              </Link>
            </div>
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
