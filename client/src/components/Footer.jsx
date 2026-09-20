import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  ArrowRight,
  PawPrint,
  Heart,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { FaInstagram, FaTwitter, FaFacebookF } from "react-icons/fa";
import paws from "../assets/paws.png";

export default function Footer() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <footer className="w-full bg-[#0D0D11] text-white border-t border-white/10 overflow-hidden">
      
      {/* ================= TOP NEWSLETTER & MANIFESTO ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center pb-16 border-b border-white/10">
          
          {/* Brand Manifesto */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold uppercase tracking-widest text-[#FF462D] mb-4">
              <Sparkles size={12} />
              <span>Ethical Streetwear Label</span>
            </div>

            <h3 className="font-heading font-black text-3xl sm:text-5xl uppercase tracking-tight leading-[1.05] mb-4">
              NEVER MISS A <span className="text-[#FF462D]">DROP</span>.
            </h3>

            <p className="text-neutral-400 text-sm sm:text-base max-w-xl leading-relaxed">
              Our genesis batches sell out fast. Join the FurEver VIP circle to get password-protected early drop access 2 hours before the public release.
            </p>
          </div>

          {/* Newsletter Form */}
          <div className="lg:col-span-5">
            {!subscribed ? (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="relative flex items-center">
                  <Mail size={18} className="absolute left-4 text-neutral-400" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email for VIP drop access..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-32 py-4 rounded-full bg-white/5 border border-white/15 text-white placeholder-neutral-500 text-xs sm:text-sm font-medium outline-none focus:border-[#FF462D] focus:ring-2 focus:ring-[#FF462D]/20 transition-all"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 px-5 py-2.5 rounded-full bg-[#FF462D] hover:bg-[#E03B24] active:scale-[0.98] text-white font-heading text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md"
                  >
                    Join
                  </button>
                </div>
                <p className="text-[11px] text-neutral-500 pl-4">
                  No spam. Just early passwords and drop countdowns. Unsubscribe anytime.
                </p>
              </form>
            ) : (
              <div className="p-4 rounded-2xl bg-[#00E599]/10 border border-[#00E599]/20 text-[#00E599] flex items-center gap-3">
                <CheckCircle2 size={20} className="shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  You're on the list! Watch your inbox for Drop 02 early access.
                </span>
              </div>
            )}
          </div>

        </div>

        {/* ================= LINK COLUMNS ================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 py-16">
          
          {/* Column 1: Brand Info */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <img src={paws} alt="FurEver" className="w-8 h-8 object-contain" />
              <span className="font-heading font-black text-xl uppercase tracking-tight">
                FUR<span className="text-[#FF462D]">EVER</span>
              </span>
            </Link>

            <p className="text-xs text-neutral-400 leading-relaxed">
              India's premier purpose-driven apparel label. Crafted for rebels, dedicated to animal rescue.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <div className="w-2 h-2 rounded-full bg-[#00E599] animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                Drop 01 Live Now
              </span>
            </div>
          </div>

          {/* Column 2: Collections & Drops */}
          <div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-widest text-white mb-4">
              Archive & Drops
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link to="/collections" className="hover:text-[#FF462D] transition-colors">
                  Genesis Drop 01
                </Link>
              </li>
              <li>
                <Link to="/collections" className="hover:text-[#FF462D] transition-colors">
                  Heavyweight Tees (240 GSM)
                </Link>
              </li>
              <li>
                <Link to="/collections" className="hover:text-[#FF462D] transition-colors">
                  Upcoming Drop 02 Teasers
                </Link>
              </li>
              <li>
                <Link to="/collections" className="hover:text-[#FF462D] transition-colors">
                  Bestsellers Roster
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Brand & Impact */}
          <div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-widest text-white mb-4">
              The Brand
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link to="/about" className="hover:text-[#FF462D] transition-colors">
                  The FurEver Story
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#FF462D] transition-colors">
                  10% Shelter Rescue Fund
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#FF462D] transition-colors">
                  Contact & Studio
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-[#FF462D] transition-colors">
                  Track Your Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Guarantees */}
          <div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-widest text-white mb-4">
              The Standard
            </h4>
            <div className="space-y-3 text-xs text-neutral-400">
              <div className="flex items-center gap-2 text-neutral-300">
                <ShieldCheck size={16} className="text-[#FF462D]" />
                <span className="font-medium">100% Bio-Washed Cotton</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-300">
                <Heart size={15} className="text-[#FF462D]" fill="currentColor" />
                <span className="font-medium">Zero Animal Testing</span>
              </div>
              <p className="text-[11px] text-neutral-500 pt-2 leading-relaxed">
                Secure 256-bit encrypted checkout via Razorpay with all major cards, UPI, and Cash on Delivery.
              </p>
            </div>
          </div>

        </div>

        {/* ================= BOTTOM COPYRIGHT BAR ================= */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} FurEver Studio. All Rights Reserved.</p>
          <div className="flex items-center gap-6 text-neutral-400 text-xs">
            <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-white transition-colors cursor-pointer">Shipping & Returns</span>
          </div>
        </div>

      </div>
    </footer>
  );
}