import { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const PILLARS = [
  { value: "ORIGINALS", label: "Animal Stories Made by Furever" },
  { value: "CUSTOMS", label: "Your Pet. Your Memory." },
];

export default function Hero() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const attemptPlay = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          // Handled silently: browser deferred autoplay
          console.warn("Autoplay deferred:", err);
        });
      }
    };

    attemptPlay();

    video.addEventListener("loadedmetadata", attemptPlay);
    video.addEventListener("canplay", attemptPlay);

    return () => {
      video.removeEventListener("loadedmetadata", attemptPlay);
      video.removeEventListener("canplay", attemptPlay);
    };
  }, []);

  // Staggered entrance animation variants for luxury editorial presentation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.18,
        delayChildren: shouldReduceMotion ? 0 : 0.2,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.1 : 0.9,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const taglineVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 22,
      filter: shouldReduceMotion ? "none" : "blur(4px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: shouldReduceMotion ? 0.1 : 0.9,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.1 : 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section className="hero-stage relative w-full bg-[#0E1719] text-[#FAF8F5] overflow-hidden">
      {/* ================= 1. FULL-WIDTH CINEMATIC HERO STAGE ================= */}
      <div className="relative w-full max-w-full min-w-0 min-h-[calc(100svh-56px)] sm:min-h-[calc(100svh-64px)] lg:min-h-0 lg:h-[calc(100vh-80px)] lg:max-h-[1080px] overflow-hidden bg-[#0E1719] flex flex-col justify-center items-center px-3 sm:px-6 py-4 sm:py-8 lg:p-0 lg:block">
        
        {/* VIDEO CONTAINER / STAGE */}
        <div className="relative w-full max-w-full sm:max-w-[560px] min-w-0 aspect-[16/9] flex items-center justify-center overflow-hidden lg:max-w-none lg:w-full lg:h-full lg:aspect-auto lg:absolute lg:inset-0">
          <motion.div
            initial={
              shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 1.04 }
            }
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: shouldReduceMotion ? 0.1 : 1.4,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="w-full h-full max-w-full flex items-center justify-center"
          >
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster="/images/furever-logo-white.png"
              disablePictureInPicture
              disableRemotePlayback
              tabIndex={-1}
              aria-hidden="true"
              className="hero-video w-full h-full max-w-full object-contain lg:object-cover object-center pointer-events-none select-none"
              style={{ objectPosition: "center" }}
            >
              {/* Exact target video: gemini_generated_video_3ee252b8_gwr_video_mvp (3).mp4 */}
              <source
                src="/videos/gemini_generated_video_3ee252b8_gwr_video_mvp%20(3).mp4"
                type="video/mp4"
              />
              <source
                src="/videos/gemini_generated_video_3ee252b8_gwr_video_mvp (3).mp4"
                type="video/mp4"
              />
              <source src="/videos/furever-hero.mp4" type="video/mp4" />
              <img
                src="/images/furever-logo-white.png"
                alt="Furever"
                className="w-36 h-auto object-contain opacity-70 mx-auto"
              />
            </video>
          </motion.div>

          {/* Top Edge Gradient Blend */}
          <div className="hero-edge-blend-top absolute inset-x-0 top-0 h-10 sm:h-16 lg:h-28 pointer-events-none z-10" />

          {/* Bottom Edge Gradient Blend */}
          <div className="hero-edge-blend-bottom absolute inset-x-0 bottom-0 h-14 sm:h-20 lg:h-48 pointer-events-none z-10" />

          {/* Side Edge Gradient Blend for mobile/tablet */}
          <div className="hero-edge-blend-sides absolute inset-0 pointer-events-none z-10 lg:hidden" />

          {/* Radial Vignette for Desktop immersion */}
          <div className="hero-vignette-radial hidden lg:block absolute inset-0 pointer-events-none z-10" />
        </div>

        {/* ================= 2. REFINED EDITORIAL TEXT OVERLAY (UNOBSTRUCTED) ================= */}
        <div className="relative z-20 w-full max-w-full min-w-0 flex flex-col items-center text-center mt-2 sm:mt-4 lg:mt-0 lg:absolute lg:inset-x-0 lg:bottom-12 pointer-events-none">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="pointer-events-auto flex flex-col items-center max-w-full sm:max-w-xl mx-auto w-full px-2"
          >
            {/* Wordmark */}
            <motion.h1
              variants={titleVariants}
              className="font-heading font-black text-2xl sm:text-3xl lg:text-5xl uppercase tracking-[0.22em] text-[#FAF8F5] mb-1 sm:mb-2 select-none drop-shadow-md"
            >
              FUREVER
            </motion.h1>

            {/* Tagline */}
            <motion.p
              variants={taglineVariants}
              className="font-serif italic text-xs sm:text-sm lg:text-base text-[#FAF8F5]/85 max-w-xs sm:max-w-md mb-4 sm:mb-6 leading-relaxed drop-shadow-sm"
            >
              &ldquo;Made from the bond we never outgrow.&rdquo;
            </motion.p>

            {/* Clean Functional CTAs */}
            <motion.div
              variants={buttonVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3.5 w-full max-w-[270px] sm:max-w-none mx-auto"
            >
              {/* Primary CTA */}
              <motion.button
                type="button"
                whileHover={shouldReduceMotion ? {} : { scale: 1.03, y: -2 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                onClick={() => navigate("/collections")}
                className="w-full sm:w-auto px-5 sm:px-8 py-3.5 rounded-full bg-[#FAF8F5] hover:bg-white text-[#141414] font-heading font-bold text-xs uppercase tracking-[0.12em] sm:tracking-[0.14em] transition-all shadow-lg hover:shadow-xl cursor-pointer flex items-center justify-center gap-2 group min-h-[44px]"
              >
                <span>Explore Collections</span>
                <ArrowRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-1 shrink-0"
                />
              </motion.button>

              {/* Secondary CTA */}
              <motion.button
                type="button"
                whileHover={shouldReduceMotion ? {} : { scale: 1.03, y: -2 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                onClick={() => navigate("/customs")}
                className="w-full sm:w-auto px-5 sm:px-7 py-3.5 rounded-full bg-[#141414]/60 hover:bg-[#141414]/90 border border-[#FAF8F5]/30 hover:border-[#FAF8F5]/80 text-[#FAF8F5] font-heading font-bold text-xs uppercase tracking-[0.12em] sm:tracking-[0.14em] transition-all cursor-pointer backdrop-blur-md shadow-sm min-h-[44px]"
              >
                Create Your Custom
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ================= 3. BRAND PILLARS ================= */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="w-full bg-[#FAF8F5] border-t border-[#141414]/10 py-5 sm:py-6 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
          {PILLARS.map((p) => (
            <div
              key={p.value}
              className="border-l border-[#141414]/25 pl-4 py-1"
            >
              <p className="font-heading font-black text-xs sm:text-sm text-[#141414] uppercase tracking-wider leading-none">
                {p.value}
              </p>
              <p className="text-[11px] sm:text-xs text-[#141414]/65 font-medium mt-1 tracking-wide">
                {p.label}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}