import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, RotateCcw, Truck, HeartHandshake } from "lucide-react";

export default function OurPolicy() {
  const policies = [
    {
      icon: ShieldCheck,
      title: "240 GSM Heavyweight Build",
      description:
        "Engineered with 100% bio-washed combed cotton that retains structure wash after wash.",
    },
    {
      icon: Truck,
      title: "Fast Tracked Delivery",
      description:
        "Dispatched within 24 hours with live SMS tracking and express door-to-door delivery.",
    },
    {
      icon: RotateCcw,
      title: "Easy 7-Day Size Exchanges",
      description:
        "Wrong fit? Swap your size seamlessly with our frictionless reverse pickup service.",
    },
    {
      icon: HeartHandshake,
      title: "10% For Shelter Animals",
      description:
        "Every single order directly buys medical supplies and daily meals for stray animals.",
    },
  ];

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
            The FurEver Standard
          </p>

          <h2 className="font-heading font-black text-3xl sm:text-5xl uppercase tracking-tight text-neutral-950">
            WHY REBELS <span className="text-[#FF462D]">TRUST US</span>
          </h2>
        </motion.div>

        {/* Policy Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {policies.map((policy, index) => {
            const Icon = policy.icon;

            return (
              <motion.div
                key={policy.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-8 rounded-3xl bg-white border border-neutral-200/80 hover:border-neutral-900 transition-all duration-300 hover:shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center text-[#FF462D] mb-6">
                    <Icon size={24} strokeWidth={2} />
                  </div>

                  <h3 className="font-heading font-bold text-lg text-neutral-900 mb-2">
                    {policy.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
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