import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, RotateCcw, Truck, HeartHandshake, Sparkles, MessageCircle } from "lucide-react";

export default function OurPolicy() {
  const policies = [
    {
      icon: ShieldCheck,
      title: "240 GSM Heavyweight Terry",
      description:
        "100% combed cotton with dense French Terry loop knit. Pre-shrunk and bio-washed for lasting boxy streetwear drape.",
    },
    {
      icon: HeartHandshake,
      title: "10% Net Profit NGO Grant",
      description:
        "10% of our net profit is donated to vetted animal rescue shelters for vaccinations, medical treatment, and feeding programs.",
    },
    {
      icon: MessageCircle,
      title: "24h WhatsApp Art Proof",
      description:
        "Custom Pet Tees get a hand-rendered vector proof sent directly to your WhatsApp within 24h before printing.",
    },
    {
      icon: RotateCcw,
      title: "7-Day Easy Size Exchanges",
      description:
        "Streetwear should fit just right. If you want a more slouchy or fitted drape, exchange sizes completely hassle-free.",
    },
  ];

  return (
    <section className="w-full bg-[#F5EFEB] py-16 sm:py-24 border-t border-[#EDE4DD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#58545F] text-white text-[11px] font-black uppercase tracking-wider mb-3 shadow-xs">
            <Sparkles size={13} className="text-[#FDAC98]" />
            <span>The Furever Guarantee</span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-[#2B2730]">
            Streetwear crafted with{" "}
            <span className="text-[#DC8E90]">
              purpose.
            </span>
          </h2>
        </motion.div>

        {/* Policy Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {policies.map((policy, index) => {
            const Icon = policy.icon;

            return (
              <motion.div
                key={policy.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-7 rounded-3xl bg-white border border-[#EDE4DD] hover:border-[#DC8E90] transition-all duration-300 shadow-xs hover:shadow-md hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#FAF6F2] border border-[#EDE4DD] flex items-center justify-center text-[#DC8E90] mb-5">
                    <Icon size={22} strokeWidth={2.2} />
                  </div>

                  <h3 className="font-display font-black text-sm uppercase tracking-wider text-[#2B2730] mb-2">
                    {policy.title}
                  </h3>

                  <p className="text-xs text-[#58545F] leading-relaxed font-medium">
                    {policy.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}