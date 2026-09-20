import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Heart,
  Star,
  ArrowRight,
  PawPrint,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Send,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { userDataContext } from "../context/UserContext.jsx";
import { authDataContext } from "../context/Authcontext.jsx";

export default function Feedback() {
  const navigate = useNavigate();

  const { userData } = useContext(userDataContext);
  const { serverUrl } = useContext(authDataContext);

  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);

  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();

    if (!userData) {
      navigate("/login", {
        state: {
          from: "/",
          message: "Please login to share your drop review.",
        },
      });
      return;
    }

    if (!feedback.trim() || rating === 0) {
      setErrorMessage("Please select a rating and write your thoughts.");
      return;
    }

    try {
      setSending(true);
      setErrorMessage("");

      const result = await axios.post(
        `${serverUrl}/api/feedback/send`,
        {
          name: userData.name,
          email: userData.email,
          feedback: feedback.trim(),
          rating,
        },
        {
          withCredentials: true,
        }
      );

      if (result.data.success) {
        setSubmitted(true);
        setFeedback("");
      } else {
        setErrorMessage(result.data.message || "Failed to submit feedback.");
      }
    } catch (error) {
      console.log("Feedback Error:", error);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="w-full bg-[#FAF8F5] py-20 sm:py-24 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-14 sm:mb-16"
        >
          <p className="font-heading text-xs font-bold uppercase tracking-[0.25em] text-[#FF462D] mb-3">
            Community & Culture
          </p>

          <h2 className="font-heading font-black text-3xl sm:text-5xl uppercase tracking-tight text-neutral-950">
            SHAPED BY THE <span className="text-[#FF462D]">PACK</span>
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-neutral-500 text-sm sm:text-base font-medium leading-relaxed">
            Your voice directs our fabric choices, future drop cuts, and local animal shelter funding.
          </p>
        </motion.div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT: FEEDBACK SUBMISSION CARD */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-6 bg-white rounded-3xl p-8 sm:p-10 border border-neutral-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center text-[#FF462D] mb-6">
                <MessageSquare size={22} />
              </div>

              <span className="font-heading text-xs font-bold uppercase tracking-widest text-neutral-400">
                Community Feedback
              </span>

              <h3 className="font-heading font-black text-2xl sm:text-3xl text-neutral-900 mt-2 mb-4 uppercase">
                Tell Us What You <span className="text-[#FF462D]">Think</span>
              </h3>

              <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed mb-6">
                Whether it's the weight of the collar, sleeve length, or a new colorway you want to see in Drop 02, we read every note.
              </p>

              {!submitted ? (
                <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                  {/* Rating Stars */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                      Rate The Experience:
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          className="p-1 cursor-pointer transition-transform hover:scale-110"
                        >
                          <Star
                            size={22}
                            className={`${
                              star <= (hoveredRating || rating)
                                ? "text-[#FF462D] fill-[#FF462D]"
                                : "text-neutral-200"
                            } transition-colors`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Feedback Textarea */}
                  <div>
                    <textarea
                      rows={4}
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder={
                        userData
                          ? "Write your honest feedback on fabric, fit, or the brand..."
                          : "Please sign in to write your feedback..."
                      }
                      className="w-full p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-900 focus:bg-white transition-all resize-none"
                    />
                  </div>

                  {errorMessage && (
                    <p className="text-xs text-red-500 font-semibold">{errorMessage}</p>
                  )}

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full py-4 rounded-full bg-[#0D0D11] hover:bg-[#FF462D] active:scale-[0.99] text-white font-heading text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {sending ? (
                      <span>Submitting...</span>
                    ) : (
                      <>
                        <span>Submit Feedback</span>
                        <Send size={14} />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="p-6 rounded-2xl bg-[#00A878]/10 border border-[#00A878]/20 flex items-center gap-3 text-[#00A878]">
                  <CheckCircle2 size={24} className="shrink-0" />
                  <div>
                    <h4 className="font-heading font-bold text-sm">Feedback Received!</h4>
                    <p className="text-xs text-neutral-600 mt-0.5">
                      Thank you for contributing to the future of FurEver.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* RIGHT: RESCUE MISSION SHOWCASE */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-6 bg-[#0D0D11] text-white rounded-3xl p-8 sm:p-10 border border-white/10 shadow-2xl flex flex-col justify-between relative overflow-hidden"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#FF462D]/15 blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#FF462D] mb-6">
                <Heart size={22} fill="currentColor" />
              </div>

              <span className="font-heading text-xs font-bold uppercase tracking-widest text-[#FF462D]">
                Mission & Animal Welfare
              </span>

              <h3 className="font-heading font-black text-2xl sm:text-3xl text-white mt-2 mb-4 uppercase">
                WEAR GOOD. <span className="text-[#FF462D]">DO GOOD.</span>
              </h3>

              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-8">
                In India, over 60 million stray dogs fight hunger and traffic injuries every day. We created FurEver to bridge the gap between elevated streetwear and tangible compassion.
              </p>

              {/* Impact Metrics Box */}
              <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FF462D]/20 flex items-center justify-center text-[#FF462D] shrink-0">
                    <PawPrint size={18} />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-sm text-white">
                      10% Direct Donation
                    </h4>
                    <p className="text-xs text-neutral-400">
                      Verified quarterly disbursements to verified local shelter funds.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-[#00E599]/20 flex items-center justify-center text-[#00E599] shrink-0">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-sm text-white">
                      100% Cruelty-Free Supply Chain
                    </h4>
                    <p className="text-xs text-neutral-400">
                      Zero animal byproducts, certified vegan dyes, and ethical worker wages.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Mission & Drops */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate("/about")}
                  className="flex-1 py-4 rounded-full bg-[#FF462D] hover:bg-[#E03B24] active:scale-[0.99] text-white font-heading text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-xl shadow-[#FF462D]/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Read The Full Mission</span>
                  <ArrowRight size={14} />
                </button>

                <button
                  onClick={() => navigate("/collections")}
                  className="py-4 px-6 rounded-full bg-white/5 hover:bg-white/10 text-white font-heading text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center cursor-pointer"
                >
                  Support With A Drop
                </button>
              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}