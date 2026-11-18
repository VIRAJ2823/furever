import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export default function Feedback() {
  return (
    <section className="w-full bg-[#FAF8F5] py-20 sm:py-28 border-t border-[#141414]/10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col items-center text-center p-10 sm:p-14 rounded-3xl bg-white border border-[#141414]/10 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] flex items-center justify-center text-[#141414] mb-5 border border-[#141414]/10">
            <MessageCircle size={22} />
          </div>

          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#141414]/50 mb-3">
            Community Voices
          </span>

          <h2 className="font-heading font-black text-2xl sm:text-4xl uppercase tracking-tight text-[#141414]">
            FEEDBACKS COMING SOON
          </h2>

          <p className="text-xs sm:text-sm text-[#141414]/65 font-medium mt-3 max-w-md leading-relaxed">
            We're looking forward to hearing from you. Genuine companion stories and verified customer reviews will appear here soon.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
