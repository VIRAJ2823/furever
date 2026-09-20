import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  ArrowRight,
  Package,
  LogOut,
  LogIn,
  Heart,
  Sparkles,
} from "lucide-react";
import paws from "../assets/paws.png";
import { authDataContext } from "../context/Authcontext";
import { userDataContext } from "../context/UserContext";
import { shopDataContext } from "../context/ShopContext";
import CartDrawer from "./CartDrawer";

const NAV_LINKS = [
  { label: "Men", href: "/collections?category=Men" },
  { label: "Women", href: "/collections?category=Women" },
  { label: "Oversized Drops", href: "/collections?category=Unisex" },
  { label: "Custom Pet Tee", href: "/collections?category=Customs" },
  { label: "Our NGO Impact", href: "/about" },
];

export default function Nav() {
  const navigate = useNavigate();
  const location = useLocation();

  const { serverUrl } = useContext(authDataContext) || {};
  const { userData, setUserData } = useContext(userDataContext) || {};
  const {
    products = [],
    search = "",
    setSearch,
    getCartCount,
    setIsCartDrawerOpen,
  } = useContext(shopDataContext) || {};

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

  const searchInputRef = useRef(null);
  const profileRef = useRef(null);

  const cartCount = typeof getCartCount === "function" ? getCartCount() : 0;

  // Search suggestions
  const suggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q || !products.length) return [];
    return products
      .filter((p) => {
        const name = (p.name || "").toLowerCase();
        const cat = (p.category || "").toLowerCase();
        const sub = (p.subCategory || "").toLowerCase();
        return name.includes(q) || cat.includes(q) || sub.includes(q);
      })
      .slice(0, 5);
  }, [searchQuery, products]);

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
    setSelectedSuggestionIndex(-1);
  };

  const handleOpenSearch = () => {
    setSearchOpen(true);
    setTimeout(() => searchInputRef.current?.focus(), 80);
  };

  const submitSearch = (query) => {
    const term = typeof query === "string" ? query : searchQuery;
    if (typeof setSearch === "function") {
      setSearch(term);
    }
    closeSearch();
    navigate("/collections");
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (selectedSuggestionIndex >= 0 && suggestions[selectedSuggestionIndex]) {
        navigate(`/product/${suggestions[selectedSuggestionIndex]._id || suggestions[selectedSuggestionIndex].id}`);
        closeSearch();
      } else {
        submitSearch(searchQuery);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === "Escape") {
      closeSearch();
    }
  };

  // Close profile on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut Command/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLogout = async () => {
    try {
      if (serverUrl) {
        await axios.post(`${serverUrl}/api/auth/logout`, {}, { withCredentials: true });
      }
      if (typeof setUserData === "function") {
        setUserData(null);
      }
      setProfileOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleCartClick = () => {
    if (typeof setIsCartDrawerOpen === "function") {
      setIsCartDrawerOpen(true);
    } else {
      navigate(userData ? "/cart" : "/login");
    }
  };

  return (
    <>
      {/* ================= 1. TOP STICKY ANNOUNCEMENT BAR (Davy's Gray #58545F & Apricot #FFC5A6) ================= */}
      <div className="w-full bg-[#58545F] text-white overflow-hidden py-2 border-b border-[#EDE4DD]/20 select-none text-[11px] sm:text-xs font-bold tracking-wider uppercase z-50">
        <div className="animate-marquee flex items-center gap-8 sm:gap-12">
          <span className="flex items-center gap-2">
            <span>🐾</span>
            <span>10% OF EVERY ORDER SUPPORTS LOCAL ANIMAL WELFARE NGOs</span>
            <span className="text-white/30">|</span>
            <span className="text-[#FFC5A6]">FREE PREPAID SHIPPING ACROSS INDIA</span>
          </span>
          <span className="text-white/30">•</span>
          <span className="flex items-center gap-2">
            <span>⚡</span>
            <span>DROP 001 LIVE • 240 GSM HEAVYWEIGHT FRENCH TERRY</span>
          </span>
          <span className="text-white/30">•</span>
          <span className="flex items-center gap-2">
            <span>🐾</span>
            <span>10% OF EVERY ORDER SUPPORTS LOCAL ANIMAL WELFARE NGOs</span>
            <span className="text-white/30">|</span>
            <span className="text-[#FFC5A6]">FREE PREPAID SHIPPING ACROSS INDIA</span>
          </span>
          <span className="text-white/30">•</span>
          <span className="flex items-center gap-2">
            <span>⚡</span>
            <span>DROP 001 LIVE • 240 GSM HEAVYWEIGHT FRENCH TERRY</span>
          </span>
        </div>
      </div>

      {/* ================= 2. MAIN NAVIGATION BAR (Canvas #FAF6F2 Backdrop) ================= */}
      <header className="sticky top-0 z-40 w-full bg-[#FAF6F2]/95 backdrop-blur-md border-b border-[#EDE4DD] text-[#2B2730] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-20 items-center justify-between gap-4">
            
            {/* BRAND LOGO */}
            <Link
              to="/"
              className="flex items-center gap-2.5 group cursor-pointer focus:outline-none shrink-0"
            >
              <div className="w-9 h-9 rounded-xl bg-[#58545F] flex items-center justify-center p-2 text-white transition-transform duration-200 group-hover:scale-105 shadow-xs">
                <img src={paws} alt="FurEver" className="w-full h-full object-contain invert" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-black text-2xl sm:text-3xl tracking-tighter uppercase text-[#2B2730] leading-none">
                  FUREVER
                </span>
                <span className="text-[9px] font-extrabold tracking-[0.2em] text-[#DC8E90] uppercase">
                  240 GSM // 10% TO NGOs
                </span>
              </div>
            </Link>

            {/* CATEGORY TABS (DESKTOP) */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {NAV_LINKS.map((link) => {
                const isCatActive =
                  link.href.includes("category") &&
                  location.search.includes(link.href.split("category=")[1]);
                const isPathActive = location.pathname === link.href;
                const active = isCatActive || isPathActive;

                return (
                  <Link
                    key={link.label}
                    to={link.href}
                    className={`font-heading text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-full transition-all duration-200 ${
                      active
                        ? "bg-[#58545F] text-white shadow-xs"
                        : "text-[#58545F] hover:text-[#2B2730] hover:bg-[#EDE4DD]/50"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* ACTION ICONS (SEARCH, PROFILE, CART) */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* SEARCH TRIGGER */}
              <button
                type="button"
                onClick={handleOpenSearch}
                aria-label="Search"
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-white hover:bg-[#F5EFEB] border border-[#EDE4DD] text-[#58545F] text-xs font-semibold transition-all cursor-pointer shadow-2xs"
              >
                <Search size={14} className="text-[#58545F]" />
                <span className="hidden sm:inline">Search drops...</span>
                <span className="hidden lg:inline text-[9px] bg-[#FAF6F2] text-[#7E7785] px-1.5 py-0.5 rounded border border-[#EDE4DD]">
                  ⌘K
                </span>
              </button>

              {/* USER PROFILE */}
              <div className="relative" ref={profileRef}>
                {userData ? (
                  <button
                    type="button"
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="w-9 h-9 rounded-full bg-[#58545F] text-white flex items-center justify-center font-bold text-xs cursor-pointer hover:bg-[#2B2730] transition-all"
                  >
                    {userData.name ? userData.name.charAt(0).toUpperCase() : <User size={16} />}
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white hover:bg-[#F5EFEB] border border-[#EDE4DD] text-[#2B2730] text-xs font-bold transition-all shadow-2xs"
                  >
                    <LogIn size={13} className="text-[#DC8E90]" />
                    <span>Login</span>
                  </Link>
                )}

                {/* Profile Popup */}
                <AnimatePresence>
                  {profileOpen && userData && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3 w-60 rounded-2xl bg-white border border-[#EDE4DD] shadow-xl p-3 z-50 text-[#2B2730]"
                    >
                      <div className="px-3 py-2 border-b border-[#EDE4DD] mb-2">
                        <p className="text-[10px] text-[#7E7785] font-bold uppercase tracking-wider">Account</p>
                        <p className="text-sm font-bold truncate text-[#2B2730]">{userData.name}</p>
                        <p className="text-xs text-[#7E7785] truncate">{userData.email}</p>
                      </div>

                      <Link
                        to="/orders"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-[#2B2730] hover:bg-[#FAF6F2] transition-colors"
                      >
                        <Package size={15} className="text-[#DC8E90]" />
                        <span>My Streetwear Orders</span>
                      </Link>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full mt-1 flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
                      >
                        <LogOut size={15} />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* SLIDE-OUT CART TRIGGER (Davy's Gray with Light Coral Badge) */}
              <button
                type="button"
                onClick={handleCartClick}
                aria-label="Open Cart"
                className="relative p-2.5 rounded-full bg-[#58545F] hover:bg-[#2B2730] text-white transition-transform duration-200 active:scale-95 cursor-pointer shadow-xs"
              >
                <ShoppingBag size={17} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] rounded-full bg-[#DC8E90] text-white font-extrabold text-[10px] flex items-center justify-center px-1 ring-2 ring-[#FAF6F2]">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* MOBILE MENU TOGGLE */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-full bg-white border border-[#EDE4DD] text-[#2B2730]"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU ACCORDION */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-[#EDE4DD] bg-[#FAF6F2] px-4 py-4 space-y-2 overflow-hidden"
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block font-heading font-bold text-xs uppercase tracking-wider text-[#2B2730] hover:text-[#DC8E90] px-4 py-2.5 rounded-xl hover:bg-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              {!userData ? (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full mt-3 flex items-center justify-center gap-2 py-3 rounded-full bg-[#58545F] text-white text-xs font-bold uppercase tracking-wider"
                >
                  <LogIn size={15} />
                  <span>Login / Register</span>
                </Link>
              ) : (
                <div className="pt-2 border-t border-[#EDE4DD] flex flex-col gap-1">
                  <Link
                    to="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-xs font-bold text-[#2B2730] px-4 py-2"
                  >
                    <Package size={15} className="text-[#DC8E90]" />
                    <span>My Orders</span>
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-2 text-xs font-bold text-rose-600 px-4 py-2 text-left"
                  >
                    <LogOut size={15} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ================= SEARCH MODAL ================= */}
      <AnimatePresence>
        {searchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSearch}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -16 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-2xl bg-[#FFFFFF] rounded-3xl border border-[#EDE4DD] shadow-2xl overflow-hidden z-10"
            >
              {/* Search Header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-[#EDE4DD]">
                <Search size={18} className="text-[#58545F] shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedSuggestionIndex(-1);
                  }}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search 240 GSM tees, dino graphic, pet memory line art..."
                  className="w-full bg-transparent text-[#2B2730] placeholder-[#7E7785] text-sm font-semibold focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="text-xs text-[#58545F] hover:text-[#2B2730] px-2 py-1 rounded bg-[#FAF6F2]"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="button"
                  onClick={closeSearch}
                  className="p-1.5 rounded-full hover:bg-[#FAF6F2] text-[#58545F] hover:text-[#2B2730]"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Suggestions */}
              <div className="p-5 max-h-[60vh] overflow-y-auto">
                {!searchQuery ? (
                  <div>
                    <p className="font-heading text-[10px] font-bold text-[#7E7785] uppercase tracking-wider mb-3">
                      Trending Searches
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Brontosaurus Oversized Tee",
                        "I Go Jim Dino",
                        "Lazy Panda 240 GSM",
                        "Custom Pet Line Art",
                        "Memory Series Stencil",
                        "10% To NGOs",
                      ].map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => submitSearch(tag)}
                          className="px-3.5 py-1.5 rounded-full bg-[#FAF6F2] hover:bg-[#58545F] hover:text-white border border-[#EDE4DD] text-xs font-semibold text-[#58545F] transition-colors cursor-pointer"
                        >
                          ⚡ {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    {suggestions.length > 0 ? (
                      <div className="space-y-2">
                        {suggestions.map((item, idx) => (
                          <div
                            key={item._id || item.id}
                            onClick={() => {
                              closeSearch();
                              navigate(`/product/${item._id || item.id}`);
                            }}
                            className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${
                              selectedSuggestionIndex === idx
                                ? "bg-[#58545F] text-white"
                                : "bg-[#FAF6F2] hover:bg-[#EDE4DD]/60 text-[#2B2730]"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={item.image1 || item.images?.black}
                                alt={item.name}
                                className="w-12 h-12 rounded-xl object-cover bg-white"
                              />
                              <div>
                                <p className="text-xs font-bold truncate">{item.name}</p>
                                <p className="text-[11px] opacity-75">
                                  {item.category} • ₹{item.price} • {item.specs?.gsm || 240} GSM
                                </p>
                              </div>
                            </div>
                            <ArrowRight size={15} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center text-[#58545F]">
                        <p className="text-sm font-bold text-[#2B2730] mb-1">
                          No graphic drops found matching "{searchQuery}"
                        </p>
                        <button
                          type="button"
                          onClick={() => submitSearch("")}
                          className="mt-3 px-5 py-2 rounded-full bg-[#58545F] text-white text-xs font-bold"
                        >
                          View Full Drop Roster
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SLIDE-OUT CART DRAWER */}
      <CartDrawer />
    </>
  );
}