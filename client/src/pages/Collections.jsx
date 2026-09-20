import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, SlidersHorizontal, PackageX, Sparkles, Flame, Check } from "lucide-react";
import Nav from "../components/Nav";
import Card from "../components/Card";
import Footer from "../components/Footer";
import { shopDataContext } from "../context/ShopContext";

const CATEGORIES = ["All", "Men", "Women", "Kids"];
const SUB_CATEGORIES = ["All", "Topwear", "Bottomwear", "Winterwear"];
const SIZES = ["S", "M", "L", "XL", "XXL"];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest Drops First" },
  { value: "oldest", label: "Oldest First" },
  { value: "priceLowHigh", label: "Price: Low to High" },
  { value: "priceHighLow", label: "Price: High to Low" },
  { value: "alphabetical", label: "Alphabetical" },
];
const PAGE_SIZE = 12;

function PillButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
        active
          ? "bg-[#0D0D11] text-white shadow-sm"
          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900"
      }`}
    >
      {children}
    </button>
  );
}

function FiltersPanel({
  category,
  setCategory,
  subCategory,
  setSubCategory,
  selectedSizes,
  toggleSize,
  priceRange,
  setPriceRange,
  priceBounds,
  sortOption,
  setSortOption,
  bestsellerOnly,
  setBestsellerOnly,
  isMobile = false,
}) {
  const range = priceBounds.max - priceBounds.min;
  const minPercent = range <= 0 ? 0 : ((priceRange[0] - priceBounds.min) / range) * 100;
  const maxPercent = range <= 0 ? 100 : ((priceRange[1] - priceBounds.min) / range) * 100;

  return (
    <div className="flex flex-col gap-6 text-[#121217]">
      {/* Category */}
      <div>
        <p className="font-heading text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-2.5">
          Category
        </p>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => (
            <PillButton key={c} active={category === c} onClick={() => setCategory(c)}>
              {c}
            </PillButton>
          ))}
        </div>
      </div>

      {/* Sub Category */}
      <div>
        <p className="font-heading text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-2.5">
          Garment Line
        </p>
        <div className="flex flex-wrap gap-1.5">
          {SUB_CATEGORIES.map((sc) => (
            <PillButton
              key={sc}
              active={subCategory === sc}
              onClick={() => setSubCategory(sc)}
            >
              {sc}
            </PillButton>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <p className="font-heading text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-2.5">
          Sizes
        </p>
        <div className="flex flex-wrap gap-1.5">
          {SIZES.map((size) => (
            <PillButton
              key={size}
              active={selectedSizes.includes(size)}
              onClick={() => toggleSize(size)}
            >
              {size}
            </PillButton>
          ))}
        </div>
      </div>

      {/* Price Range Slider */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <p className="font-heading text-[11px] font-bold uppercase tracking-widest text-neutral-400">
            Price Range
          </p>
          <span className="text-xs font-bold text-[#FF462D]">
            ₹{priceRange[0]} - ₹{priceRange[1]}
          </span>
        </div>
        <div className="relative w-full h-6 mt-2 flex items-center">
          <div className="absolute left-0 right-0 h-1 bg-neutral-200 rounded-full w-full" />
          <div
            className="absolute h-1 bg-[#FF462D] rounded-full"
            style={{
              left: `${minPercent}%`,
              width: `${Math.max(0, maxPercent - minPercent)}%`,
            }}
          />
          <input
            type="range"
            min={priceBounds.min}
            max={priceBounds.max}
            value={priceRange[0]}
            onChange={(e) => {
              const val = Math.min(Number(e.target.value), priceRange[1] - 1);
              setPriceRange([val, priceRange[1]]);
            }}
            className="dual-range-slider absolute w-full h-1 appearance-none pointer-events-none bg-transparent left-0 top-1/2 -translate-y-1/2 m-0 p-0 outline-none"
            style={{ zIndex: priceRange[0] > priceBounds.max - 100 ? "5" : "3" }}
          />
          <input
            type="range"
            min={priceBounds.min}
            max={priceBounds.max}
            value={priceRange[1]}
            onChange={(e) => {
              const val = Math.max(Number(e.target.value), priceRange[0] + 1);
              setPriceRange([priceRange[0], val]);
            }}
            className="dual-range-slider absolute w-full h-1 appearance-none pointer-events-none bg-transparent left-0 top-1/2 -translate-y-1/2 m-0 p-0 outline-none"
            style={{ zIndex: "4" }}
          />
        </div>
        <div className="flex justify-between items-center text-[10px] text-neutral-400 font-bold mt-1">
          <span>₹{priceBounds.min}</span>
          <span>₹{priceBounds.max}</span>
        </div>
      </div>

      {/* Mobile Sort Controls */}
      {isMobile && (
        <div>
          <p className="font-heading text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-2.5">
            Sort Drops By
          </p>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-xs font-bold bg-neutral-100 text-neutral-800 outline-none cursor-pointer focus:ring-2 focus:ring-[#FF462D]/30 transition-all"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Bestseller Toggle */}
      <div className="pt-3 border-t border-neutral-200">
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={bestsellerOnly}
            onChange={(e) => setBestsellerOnly(e.target.checked)}
            className="w-4 h-4 rounded border-neutral-300 accent-[#FF462D] cursor-pointer"
          />
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-700">
            Bestsellers Only
          </span>
        </label>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          .dual-range-slider {
            pointer-events: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
          }
          .dual-range-slider::-webkit-slider-thumb {
            pointer-events: auto;
            -webkit-appearance: none;
            appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #FF462D;
            cursor: pointer;
            border: 2px solid white;
            box-shadow: 0 1px 3px rgba(0,0,0,0.25);
          }
          .dual-range-slider::-moz-range-thumb {
            pointer-events: auto;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #FF462D;
            cursor: pointer;
            border: 2px solid white;
            box-shadow: 0 1px 3px rgba(0,0,0,0.25);
          }
        `,
        }}
      />
    </div>
  );
}

export default function Collections() {
  const { products = [], upcomingDrops = [], loading = false, search = "" } =
    useContext(shopDataContext) || {};
  const location = useLocation();
  const productsRef = useRef(null);
  const boundsInitialized = useRef(false);

  // Filter state
  const [category, setCategory] = useState("All");
  const [subCategory, setSubCategory] = useState("All");
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortOption, setSortOption] = useState("newest");
  const [bestsellerOnly, setBestsellerOnly] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Combine database products with upcoming teaser drops
  const allCollectionItems = useMemo(() => {
    return [...products, ...upcomingDrops];
  }, [products, upcomingDrops]);

  const priceBounds = useMemo(() => {
    if (!allCollectionItems.length) return { min: 0, max: 10000 };
    const prices = allCollectionItems
      .map((p) => Number(p.price))
      .filter((price) => !isNaN(price));
    if (prices.length === 0) return { min: 0, max: 10000 };
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [allCollectionItems]);

  useEffect(() => {
    if (!boundsInitialized.current && allCollectionItems.length > 0) {
      setPriceRange([priceBounds.min, priceBounds.max]);
      boundsInitialized.current = true;
    }
  }, [allCollectionItems, priceBounds]);

  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  useEffect(() => {
    if (location.state?.filter === "latest") {
      setSortOption("newest");
    } else if (location.state?.filter === "bestseller") {
      setBestsellerOnly(true);
    }
  }, [location.state]);

  const clearFilters = () => {
    setCategory("All");
    setSubCategory("All");
    setSelectedSizes([]);
    setPriceRange([priceBounds.min, priceBounds.max]);
    setSortOption("newest");
    setBestsellerOnly(false);
    setVisibleCount(PAGE_SIZE);
  };

  // Filter logic
  const filteredProducts = useMemo(() => {
    const query = (search || "").trim().toLowerCase();

    let result = allCollectionItems.filter((p) => {
      const matchesSearch =
        !query ||
        p.name?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        String(p.category ?? "").toLowerCase().includes(query) ||
        String(p.subCategory ?? "").toLowerCase().includes(query);

      const matchesCategory =
        category === "All" ||
        (p.category && String(p.category).trim().toLowerCase() === category.trim().toLowerCase());

      const matchesSubCategory =
        subCategory === "All" ||
        (p.subCategory &&
          String(p.subCategory).trim().toLowerCase() === subCategory.trim().toLowerCase());

      const matchesSizes =
        selectedSizes.length === 0 ||
        (Array.isArray(p.sizes) &&
          selectedSizes.some((selectedSize) =>
            p.sizes.some(
              (productSize) =>
                productSize &&
                String(productSize).trim().toLowerCase() === selectedSize.trim().toLowerCase()
            )
          ));

      const price = Number(p.price);
      const matchesPrice = !isNaN(price) && price >= priceRange[0] && price <= priceRange[1];

      const matchesBestseller = !bestsellerOnly || p.bestseller === true;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSubCategory &&
        matchesSizes &&
        matchesPrice &&
        matchesBestseller
      );
    });

    // Sorting
    result.sort((a, b) => {
      if (sortOption === "priceLowHigh") return Number(a.price) - Number(b.price);
      if (sortOption === "priceHighLow") return Number(b.price) - Number(a.price);
      if (sortOption === "alphabetical") return (a.name || "").localeCompare(b.name || "");
      if (sortOption === "oldest") return (a.date || 0) - (b.date || 0);
      return (b.date || 0) - (a.date || 0);
    });

    return result;
  }, [allCollectionItems, search, category, subCategory, selectedSizes, priceRange, bestsellerOnly, sortOption]);

  const activeFiltersCount =
    (category !== "All" ? 1 : 0) +
    (subCategory !== "All" ? 1 : 0) +
    selectedSizes.length +
    (bestsellerOnly ? 1 : 0);

  const filterPanelProps = {
    category,
    setCategory,
    subCategory,
    setSubCategory,
    selectedSizes,
    toggleSize,
    priceRange,
    setPriceRange,
    priceBounds,
    sortOption,
    setSortOption,
    bestsellerOnly,
    setBestsellerOnly,
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#121217] flex flex-col">
      <Nav />

      {/* ================= HERO ARCHIVE HEADER ================= */}
      <div className="w-full bg-[#0D0D11] text-white py-12 sm:py-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FF462D] mb-3">
                <Flame size={14} fill="currentColor" />
                <span>ARCHIVE // BATCH 001</span>
              </div>
              <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight uppercase leading-none">
                COLLECTIONS & <span className="text-[#FF462D]">DROPS</span>
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-md">
              Showing {filteredProducts.length} pieces across Genesis Drop 01 and upcoming Drop 02 teasers. 100% 240+ GSM organic cotton.
            </p>
          </div>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full" ref={productsRef}>
        
        {/* TOP BAR: SEARCH INDICATOR & MOBILE TRIGGER */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-neutral-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-full bg-neutral-900 text-white font-heading text-xs font-bold uppercase tracking-wider"
            >
              <SlidersHorizontal size={14} />
              <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
            </button>

            {search && (
              <span className="text-xs font-bold text-neutral-600 bg-neutral-200/70 px-3 py-1.5 rounded-full">
                Search: "{search}"
              </span>
            )}
          </div>

          {/* Desktop Sort Dropdown */}
          <div className="hidden lg:flex items-center gap-3">
            <span className="font-heading text-xs font-bold uppercase tracking-wider text-neutral-400">
              Sort:
            </span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="px-4 py-2 rounded-full text-xs font-bold bg-white border border-neutral-200 text-neutral-800 outline-none cursor-pointer hover:border-neutral-900 transition-colors"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 2-COLUMN LAYOUT: SIDEBAR + PRODUCT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* DESKTOP SIDEBAR */}
          <aside className="hidden lg:block lg:col-span-3 bg-white p-6 rounded-3xl border border-neutral-200/80 sticky top-28">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-6">
              <h3 className="font-heading font-black text-sm uppercase tracking-wider text-neutral-900">
                Filter Drops
              </h3>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-[11px] font-bold text-[#FF462D] uppercase hover:underline"
                >
                  Reset
                </button>
              )}
            </div>

            <FiltersPanel {...filterPanelProps} />
          </aside>

          {/* PRODUCTS GRID */}
          <div className="lg:col-span-9">
            {loading ? (
              <div className="py-24 text-center">
                <div className="w-8 h-8 rounded-full border-2 border-[#FF462D] border-t-transparent animate-spin mx-auto mb-4" />
                <p className="font-heading text-xs uppercase tracking-widest text-neutral-500 font-bold">
                  Loading Drops...
                </p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-3xl border border-neutral-200 p-8">
                <PackageX size={40} className="mx-auto text-neutral-400 mb-4" />
                <h3 className="font-heading font-bold text-lg text-neutral-900 mb-2">
                  No Drops Match These Filters
                </h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-6">
                  Try clearing your size or price filters to see all available Genesis pieces.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 rounded-full bg-neutral-900 text-white font-heading text-xs font-bold uppercase tracking-wider"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.slice(0, visibleCount).map((product) => (
                  <Card key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Load More Button if applicable */}
            {filteredProducts.length > visibleCount && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                  className="px-8 py-3.5 rounded-full bg-neutral-900 hover:bg-[#FF462D] text-white font-heading text-xs font-bold uppercase tracking-widest transition-colors shadow-md"
                >
                  Load More Drops
                </button>
              </div>
            )}
          </div>

        </div>
      </main>

      {/* ================= MOBILE FILTERS DRAWER ================= */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="relative w-full bg-white rounded-t-[32px] p-6 max-h-[85vh] flex flex-col justify-between z-10"
            >
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-4">
                <h3 className="font-heading font-black text-base uppercase tracking-wider">
                  Filters & Sort
                </h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1 rounded-full bg-neutral-100"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pr-1">
                <FiltersPanel {...filterPanelProps} isMobile={true} />
              </div>

              <div className="pt-4 border-t border-neutral-200 mt-4 flex gap-3">
                <button
                  onClick={clearFilters}
                  className="flex-1 py-3.5 rounded-full bg-neutral-100 text-neutral-800 font-heading text-xs font-bold uppercase tracking-wider"
                >
                  Reset
                </button>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="flex-[2] py-3.5 rounded-full bg-[#FF462D] text-white font-heading text-xs font-bold uppercase tracking-wider shadow-lg"
                >
                  View ({filteredProducts.length}) Results
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}