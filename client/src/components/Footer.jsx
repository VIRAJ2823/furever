import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Heart,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import FureverLogo from "./FureverLogo";

export default function Footer() {
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
    <footer className="w-full bg-[#0E1D61] text-[#E8E0D2] border-t border-[#B89A5A]/30 overflow-hidden">
      
      {/* ================= TOP NEWSLETTER & VIP ACCESS ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center pb-16 border-b border-[#B89A5A]/20">
          
          {/* Brand Promise */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-[#B89A5A]/30 text-[11px] font-black uppercase tracking-wider text-[#B89A5A] mb-4">
              <Sparkles size={13} className="text-[#B89A5A]" />
              <span>THE FUREVER COMMUNITY</span>
            </div>

            <h3 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-white mb-4">
              Join the family.{" "}
              <span className="text-[#B89A5A]">
                Next Drop early access.
              </span>
            </h3>

            <p className="text-[#E8E0D2]/80 text-xs sm:text-sm max-w-xl leading-relaxed font-medium">
              Join thousands of animal lovers and pet parents across India. Receive advance access to new drop allocations, behind-the-scenes artist sketches, and quarterly animal welfare contribution reports.
            </p>
          </div>

          {/* Newsletter Form */}
          <div className="lg:col-span-5">
            {!subscribed ? (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="relative flex items-center">
                  <Mail size={18} className="absolute left-4 text-[#B89A5A]" />
                  <input
                    type="email"
                    required
                    placeholder="Enter email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-32 py-4 rounded-full bg-white/10 border border-[#B89A5A]/40 text-white placeholder-[#E8E0D2]/50 text-xs sm:text-sm font-medium outline-none focus:border-[#B89A5A] transition-all"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 px-6 py-2.5 rounded-full bg-[#B89A5A] hover:bg-[#9E8246] active:scale-[0.98] text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                  >
                    Subscribe 🐾
                  </button>
                </div>
                <p className="text-[11px] text-[#E8E0D2]/60 pl-4">
                  Zero spam. Strictly new drop previews and rescue mission updates.
                </p>
              </form>
            ) : (
              <div className="p-4 rounded-2xl bg-[#B89A5A]/20 border border-[#B89A5A]/40 text-white flex items-center gap-3">
                <CheckCircle2 size={20} className="shrink-0 text-[#B89A5A]" />
                <span className="text-xs font-bold">
                  Welcome to the FurEver family! Check your inbox for upcoming drop details.
                </span>
              </div>
            )}
          </div>

        </div>

        {/* ================= LINK COLUMNS ================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 py-16">
          
          {/* Column 1: Brand Info */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link to="/" className="inline-block" aria-label="Furever Home">
              <FureverLogo variant="light" size="md" />
            </Link>

            <p className="text-xs text-[#E8E0D2]/80 leading-relaxed font-medium">
              An emerging lifestyle brand built around the bond people share with animals. 10% of our net profit directly supports animal welfare and rescue programs.
            </p>

            <div className="flex items-center gap-2.5 pt-2">
              <a
                href="https://www.instagram.com/furever.in?stkn=MTVrYmNmOGh4OWM3aQ=="
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 border border-[#B89A5A]/30 flex items-center justify-center text-[#E8E0D2] hover:text-[#B89A5A] hover:border-[#B89A5A] transition-all"
                aria-label="Instagram"
              >
                <FaInstagram size={17} />
              </a>
            </div>
          </div>

          {/* Column 2: The Collections */}
          <div>
            <h4 className="font-heading font-black text-xs uppercase tracking-wider text-white mb-4">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-[#E8E0D2]/80 font-medium">
              <li>
                <Link to="/originals" className="hover:text-[#B89A5A] transition-colors">
                  ✨ Furever Originals
                </Link>
              </li>
              <li>
                <Link to="/customs" className="hover:text-[#B89A5A] transition-colors">
                  🎨 Furever Customs
                </Link>
              </li>
              <li>
                <Link to="/product/fur-custom-01" className="hover:text-[#B89A5A] transition-colors">
                  🐾 Custom Pet Line Art Tee
                </Link>
              </li>
              <li>
                <Link to="/product/fur-custom-02" className="hover:text-[#B89A5A] transition-colors">
                  ⚡ Custom Pet Stencil Art Tee
                </Link>
              </li>
              <li>
                <Link to="/originals" className="hover:text-[#B89A5A] transition-colors">
                  ⏳ Drop 002 (Arriving Soon)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: The Mission & Support */}
          <div>
            <h4 className="font-heading font-black text-xs uppercase tracking-wider text-white mb-4">
              The Brand
            </h4>
            <ul className="space-y-2.5 text-xs text-[#E8E0D2]/80 font-medium">
              <li>
                <Link to="/about" className="hover:text-[#B89A5A] transition-colors">
                  📖 Our Story & Philosophy
                </Link>
              </li>
              <li>
                <Link to="/about#contribution" className="hover:text-[#B89A5A] transition-colors">
                  🐾 10% Animal Welfare Allocation
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#B89A5A] transition-colors">
                  📲 Contact & Inquiries
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-[#B89A5A] transition-colors">
                  📦 Track My Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Guarantees */}
          <div>
            <h4 className="font-heading font-black text-xs uppercase tracking-wider text-white mb-4">
              Our Commitments
            </h4>
            <div className="space-y-3 text-xs text-[#E8E0D2]/80 font-medium">
              <div className="flex items-start gap-2">
                <ShieldCheck size={16} className="text-[#B89A5A] shrink-0 mt-0.5" />
                <span>Heavyweight Combed French Terry Cotton</span>
              </div>
              <div className="flex items-start gap-2">
                <Heart size={16} className="text-[#B89A5A] shrink-0 mt-0.5 fill-[#B89A5A]" />
                <span>10% Net Profit directly to Animal Welfare</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-sm">🔄</span>
                <span>7-Day Hassle-Free Size Exchanges</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-sm">🎨</span>
                <span>24h WhatsApp Digital Art Proof</span>
              </div>
            </div>
          </div>

        </div>

        {/* ================= BOTTOM BAR ================= */}
        <div className="pt-8 border-t border-[#B89A5A]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#E8E0D2]/60">
          <p>© 2026 FUREVER. Wear The Bond. Live The Memory.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-[#B89A5A] cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#B89A5A] cursor-pointer">Terms of Service</span>
            <span className="hover:text-[#B89A5A] cursor-pointer">Shipping & Returns</span>
          </div>
        </div>

      </div>
    </footer>
  );
}