import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown, MoveRight } from "lucide-react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

/* ------------------------------------------------------------------ */
/*  SIGNATURE MARK — Hand-rendered line drawing                        */
/* ------------------------------------------------------------------ */
const FoxMark = ({ className = "", stroke = "#141414", duration = 2.2, delay = 0 }) => (
  <svg
    viewBox="0 0 420 380"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <motion.path
      d="M 300 40
         C 270 30, 250 55, 248 90
         C 246 120, 260 140, 250 150
         C 220 130, 190 122, 150 128
         C 100 136, 55 165, 30 205
         C 48 200, 66 198, 84 204
         C 70 220, 64 240, 70 262
         C 90 250, 108 246, 126 250
         C 118 270, 120 292, 134 310
         C 148 296, 160 288, 176 286
         C 182 306, 198 320, 220 324
         C 218 306, 222 290, 234 278
         C 258 282, 282 274, 300 256
         C 320 236, 328 208, 322 180
         C 340 176, 356 164, 364 146
         C 346 148, 330 144, 318 132
         C 332 118, 336 100, 328 82
         C 316 90, 306 100, 300 114
         C 292 90, 296 62, 300 40 Z"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ pathLength: { duration, delay, ease: "easeInOut" }, opacity: { duration: 0.4, delay } }}
    />
    <motion.circle
      cx="252"
      cy="98"
      r="2.5"
      fill={stroke}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: delay + duration - 0.2 }}
    />
  </svg>
);

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function About() {
  const navigate = useNavigate();
  const storyRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const scrollToStory = () =>
    storyRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const { scrollYProgress: heroProgress } = useScroll();
  const foxDrift = useTransform(heroProgress, [0, 0.15], [0, -30]);

  return (
    <div className="w-full overflow-x-hidden bg-[#FAF8F5] text-[#141414] selection:bg-[#141414] selection:text-[#FAF8F5]">
      <Nav />

      <main className="w-full">
        {/* ================= 1. HERO — THE BRAND STATEMENT ================= */}
        <section className="relative w-full min-h-[85vh] flex flex-col justify-between overflow-hidden bg-[#0A0A0A] text-[#FAF8F5]">
          {/* Subtle line drawing graphic */}
          <motion.div
            style={shouldReduceMotion ? {} : { y: foxDrift }}
            className="absolute top-[8%] right-[2%] w-[46vw] max-w-[500px] min-w-[240px] opacity-30 pointer-events-none"
          >
            <FoxMark stroke="#FAF8F5" duration={2.2} delay={0.2} />
          </motion.div>

          <div className="relative z-10 flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-20 pt-24 lg:pt-28 pb-12 max-w-6xl">
            <motion.p
              initial="hidden"
              animate="show"
              variants={fadeUp}
              className="uppercase tracking-[0.24em] text-xs font-mono text-[#FAF8F5]/60 mb-6"
            >
              Furever — Animal-Inspired Streetwear
            </motion.p>

            <motion.h1
              initial="hidden"
              animate="show"
              custom={1}
              variants={fadeUp}
              className="font-heading font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl uppercase tracking-[0.14em] leading-[0.95] text-[#FAF8F5] max-w-4xl"
            >
              WEAR WHAT YOU <span className="font-serif italic font-normal text-[#FAF8F5]/80">believe</span> IN.
            </motion.h1>

            <motion.p
              initial="hidden"
              animate="show"
              custom={2}
              variants={fadeUp}
              className="mt-8 max-w-xl text-base sm:text-lg text-[#FAF8F5]/75 leading-relaxed font-normal"
            >
              Furever creates heavyweight silhouettes people genuinely want to wear — crafted with purpose built into the foundation of the brand.
            </motion.p>

            <motion.div
              initial="hidden"
              animate="show"
              custom={3}
              variants={fadeUp}
              className="mt-10 flex flex-wrap items-center gap-4 sm:gap-6"
            >
              <button
                type="button"
                onClick={scrollToStory}
                className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-xs font-heading font-bold uppercase tracking-[0.14em] bg-[#FAF8F5] text-[#141414] hover:bg-white transition-all shadow-md cursor-pointer group"
              >
                <span>Our Story</span>
                <ChevronDown
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-y-0.5"
                />
              </button>

              <button
                type="button"
                onClick={() => navigate("/collections")}
                className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-xs font-heading font-bold uppercase tracking-[0.14em] border border-[#FAF8F5]/25 text-[#FAF8F5] hover:border-[#FAF8F5] transition-all cursor-pointer group"
              >
                <span>Explore Collections</span>
                <ArrowRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>
            </motion.div>
          </div>

          <button
            type="button"
            onClick={scrollToStory}
            className="relative z-10 mx-auto mb-8 flex flex-col items-center gap-2 text-[10px] font-mono tracking-[0.25em] uppercase text-[#FAF8F5]/40 hover:text-[#FAF8F5]/80 transition-colors cursor-pointer"
            aria-label="Scroll to story"
          >
            <span>Scroll</span>
            <ChevronDown size={14} className="animate-bounce" />
          </button>
        </section>

        {/* ================= 2. THE STORY ================= */}
        <section
          ref={storyRef}
          className="relative w-full py-20 sm:py-28 lg:py-36 px-6 sm:px-10 lg:px-20 bg-[#FAF8F5] border-b border-[#141414]/10"
        >
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16 items-start">
            <div className="lg:col-span-7">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#141414]/50 block mb-4">
                The Foundation
              </span>

              <h2 className="font-heading font-black text-2xl sm:text-4xl uppercase tracking-[0.12em] text-[#141414] mb-8 leading-snug">
                People care about animals. We make clothing that honors that connection.
              </h2>

              <blockquote className="my-10 pl-6 border-l-2 border-[#141414] py-1">
                <p className="font-serif italic text-xl sm:text-2xl text-[#141414] leading-relaxed">
                  &ldquo;Impact should not be something added after the business is built. It should be part of the way the business is built.&rdquo;
                </p>
              </blockquote>

              <div className="space-y-6 text-sm sm:text-base text-[#141414]/75 leading-relaxed font-normal">
                <p>
                  We start with heavyweight garments. Furever should never feel like a compromise — it should feel like something you genuinely love wearing, elevated by the story it carries.
                </p>
                <p>
                  Every piece is built on 240 GSM combed cotton with high-density printing, boxy tailoring, and animal graphics designed to endure.
                </p>
              </div>
            </div>

            <div className="lg:col-span-5 relative flex flex-col items-center">
              <div className="w-full aspect-[4/5] rounded-2xl bg-[#141414] p-8 flex items-center justify-center relative overflow-hidden shadow-lg">
                <FoxMark
                  stroke="#FAF8F5"
                  className="w-full max-w-[260px] opacity-80"
                  duration={2}
                />
                <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between text-[#FAF8F5]/60 text-[10px] font-mono tracking-widest uppercase">
                  <span>Furever Mark</span>
                  <span>Est. Originals</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 3. VISION ================= */}
        <section className="relative w-full py-20 sm:py-28 px-6 sm:px-10 lg:px-20 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#141414]/50 block mb-4">
              Looking Forward
            </span>

            <h2 className="font-heading font-black text-3xl sm:text-5xl uppercase tracking-[0.14em] text-[#141414] mb-6">
              Made From The Bond We Never Outgrow
            </h2>

            <p className="text-sm sm:text-base text-[#141414]/70 leading-relaxed max-w-xl mx-auto mb-10">
              Growing from signature streetwear tees into thoughtfully crafted lifestyle objects and companions.
            </p>

            <button
              type="button"
              onClick={() => navigate("/collections")}
              className="inline-flex items-center gap-2 rounded-full px-9 py-4 text-xs font-heading font-bold uppercase tracking-[0.14em] bg-[#141414] hover:bg-[#141414]/90 text-[#FAF8F5] transition-all shadow-md hover:shadow-lg cursor-pointer group"
            >
              <span>Explore Collection</span>
              <MoveRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}