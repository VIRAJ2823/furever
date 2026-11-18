import { useContext, useEffect, useMemo, useRef, useState } from "react";
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
} from "lucide-react";
import FureverLogo from "./FureverLogo";
import { authDataContext } from "../context/Authcontext";
import { userDataContext } from "../context/UserContext";
import { shopDataContext } from "../context/ShopContext";
import CartDrawer from "./CartDrawer";

const NAV_LINKS = [
  { label: "Collections", href: "/collections" },
  { label: "Custom", href: "/customs" },
  { label: "Accessories", href: "/accessories" },
  { label: "About", href: "/about" },
];

export default function Nav() {
  const navigate = useNavigate();
  const location = useLocation();

  const { serverUrl } = useContext(authDataContext) || {};
  const { userData, setUserData } = useContext(userDataContext) || {};
  const {
    products = [],
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
        navigate(
          `/product/${suggestions[selectedSuggestionIndex]._id || suggestions[selectedSuggestionIndex].id}`
        );
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
        await axios.post(
          `${serverUrl}/api/auth/logout`,
          {},
          { withCredentials: true }
        );
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
      {/* ================= MAIN NAVIGATION BAR ================= */}
      <header className="sticky top-0 z-40 w-full bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#141414]/10 text-[#141414] transition-all">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
          <div className="flex h-14 sm:h-16 md:h-20 items-center justify-between gap-1 sm:gap-4">
            
            {/* BRAND LOGO / WORDMARK (LEFT) */}
            <Link
              to="/"
              className="flex items-center group cursor-pointer focus:outline-none shrink-0"
              aria-label="Furever Home"
            >
              <FureverLogo size="md" variant="dark" />
            </Link>

            {/* PRIMARY NAV LINKS (CENTER DESKTOP) */}
            <nav className="hidden md:flex items-center gap-3.5 lg:gap-8 shrink-0">
              {NAV_LINKS.map((link) => {
                const isActive =
                  location.pathname === link.href ||
                  (link.href === "/collections" &&
                    (location.pathname === "/collections" ||
                      location.pathname === "/originals"));

                return (
                  <Link
                    key={link.label}
                    to={link.href}
                    className={`text-[11px] lg:text-xs uppercase font-semibold tracking-[0.12em] transition-colors duration-150 py-1 relative ${
                      isActive
                        ? "text-[#141414] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#141414]"
                        : "text-[#141414]/65 hover:text-[#141414]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* UTILITY CONTROLS: SEARCH | ACCOUNT | CART (RIGHT) */}
            <div className="flex items-center gap-0.5 sm:gap-1.5 md:gap-2 shrink-0">
              
              {/* SEARCH TRIGGER */}
              <button
                type="button"
                onClick={handleOpenSearch}
                aria-label="Search store"
                className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-[#141414]/80 hover:text-[#141414] transition-colors rounded-full hover:bg-[#141414]/5 cursor-pointer"
              >
                <Search size={16} strokeWidth={1.75} />
                <span className="hidden xl:inline">Search</span>
                <span className="hidden xl:inline text-[9px] font-mono text-[#141414]/40 border border-[#141414]/15 px-1 py-0.2 rounded">
                  ⌘K
                </span>
              </button>

              {/* ACCOUNT / AUTH */}
              <div className="relative" ref={profileRef}>
                {userData ? (
                  <button
                    type="button"
                    onClick={() => setProfileOpen(!profileOpen)}
                    aria-label="User Account"
                    className="flex items-center gap-1.5 p-1 sm:px-2 sm:py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-[#141414] hover:text-[#141414]/80 transition-colors rounded-full hover:bg-[#141414]/5 cursor-pointer"
                  >
                    <span className="w-6 h-6 rounded-full bg-[#141414] text-[#FAF8F5] flex items-center justify-center font-bold text-[11px] uppercase">
                      {userData.name
                        ? userData.name.charAt(0).toUpperCase()
                        : <User size={13} />}
                    </span>
                    <span className="hidden xl:inline max-w-[80px] truncate text-xs">
                      {userData.name?.split(" ")[0] || "Account"}
                    </span>
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-[#141414]/80 hover:text-[#141414] transition-colors rounded-full hover:bg-[#141414]/5"
                  >
                    <User size={16} strokeWidth={1.75} />
                    <span className="hidden xl:inline">Account</span>
                  </Link>
                )}

                {/* Profile Dropdown Popover */}
                <AnimatePresence>
                  {profileOpen && userData && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.12 }}
                      className="absolute right-0 mt-2 w-60 rounded-xl bg-[#FAF8F5] border border-[#141414]/12 shadow-xl p-2.5 z-50 text-[#141414]"
                    >
                      <div className="px-3 py-2 border-b border-[#141414]/8 mb-1.5">
                        <p className="text-[10px] text-[#141414]/50 font-semibold uppercase tracking-wider">
                          Signed In As
                        </p>
                        <p className="text-xs font-bold truncate text-[#141414]">
                          {userData.name}
                        </p>
                        <p className="text-[11px] text-[#141414]/60 truncate">
                          {userData.email}
                        </p>
                      </div>

                      <Link
                        to="/orders"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-[#141414] hover:bg-[#141414]/5 transition-colors"
                      >
                        <Package size={14} strokeWidth={1.75} />
                        <span>My Orders</span>
                      </Link>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full mt-0.5 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
                      >
                        <LogOut size={14} strokeWidth={1.75} />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* CART TRIGGER */}
              <button
                type="button"
                onClick={handleCartClick}
                aria-label="Open Shopping Bag"
                className="flex items-center gap-1 px-2 py-1.5 sm:px-2.5 sm:py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-[#141414] hover:text-[#141414]/80 transition-colors rounded-full hover:bg-[#141414]/5 cursor-pointer relative"
              >
                <ShoppingBag size={16} strokeWidth={1.75} />
                <span className="hidden xl:inline">Cart</span>
                <span className="font-mono text-[11px] sm:text-xs font-bold text-[#141414] bg-[#141414]/8 px-1.5 py-0.2 rounded-full min-w-[18px] text-center">
                  {cartCount}
                </span>
              </button>

              {/* MOBILE MENU TOGGLE */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 rounded-full text-[#141414] hover:bg-[#141414]/5 transition-colors cursor-pointer shrink-0"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? (
                  <X size={19} strokeWidth={1.75} />
                ) : (
                  <Menu size={19} strokeWidth={1.75} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU DRAWER */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="md:hidden border-t border-[#141414]/10 bg-[#FAF8F5] px-6 py-6 space-y-4 overflow-hidden shadow-lg"
            >
              <nav className="flex flex-col space-y-1">
                {NAV_LINKS.map((link) => {
                  const isActive =
                    location.pathname === link.href ||
                    (link.href === "/collections" &&
                      (location.pathname === "/collections" ||
                        location.pathname === "/originals"));

                  return (
                    <Link
                      key={link.label}
                      to={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-sm font-semibold uppercase tracking-[0.12em] py-2.5 px-3 rounded-lg transition-colors ${
                        isActive
                          ? "bg-[#141414]/8 text-[#141414] font-bold"
                          : "text-[#141414]/75 hover:bg-[#141414]/5 hover:text-[#141414]"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-3 border-t border-[#141414]/10 flex flex-col space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleOpenSearch();
                  }}
                  className="flex items-center gap-2.5 text-sm font-medium uppercase tracking-[0.08em] py-2 px-3 rounded-lg text-[#141414]/80 hover:bg-[#141414]/5 hover:text-[#141414] transition-colors text-left"
                >
                  <Search size={16} strokeWidth={1.75} />
                  <span>Search</span>
                </button>

                {userData ? (
                  <>
                    <Link
                      to="/orders"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 text-sm font-medium uppercase tracking-[0.08em] py-2 px-3 rounded-lg text-[#141414]/80 hover:bg-[#141414]/5 hover:text-[#141414] transition-colors"
                    >
                      <Package size={16} strokeWidth={1.75} />
                      <span>My Orders</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-2.5 text-sm font-medium uppercase tracking-[0.08em] py-2 px-3 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                    >
                      <LogOut size={16} strokeWidth={1.75} />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 text-sm font-medium uppercase tracking-[0.08em] py-2 px-3 rounded-lg text-[#141414]/80 hover:bg-[#141414]/5 hover:text-[#141414] transition-colors"
                  >
                    <LogIn size={16} strokeWidth={1.75} />
                    <span>Account / Sign In</span>
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ================= 3. COMMAND SEARCH MODAL ================= */}
      <AnimatePresence>
        {searchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSearch}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -8 }}
              transition={{ duration: 0.16 }}
              className="relative w-full max-w-xl rounded-2xl bg-[#FAF8F5] border border-[#141414]/12 shadow-2xl overflow-hidden z-10 text-[#141414]"
            >
              {/* Search Bar Input */}
              <div className="flex items-center px-4 py-3.5 border-b border-[#141414]/10 bg-[#FAF8F5]">
                <Search
                  size={17}
                  strokeWidth={1.75}
                  className="text-[#141414]/60 shrink-0 mr-3"
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search pieces, stories, customs..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedSuggestionIndex(-1);
                  }}
                  onKeyDown={handleSearchKeyDown}
                  className="w-full bg-transparent text-sm font-medium text-[#141414] outline-none placeholder-[#141414]/40"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-[#141414]/50 hover:text-[#141414] p-1 cursor-pointer"
                    aria-label="Clear search query"
                  >
                    <X size={15} />
                  </button>
                )}
                <button
                  onClick={closeSearch}
                  className="ml-2 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-[#141414]/60 hover:text-[#141414] rounded border border-[#141414]/15 cursor-pointer"
                >
                  ESC
                </button>
              </div>

              {/* Suggestions List */}
              <div className="max-h-80 overflow-y-auto p-2">
                {searchQuery.trim() ? (
                  suggestions.length > 0 ? (
                    <div className="space-y-0.5">
                      <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#141414]/40">
                        Matching Pieces
                      </p>
                      {suggestions.map((item, index) => {
                        const isSelected = index === selectedSuggestionIndex;
                        return (
                          <div
                            key={item._id || item.id}
                            onClick={() => {
                              navigate(`/product/${item._id || item.id}`);
                              closeSearch();
                            }}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                              isSelected
                                ? "bg-[#141414]/8"
                                : "hover:bg-[#141414]/4"
                            }`}
                          >
                            <img
                              src={
                                item.image1 ||
                                item.images?.black ||
                                item.image
                              }
                              alt={item.name}
                              className="w-10 h-10 rounded-lg object-contain bg-white p-1 border border-[#141414]/10 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-semibold text-[#141414] truncate uppercase tracking-wide">
                                {item.name}
                              </h4>
                              <p className="text-[11px] text-[#141414]/60">
                                {item.category || "Furever Animals"} • ₹
                                {item.price}
                              </p>
                            </div>
                            <ArrowRight
                              size={13}
                              className="text-[#141414]/40 shrink-0"
                            />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-xs text-[#141414]/50">
                      No pieces found matching "{searchQuery}".
                    </div>
                  )
                ) : (
                  <div className="py-3 px-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#141414]/40 mb-2">
                      Popular Discoveries
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        "Brontosaurus",
                        "I Go Jim",
                        "Lazy Panda",
                        "Custom Line Art",
                        "Custom Stencil",
                      ].map((tag) => (
                        <button
                          key={tag}
                          onClick={() => submitSearch(tag)}
                          className="text-xs font-medium px-3 py-1 rounded-full bg-transparent hover:bg-[#141414]/5 text-[#141414] border border-[#141414]/12 transition-colors cursor-pointer"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= 4. SLIDE-OUT CART DRAWER ================= */}
      <CartDrawer />
    </>
  );
}