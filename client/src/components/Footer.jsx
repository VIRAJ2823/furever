import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  ArrowRight,
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
    <footer className="w-full bg-[#2B2730] text-[#FAF6F2] border-t border-[#3D3845] overflow-hidden">
      
      {/* ================= TOP NEWSLETTER & VIP ACCESS ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center pb-16 border-b border-[#3D3845]">
          
          {/* Brand Promise */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[11px] font-black uppercase tracking-wider text-[#FFC5A6] mb-4">
              <Sparkles size={13} className="text-[#FDAC98]" />
              <span>VIP STREETWEAR DROP ACCESS</span>
            </div>

            <h3 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-white mb-4">
              Get 15% off Drop 001 +{" "}
              <span className="text-[#DC8E90]">
                Drop 002 early alert.
              </span>
            </h3>

            <p className="text-[#D3CAD7] text-xs sm:text-sm max-w-xl leading-relaxed font-medium">
              Join 15,000+ streetwear creators and animal lovers. Enjoy early drop allocations, behind-the-scenes print shop previews, and quarterly NGO rescue impact reports.
            </p>
          </div>

          {/* Newsletter Form */}
          <div className="lg:col-span-5">
            {!subscribed ? (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="relative flex items-center">
                  <Mail size={18} className="absolute left-4 text-[#A97882]" />
                  <input
                    type="email"
                    required
                    placeholder="Enter email for 15% off drop code..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-32 py-4 rounded-full bg-[#393441] border border-[#4E4857] text-white placeholder-[#A97882] text-xs sm:text-sm font-medium outline-none focus:border-[#DC8E90] transition-all"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 px-6 py-2.5 rounded-full bg-[#DC8E90] hover:bg-[#A97882] active:scale-[0.98] text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                  >
                    Get 15% 🐾
                  </button>
                </div>
                <p className="text-[11px] text-[#A97882] pl-4">
                  Zero spam. Strictly heavy streetwear drops and rescue impact updates.
                </p>
              </form>
            ) : (
              <div className="p-4 rounded-2xl bg-[#DC8E90]/20 border border-[#DC8E90]/40 text-white flex items-center gap-3">
                <CheckCircle2 size={20} className="shrink-0 text-[#DC8E90]" />
                <span className="text-xs font-bold">
                  You're on the VIP drop list! Check your inbox for your 15% discount code.
                </span>
              </div>
            )}
          </div>

        </div>

        {/* ================= LINK COLUMNS ================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 py-16">
          
          {/* Column 1: Brand Info */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center p-1.5 shadow-xs">
                <img src={paws} alt="FurEver" className="w-full h-full object-contain" />
              </div>
              <span className="font-display font-black text-xl text-white tracking-tight uppercase">
                FUR<span className="text-[#DC8E90]">EVER</span>
              </span>
            </Link>

            <p className="text-xs text-[#D3CAD7] leading-relaxed font-medium">
              240 GSM Heavyweight Indian Streetwear & Custom Memory Line Art Tees. 10% of our net profit directly funds vetted animal rescue NGO partners.
            </p>

            <div className="flex items-center gap-2.5 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#393441] border border-[#4E4857] flex items-center justify-center text-[#D3CAD7] hover:text-[#DC8E90] hover:border-[#DC8E90] transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram size={15} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#393441] border border-[#4E4857] flex items-center justify-center text-[#D3CAD7] hover:text-[#DC8E90] hover:border-[#DC8E90] transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter size={15} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#393441] border border-[#4E4857] flex items-center justify-center text-[#D3CAD7] hover:text-[#DC8E90] hover:border-[#DC8E90] transition-colors"
                aria-label="Facebook"
              >
                <FaFacebookF size={15} />
              </a>
            </div>
          </div>

          {/* Column 2: Drops & Apparel */}
          <div>
            <h4 className="font-display font-black text-xs uppercase tracking-wider text-white mb-4">
              Street Drops
            </h4>
            <ul className="space-y-2.5 text-xs text-[#D3CAD7] font-medium">
              <li>
                <Link to="/collections" className="hover:text-[#DC8E90] transition-colors">
                  🔥 Drop 001: Dino Series
                </Link>
              </li>
              <li>
                <Link to="/product/fur-custom-01" className="hover:text-[#DC8E90] transition-colors">
                  🎨 Custom Pet Line Art Tee
                </Link>
              </li>
              <li>
                <Link to="/product/fur-custom-02" className="hover:text-[#DC8E90] transition-colors">
                  ⚡ Custom Pet Stencil Art Tee
                </Link>
              </li>
              <li>
                <Link to="/collections?category=Unisex" className="hover:text-[#DC8E90] transition-colors">
                  👕 240 GSM Oversized Tees
                </Link>
              </li>
              <li>
                <Link to="/collections" className="hover:text-[#DC8E90] transition-colors">
                  ✨ Drop 002 Teasers (Coming Soon)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: The Mission & Support */}
          <div>
            <h4 className="font-display font-black text-xs uppercase tracking-wider text-white mb-4">
              The Movement
            </h4>
            <ul className="space-y-2.5 text-xs text-[#D3CAD7] font-medium">
              <li>
                <Link to="/about" className="hover:text-[#DC8E90] transition-colors">
                  🐾 10% NGO Impact Report
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#DC8E90] transition-colors">
                  👕 240 GSM French Terry Spec
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#DC8E90] transition-colors">
                  📲 WhatsApp Order Support
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-[#DC8E90] transition-colors">
                  📦 Track My Street Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Furever Guarantees */}
          <div>
            <h4 className="font-display font-black text-xs uppercase tracking-wider text-white mb-4">
              Our Guarantees
            </h4>
            <div className="space-y-3 text-xs text-[#D3CAD7] font-medium">
              <div className="flex items-start gap-2">
                <ShieldCheck size={16} className="text-[#DC8E90] shrink-0 mt-0.5" />
                <span>240 GSM Combed French Terry Cotton</span>
              </div>
              <div className="flex items-start gap-2">
                <Heart size={16} className="text-[#DC8E90] shrink-0 mt-0.5 fill-[#DC8E90]" />
                <span>10% Net Profit directly to Animal NGOs</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-sm">🔄</span>
                <span>7-Day Easy Streetwear Size Swaps</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-sm">🎨</span>
                <span>24h WhatsApp Proof before printing</span>
              </div>
            </div>
          </div>

        </div>

        {/* ================= BOTTOM BAR ================= */}
        <div className="pt-8 border-t border-[#3D3845] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A97882]">
          <p>© 2026 FUREVER APPAREL. Heavyweight 240 GSM Streetwear With A Social Mission.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-[#DC8E90] cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#DC8E90] cursor-pointer">Terms of Service</span>
            <span className="hover:text-[#DC8E90] cursor-pointer">Size Guide</span>
          </div>
        </div>

      </div>
    </footer>
  );
}