import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Star,
  ArrowRight,
  CheckCircle2,
  Sparkles,
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
          message: "Please login to share your pet review.",
        },
      });
      return;
    }

    if (!feedback.trim() || rating === 0) {
      setErrorMessage("Please select a paw rating and write your feedback.");
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
        setErrorMessage(result.data.message || "Failed to submit review.");
      }
    } catch (error) {
      console.error("Feedback error:", error);
      setErrorMessage(
        error.response?.data?.message || "Failed to submit feedback. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="w-full bg-[#FAF8F5] py-16 sm:py-24 border-t border-[#EAE4DC]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-[#EAE4DC] p-8 sm:p-12 shadow-md relative overflow-hidden">
          
          {/* Subtle decoration */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#EAF2EE] blur-3xl pointer-events-none" />

          <div className="text-center max-w-xl mx-auto mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF3D6] text-[#8C6212] text-xs font-bold mb-3">
              <span className="text-sm">🐾</span>
              <span>The Sniff Test Community</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#231F1D] tracking-tight">
              Tell us what your pet thinks!
            </h2>
            <p className="text-xs sm:text-sm text-[#6E675F] mt-2">
              Did your dog love the harness? Is your cat snoozing in our cozy knit? We read every single review.
            </p>
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10"
            >
              <div className="w-16 h-16 rounded-full bg-[#EAF2EE] text-[#3D6857] flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="font-display font-bold text-2xl text-[#231F1D] mb-2">
                Thank you for the review! 🐾
              </h3>
              <p className="text-sm text-[#6E675F] max-w-md mx-auto mb-6">
                Your feedback helps us design even better essentials for wagging tails everywhere.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2.5 rounded-full bg-[#3D6857] text-white text-xs font-bold hover:bg-[#2D5042] transition-colors"
              >
                Submit Another Review
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleFeedbackSubmit} className="space-y-6">
              
              {/* Star / Paw Rating */}
              <div className="flex flex-col items-center justify-center gap-2">
                <span className="text-xs font-bold text-[#6E675F] uppercase tracking-wider">
                  Select Paws Rating:
                </span>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="p-1 cursor-pointer transition-transform hover:scale-125"
                    >
                      <Star
                        size={28}
                        className={
                          (hoveredRating || rating) >= star
                            ? "text-amber-400 fill-amber-400"
                            : "text-[#D8D0C5]"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback Textarea */}
              <div>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Tell us about the fit, fabric, your pet's breed, and how much they loved it..."
                  rows={4}
                  className="w-full rounded-2xl bg-[#FAF8F5] border border-[#EAE4DC] p-4 text-sm text-[#231F1D] placeholder-[#8E867E] focus:outline-none focus:border-[#3D6857] focus:ring-2 focus:ring-[#3D6857]/20 transition-all resize-none"
                />
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium text-center">
                  {errorMessage}
                </div>
              )}

              {/* Submit CTA */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={sending}
                  className="pill-button px-8 py-3.5 rounded-full bg-[#3D6857] hover:bg-[#2D5042] text-white font-bold text-sm transition-all shadow-md shadow-[#3D6857]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {sending ? (
                    <span>Submitting Review...</span>
                  ) : (
                    <>
                      <span>Submit Pet Review 🐾</span>
                      <Send size={15} />
                    </>
                  )}
                </button>
              </div>

              {!userData && (
                <p className="text-center text-xs text-[#8E867E]">
                  You will be prompted to sign in so your pet's review is verified.
                </p>
              )}
            </form>
          )}

        </div>
      </div>
    </section>
  );
}