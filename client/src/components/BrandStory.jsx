import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Layers,
  Scissors,
  CheckCircle2,
  Mail,
  X,
  Send,
} from "lucide-react";

const NGO_PARTNERS = [
  {
    name: "Voice for Strays Trust",
    city: "Bengaluru",
    focus: "Emergency Canine Trauma & Feeding Drives",
    impact: "4,200+ Meals Funded",
    badge: "Verified NGO Partner",
  },
  {
    name: "Paws & Care Foundation",
    city: "Mumbai / Pune",
    focus: "Stray Sterilization & Anti-Rabies Vaccinations",
    impact: "1,150+ Sterilizations Sponsored",
    badge: "Verified NGO Partner",
  },
  {
    name: "ResQ Wildlife & Animal Aid",
    city: "Delhi NCR",
    focus: "Ambulance Care & Shelter Winter Blankets",
    impact: "820+ Rescues Treated",
    badge: "Verified NGO Partner",
  },
];

const ANATOMY_SPECS = [
  {
    title: "240 GSM French Terry",
    desc: "Substantial heavyweight drape that retains structured boxy silhouette, never clinging or shrinking.",
    icon: Layers,
  },
  {
    title: "Pre-Shrunk Bio-Washed",
    desc: "Natural enzyme-washed 100% combed cotton for velvet softness and wash-cycle resilience.",
    icon: Scissors,
  },
  {
    title: "Vegan Water-Based Inks",
    desc: "Zero plastisol petroleum runoff. Crack-resistant breathable prints safe for humans and the planet.",
    icon: ShieldCheck,
  },
  {
    title: "10% Direct NGO Allocation",
    desc: "Audited 10% net profit quarterly transfers published transparently for our community.",
    icon: Heart,
  },
];

export default function BrandStory() {
  const navigate = useNavigate();
  const [partnerModalOpen, setPartnerModalOpen] = useState(false);
  const [ngoForm, setNgoForm] = useState({ orgName: "", email: "", city: "", message: "" });
  const [ngoSubmitted, setNgoSubmitted] = useState(false);

  const handleNgoSubmit = (e) => {
    e.preventDefault();
    setNgoSubmitted(true);
    setTimeout(() => {
      setNgoSubmitted(false);
      setPartnerModalOpen(false);
      setNgoForm({ orgName: "", email: "", city: "", message: "" });
    }, 2500);
  };

  return (
    <div id="ngo-impact" className="w-full bg-[#FAF6F2] text-[#2B2730] py-16 sm:py-24 border-t border-[#EDE4DD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ================= 1. SOCIAL MISSION IMPACT CARD (Davy's Gray #58545F & Light Coral #DC8E90) ================= */}
        <div className="rounded-[32px] bg-[#58545F] text-white p-8 sm:p-12 lg:p-16 shadow-2xl relative overflow-hidden mb-20">
          {/* Subtle Warm Amber / Coral Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#DC8E90]/20 blur-[120px] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column: Impact Manifesto */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 text-[#FFC5A6] text-[10px] font-extrabold uppercase tracking-widest mb-4">
                <Heart size={12} fill="currentColor" />
                <span>AUTHENTIC SOCIAL IMPACT</span>
              </div>

              <h2 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl uppercase tracking-tighter leading-[0.98] mb-6 text-white">
                FASHION WITH <br />
                <span className="text-[#FDAC98]">A PURPOSE.</span>
              </h2>

              <p className="text-neutral-200 text-sm sm:text-base leading-relaxed mb-6 font-medium">
                10% of our overall net profit is donated directly to grassroots animal welfare NGOs and verified rescue shelters. We believe streetwear should make you look good, feel good, and tangibly support the voiceless dogs and cats roaming our city streets.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/15">
                <div>
                  <p className="font-heading font-black text-2xl sm:text-3xl text-[#FFC5A6]">10%</p>
                  <p className="text-[11px] text-neutral-300 uppercase font-semibold">Net Profit Donated</p>
                </div>
                <div>
                  <p className="font-heading font-black text-2xl sm:text-3xl text-[#FFC5A6]">6,000+</p>
                  <p className="text-[11px] text-neutral-300 uppercase font-semibold">Meals Funded</p>
                </div>
                <div>
                  <p className="font-heading font-black text-2xl sm:text-3xl text-[#FFC5A6]">100%</p>
                  <p className="text-[11px] text-neutral-300 uppercase font-semibold">Audited Transparency</p>
                </div>
              </div>
            </div>

            {/* Right Column: Fast Partnership CTA Card */}
            <div className="lg:col-span-5 bg-white text-[#2B2730] p-6 sm:p-8 rounded-3xl border border-[#EDE4DD] shadow-xl">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#A97882] block mb-1">
                Grassroots Alliances
              </span>
              <h3 className="font-heading font-black text-xl uppercase tracking-tight text-[#2B2730] mb-3">
                Are you an Animal Welfare NGO?
              </h3>
              <p className="text-xs text-[#58545F] leading-relaxed mb-6 font-medium">
                We continuously onboard local animal shelters, canine sterilizers, and rescue organizations across Indian metros for our quarterly grant distributions.
              </p>

              <button
                type="button"
                onClick={() => setPartnerModalOpen(true)}
                className="w-full py-3.5 px-6 rounded-full bg-[#58545F] hover:bg-[#DC8E90] text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Partner With FurEver</span>
                <ArrowRight size={15} />
              </button>
            </div>

          </div>
        </div>

        {/* ================= 2. PARTNER NGOS STRIP ================= */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#A97882] block mb-1">
              On-Ground Rescue Network
            </span>
            <h3 className="font-heading font-black text-2xl sm:text-3xl uppercase tracking-tight text-[#2B2730]">
              Partner Shelters You Support 🐾
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {NGO_PARTNERS.map((ngo) => (
              <div
                key={ngo.name}
                className="p-6 rounded-3xl bg-white border border-[#EDE4DD] hover:border-[#DC8E90] transition-all shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#58545F] bg-[#FAF6F2] px-2.5 py-1 rounded-full border border-[#EDE4DD]">
                      📍 {ngo.city}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {ngo.badge}
                    </span>
                  </div>

                  <h4 className="font-heading font-black text-base text-[#2B2730] uppercase tracking-tight mb-2">
                    {ngo.name}
                  </h4>

                  <p className="text-xs text-[#58545F] leading-relaxed font-medium">
                    {ngo.focus}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#EDE4DD] flex items-center gap-2 text-xs font-bold text-[#A97882]">
                  <Sparkles size={14} className="text-[#DC8E90]" />
                  <span>{ngo.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= 3. 240 GSM CRAFTSMANSHIP ANATOMY ================= */}
        <div>
          <div className="text-center mb-10">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#A97882] block mb-1">
              Streetwear Engineering
            </span>
            <h3 className="font-heading font-black text-2xl sm:text-3xl uppercase tracking-tight text-[#2B2730]">
              The 240 GSM Heavyweight Standard 👕
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ANATOMY_SPECS.map((spec) => {
              const Icon = spec.icon;
              return (
                <div
                  key={spec.title}
                  className="p-6 rounded-3xl bg-white border border-[#EDE4DD] hover:border-[#DC8E90] transition-all shadow-2xs flex flex-col"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#FAF6F2] border border-[#EDE4DD] flex items-center justify-center text-[#DC8E90] mb-4">
                    <Icon size={22} strokeWidth={2.2} />
                  </div>

                  <h4 className="font-heading font-black text-sm uppercase tracking-wider text-[#2B2730] mb-2">
                    {spec.title}
                  </h4>

                  <p className="text-xs text-[#58545F] leading-relaxed font-medium">
                    {spec.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ================= NGO INQUIRY MODAL ================= */}
      <AnimatePresence>
        {partnerModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPartnerModalOpen(false)}
              className="fixed inset-0 bg-[#2B2730]/60 backdrop-blur-xs cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="relative w-full max-w-lg bg-white rounded-3xl border border-[#EDE4DD] shadow-2xl p-6 sm:p-8 z-10 text-[#2B2730]"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#EDE4DD] mb-6">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#DC8E90]">
                    Join Our Mission
                  </span>
                  <h3 className="font-heading font-black text-lg uppercase tracking-tight text-[#2B2730]">
                    NGO Partnership Inquiry
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setPartnerModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#FAF6F2] hover:bg-[#EDE4DD] flex items-center justify-center text-[#58545F] hover:text-[#2B2730] cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {!ngoSubmitted ? (
                <form onSubmit={handleNgoSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-[#58545F] block mb-1">
                      Organization / Shelter Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={ngoForm.orgName}
                      onChange={(e) => setNgoForm({ ...ngoForm, orgName: e.target.value })}
                      placeholder="e.g. Hope Animal Shelter"
                      className="w-full px-4 py-3 rounded-2xl bg-[#FAF6F2] border border-[#EDE4DD] text-xs font-bold text-[#2B2730] placeholder-[#7E7785] focus:outline-none focus:border-[#58545F]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-[#58545F] block mb-1">Official Email *</label>
                      <input
                        type="email"
                        required
                        value={ngoForm.email}
                        onChange={(e) => setNgoForm({ ...ngoForm, email: e.target.value })}
                        placeholder="contact@shelter.org"
                        className="w-full px-4 py-3 rounded-2xl bg-[#FAF6F2] border border-[#EDE4DD] text-xs font-bold text-[#2B2730] placeholder-[#7E7785] focus:outline-none focus:border-[#58545F]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#58545F] block mb-1">City / State *</label>
                      <input
                        type="text"
                        required
                        value={ngoForm.city}
                        onChange={(e) => setNgoForm({ ...ngoForm, city: e.target.value })}
                        placeholder="Bengaluru, KA"
                        className="w-full px-4 py-3 rounded-2xl bg-[#FAF6F2] border border-[#EDE4DD] text-xs font-bold text-[#2B2730] placeholder-[#7E7785] focus:outline-none focus:border-[#58545F]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#58545F] block mb-1">
                      Current Focus Areas & Stray Intake *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={ngoForm.message}
                      onChange={(e) => setNgoForm({ ...ngoForm, message: e.target.value })}
                      placeholder="Tell us about your ongoing vaccination, feeding, or rescue programs..."
                      className="w-full p-3 rounded-2xl bg-[#FAF6F2] border border-[#EDE4DD] text-xs font-bold text-[#2B2730] placeholder-[#7E7785] focus:outline-none focus:border-[#58545F]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-full bg-[#58545F] hover:bg-[#DC8E90] text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Submit Inquiry for Review</span>
                    <Send size={14} />
                  </button>
                </form>
              ) : (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center space-y-2">
                  <CheckCircle2 size={32} className="mx-auto text-emerald-700" />
                  <p className="font-heading font-bold text-sm uppercase">Inquiry Received!</p>
                  <p className="text-xs text-emerald-700">
                    Our impact coordinator will review your shelter details and respond within 3 business days.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
