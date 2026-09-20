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
  ChevronRight,
  Sparkles,
  Flame,
} from "lucide-react";
import paws from "../assets/paws.png";
import { authDataContext } from "../context/Authcontext";
import { userDataContext } from "../context/UserContext";
import { shopDataContext } from "../context/ShopContext";
import CartDrawer from "./CartDrawer";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Drops", href: "/collections" },
  { label: "Our Story", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Nav() {
  const navigate = useNavigate();
  const location = useLocation();

  const { serverUrl } = useContext(authDataContext);
  const { userData, setUserData } = useContext(userDataContext);
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
      .slice(0, 6);
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

  const submitSearch = (term) => {
    const q = (term || searchQuery).trim();
    if (!q) return;
    if (typeof setSearch === "function") {
      setSearch(q);
    }
    closeSearch();
    setMobileMenuOpen(false);
    navigate("/collections");
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Escape") {
      closeSearch();
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedSuggestionIndex >= 0 && suggestions[selectedSuggestionIndex]) {
        submitSearch(suggestions[selectedSuggestionIndex].name);
      } else {
        submitSearch();
      }
    } else if (suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedSuggestionIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : -1));
      }
    }
  };

  // Close profile on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(`${serverUrl}/api/auth/logout`, {}, { withCredentials: true });
      setUserData(null);
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
      {/* ================= TOP MARQUEE TICKER ================= */}
      <div className="w-full bg-[#0D0D11] text-white overflow-hidden py-2 border-b border-white/10 select-none z-50">
        <div className="animate-marquee flex items-center gap-10 text-[11px] font-bold tracking-widest uppercase">
          <span className="flex items-center gap-2">
            <Flame size={13} className="text-[#FF462D]" fill="currentColor" />
            DROP 01 IS LIVE • LIMITED TO 150 PIECES
          </span>
          <span className="text-white/30">•</span>
          <span className="flex items-center gap-2">
            <Heart size={12} className="text-[#FF462D]" fill="currentColor" />
            10% OF EVERY ORDER SUPPORTS LOCAL ANIMAL RESCUES
          </span>
          <span className="text-white/30">•</span>
          <span>HEAVYWEIGHT 240 GSM FRENCH TERRY STREETWEAR</span>
          <span className="text-white/30">•</span>
          <span>FREE EXPRESS SHIPPING ON ORDERS OVER ₹999</span>
          <span className="text-white/30">•</span>
          <span className="flex items-center gap-2">
            <Flame size={13} className="text-[#FF462D]" fill="currentColor" />
            DROP 01 IS LIVE • LIMITED TO 150 PIECES
          </span>
          <span className="text-white/30">•</span>
          <span className="flex items-center gap-2">
            <Heart size={12} className="text-[#FF462D]" fill="currentColor" />
            10% OF EVERY ORDER SUPPORTS LOCAL ANIMAL RESCUES
          </span>
          <span className="text-white/30">•</span>
          <span>HEAVYWEIGHT 240 GSM FRENCH TERRY STREETWEAR</span>
          <span className="text-white/30">•</span>
          <span>FREE EXPRESS SHIPPING ON ORDERS OVER ₹999</span>
        </div>
      </div>

      {/* ================= MAIN NAVIGATION BAR ================= */}
      <header className="sticky top-0 z-40 w-full bg-[#121217]/95 backdrop-blur-xl border-b border-white/10 text-white transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-20 items-center justify-between gap-4">
            
            {/* BRAND LOGO */}
            <Link
              to="/"
              className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-2 transition-transform duration-300 group-hover:scale-105 group-hover:border-[#FF462D]/50">
                <img src={paws} alt="FurEver" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <div className="font-heading font-black text-xl sm:text-2xl tracking-tighter uppercase leading-none">
                  FUR<span className="text-[#FF462D]">EVER</span>
                </div>
                <span className="text-[9px] font-extrabold tracking-[0.25em] text-neutral-400 uppercase">
                  Studio • Drop 01
                </span>
              </div>
            </Link>

            {/* DESKTOP NAV LINKS */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => {
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    to={link.href}
                    className={`relative font-heading text-xs uppercase tracking-widest font-bold py-1.5 transition-colors duration-200 ${
                      isActive ? "text-[#FF462D]" : "text-neutral-300 hover:text-white"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FF462D] rounded-full"
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* RIGHT ACTIONS: SEARCH, USER, CART */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Search Button */}
              <button
                onClick={handleOpenSearch}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                title="Search Drops"
                aria-label="Search"
              >
                <Search size={17} />
              </button>

              {/* User / Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                {userData ? (
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 h-10 px-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-wider text-white transition-all cursor-pointer"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#FF462D] text-white text-[10px] flex items-center justify-center font-black">
                      {(userData.name || "U")[0].toUpperCase()}
                    </div>
                    <span className="hidden lg:inline truncate max-w-[100px]">
                      {userData.name?.split(" ")[0]}
                    </span>
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center gap-1.5 h-10 px-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-wider text-white transition-all cursor-pointer"
                  >
                    <User size={15} />
                    <span className="hidden sm:inline">Sign In</span>
                  </Link>
                )}

                {/* Profile Popup */}
                <AnimatePresence>
                  {profileOpen && userData && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 bg-[#16161D] border border-white/15 rounded-2xl shadow-2xl p-2 z-50 text-white"
                    >
                      <div className="px-3.5 py-3 border-b border-white/10 mb-1">
                        <p className="text-xs font-bold text-white truncate">{userData.name}</p>
                        <p className="text-[11px] text-neutral-400 truncate">{userData.email}</p>
                      </div>

                      <Link
                        to="/orders"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold hover:bg-white/5 text-neutral-300 hover:text-white transition-colors"
                      >
                        <Package size={15} className="text-[#FF462D]" />
                        <span>My Orders</span>
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold hover:bg-red-500/10 text-red-400 transition-colors cursor-pointer"
                      >
                        <LogOut size={15} />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Live Cart Drawer Trigger */}
              <button
                onClick={handleCartClick}
                className="relative flex items-center gap-2 h-10 px-4 rounded-full bg-[#FF462D] hover:bg-[#E03B24] active:scale-[0.98] text-white transition-all shadow-lg shadow-[#FF462D]/20 cursor-pointer"
                aria-label="View Cart Drawer"
              >
                <ShoppingBag size={17} />
                <span className="font-heading font-black text-xs">
                  {cartCount}
                </span>
              </button>

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center justify-center cursor-pointer"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>

          </div>
        </div>
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
              className="fixed inset-0 bg-black/75 backdrop-blur-md cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              className="relative w-full max-w-2xl bg-[#14141A] border border-white/15 rounded-3xl shadow-2xl p-6 z-10 text-white overflow-hidden"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                  Search FurEver Archive
                </span>
                <button
                  onClick={closeSearch}
                  className="p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Input */}
              <div className="relative flex items-center">
                <Search size={20} className="absolute left-4 text-[#FF462D]" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search drops, oversized tees, heavyweight hoodies..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedSuggestionIndex(-1);
                  }}
                  onKeyDown={handleSearchKeyDown}
                  className="w-full pl-12 pr-12 py-4 bg-white/5 rounded-2xl border border-white/10 text-white placeholder-neutral-500 font-medium text-sm sm:text-base outline-none focus:border-[#FF462D] focus:ring-2 focus:ring-[#FF462D]/20 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 text-xs font-bold text-neutral-400 hover:text-white uppercase"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className="mt-4 space-y-1 max-h-72 overflow-y-auto">
                  <p className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase px-3 py-1">
                    Matching Drops
                  </p>
                  {suggestions.map((item, idx) => (
                    <button
                      key={item._id}
                      onClick={() => submitSearch(item.name)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                        selectedSuggestionIndex === idx
                          ? "bg-[#FF462D] text-white"
                          : "hover:bg-white/5 text-neutral-200"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={item.image1}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover bg-neutral-800 shrink-0"
                        />
                        <div className="truncate">
                          <p className="text-sm font-semibold truncate">{item.name}</p>
                          <p className="text-xs opacity-70">
                            {item.category} • ₹{item.price}
                          </p>
                        </div>
                      </div>
                      <ArrowRight size={14} className="opacity-50 shrink-0" />
                    </button>
                  ))}
                </div>
              )}

              {/* Quick Popular Searches */}
              <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  Trending:
                </span>
                {["Oversized", "Drop 01", "240 GSM", "Heavyweight", "Bestseller"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => submitSearch(tag)}
                    className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-neutral-300 hover:text-white transition-colors cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MOBILE MENU DRAWER ================= */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex flex-col">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="relative w-4/5 max-w-sm h-full bg-[#121217] border-r border-white/10 p-6 flex flex-col justify-between text-white z-10"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
                  <div className="flex items-center gap-2">
                    <img src={paws} alt="FurEver" className="w-8 h-8 object-contain" />
                    <span className="font-heading font-black text-xl">FUR<span className="text-[#FF462D]">EVER</span></span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-neutral-400"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-2">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.label}
                      to={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between px-4 py-3.5 rounded-2xl hover:bg-white/5 font-heading text-base font-bold uppercase tracking-wider text-neutral-200 hover:text-[#FF462D] transition-colors"
                    >
                      <span>{link.label}</span>
                      <ChevronRight size={16} className="text-neutral-500" />
                    </Link>
                  ))}
                  {userData && (
                    <Link
                      to="/orders"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between px-4 py-3.5 rounded-2xl hover:bg-white/5 font-heading text-base font-bold uppercase tracking-wider text-neutral-200 hover:text-[#FF462D] transition-colors"
                    >
                      <span>My Orders</span>
                      <ChevronRight size={16} className="text-neutral-500" />
                    </Link>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 space-y-3">
                {userData ? (
                  <button
                    onClick={handleLogout}
                    className="w-full py-3.5 rounded-xl bg-red-500/10 text-red-400 font-bold text-xs uppercase tracking-wider hover:bg-red-500/20 transition-colors"
                  >
                    Sign Out
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3.5 rounded-xl bg-[#FF462D] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#FF462D]/20"
                  >
                    <LogIn size={15} />
                    <span>Sign In to Account</span>
                  </Link>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Slide-out Cart Drawer */}
      <CartDrawer />
    </>
  );
}