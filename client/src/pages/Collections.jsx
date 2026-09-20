import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, SlidersHorizontal, Sparkles, Star, Check } from "lucide-react";
import Nav from "../components/Nav";
import Card from "../components/Card";
import Footer from "../components/Footer";
import { shopDataContext } from "../context/ShopContext";

const CATEGORIES = ["All", "Unisex", "Men", "Women", "Customs"];
const SUB_CATEGORIES = ["All", "Oversized Drops", "Custom Pet Tee", "Graphic Tees"];
const SIZES = ["S", "M", "L", "XL", "XXL"];
const SORT_OPTIONS = [
  { value: "newest", label: "Latest Drops First" },
  { value: "oldest", label: "Drop Chronology" },
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
      className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
        active
          ? "bg-[#58545F] text-white shadow-xs"
          : "bg-white text-[#58545F] hover:bg-[#F5EFEB] hover:text-[#2B2730] border border-[#EDE4DD]"
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
    <div className="flex flex-col gap-6 text-[#2B2730]">
      {/* Category */}
      <div>
        <p className="font-display text-[11px] font-black uppercase tracking-wider text-[#7E7785] mb-2.5">
          Streetwear Category
        </p>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => (
            <PillButton key={c} active={category === c} onClick={() => setCategory(c)}>
              {c === "Customs" ? "🎨 Customs" : c === "Unisex" ? "⚡ Unisex" : c}
            </PillButton>
          ))}
        </div>
      </div>

      {/* Sub Category */}
      <div>
        <p className="font-display text-[11px] font-black uppercase tracking-wider text-[#7E7785] mb-2.5">
          Collection Drop Type
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

      {/* Streetwear Sizes */}
      <div>
        <p className="font-display text-[11px] font-black uppercase tracking-wider text-[#7E7785] mb-2.5">
          Streetwear Size (Boxy Fit)
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
          <p className="font-display text-[11px] font-black uppercase tracking-wider text-[#7E7785]">
            Price Range
          </p>
          <span className="text-xs font-black text-[#DC8E90]">
            ₹{priceRange[0]} - ₹{priceRange[1]}
          </span>
        </div>
        <div className="relative w-full h-6 mt-2 flex items-center">
          <div className="absolute left-0 right-0 h-1.5 bg-[#EDE4DD] rounded-full w-full" />
          <div
            className="absolute h-1.5 bg-[#58545F] rounded-full"
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
            className="dual-range-slider absolute w-full h-1.5 appearance-none pointer-events-none bg-transparent left-0 top-1/2 -translate-y-1/2 m-0 p-0 outline-none"
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
            className="dual-range-slider absolute w-full h-1.5 appearance-none pointer-events-none bg-transparent left-0 top-1/2 -translate-y-1/2 m-0 p-0 outline-none"
            style={{ zIndex: "4" }}
          />
        </div>
        <div className="flex justify-between items-center text-[10px] text-[#7E7785] font-bold mt-1">
          <span>₹{priceBounds.min}</span>
          <span>₹{priceBounds.max}</span>
        </div>
      </div>

      {/* Mobile Sort Controls */}
      {isMobile && (
        <div>
          <p className="font-display text-[11px] font-black uppercase tracking-wider text-[#7E7785] mb-2.5">
            Sort Streetwear Drops
          </p>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl text-xs font-bold bg-white text-[#2B2730] border border-[#EDE4DD] outline-none cursor-pointer focus:border-[#58545F] transition-all"
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
      <div className="pt-3 border-t border-[#EDE4DD]">
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={bestsellerOnly}
            onChange={(e) => setBestsellerOnly(e.target.checked)}
            className="w-4 h-4 rounded border-[#EDE4DD] accent-[#58545F] cursor-pointer"
          />
          <span className="text-xs font-bold text-[#2B2730]">
            Drop 001 Bestsellers Only ⭐
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
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: #58545F;
            cursor: pointer;
            border: 2.5px solid white;
            box-shadow: 0 1px 4px rgba(88,84,95,0.3);
          }
          .dual-range-slider::-moz-range-thumb {
            pointer-events: auto;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: #58545F;
            cursor: pointer;
            border: 2.5px solid white;
            box-shadow: 0 1px 4px rgba(88,84,95,0.3);
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

  // Read category from URL query parameters if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const catParam = params.get("category");
    if (catParam) {
      setCategory(catParam);
    }
  }, [location.search]);

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
  }, [
    allCollectionItems,
    search,
    category,
    subCategory,
    selectedSizes,
    priceRange,
    sortOption,
    bestsellerOnly,
  ]);

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  const hasActiveFilters =
    category !== "All" ||
    subCategory !== "All" ||
    selectedSizes.length > 0 ||
    priceRange[0] !== priceBounds.min ||
    priceRange[1] !== priceBounds.max ||
    bestsellerOnly ||
    Boolean(search);

  return (
    <div className="min-h-screen bg-[#FAF6F2] text-[#2B2730] flex flex-col">
      <Nav />

      {/* ================= PAGE HEADER ================= */}
      <section className="relative w-full bg-[#FAF6F2] py-12 sm:py-16 border-b border-[#EDE4DD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#58545F] text-white text-[11px] font-black uppercase tracking-wider mb-2.5 shadow-xs">
                <Sparkles size={13} className="text-[#FDAC98]" />
                <span>Heavyweight Streetwear Catalog</span>
              </div>
              <h1 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-[#2B2730]">
                FUREVER{" "}
                <span className="text-[#DC8E90]">
                  STREET DROPS.
                </span>
              </h1>
            </div>

            <p className="text-xs sm:text-sm text-[#58545F] max-w-sm font-medium">
              Heavyweight 240 GSM Combed Cotton oversized graphic tees & customizable pet line art memory apparel. 10% net profit donated to local animal shelters.
            </p>
          </div>

          {/* Quick Category Tab Bar */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-8">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  category === cat
                    ? "bg-[#58545F] text-white shadow-xs"
                    : "bg-white text-[#58545F] hover:bg-[#F5EFEB] border border-[#EDE4DD]"
                }`}
              >
                {cat === "All" ? "🐾 All Drops" : cat === "Customs" ? "🎨 Custom Pet Tees" : cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Top Control Bar */}
        <div className="flex items-center justify-between gap-4 pb-6 mb-8 border-b border-[#EDE4DD]">
          
          <div className="flex items-center gap-3">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-[#EDE4DD] text-xs font-bold text-[#2B2730] shadow-xs cursor-pointer"
            >
              <SlidersHorizontal size={14} className="text-[#DC8E90]" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-[#DC8E90]" />
              )}
            </button>

            <span className="text-xs font-bold text-[#58545F]">
              Showing <strong className="text-[#2B2730]">{displayedProducts.length}</strong> of{" "}
              {filteredProducts.length} streetwear drops
            </span>
          </div>

          {/* Desktop Sort Dropdown */}
          <div className="hidden lg:flex items-center gap-2">
            <span className="text-xs text-[#7E7785] font-semibold">Sort by:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="px-4 py-2 rounded-full bg-white border border-[#EDE4DD] text-xs font-bold text-[#2B2730] outline-none cursor-pointer focus:border-[#58545F] shadow-xs"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs font-bold text-[#DC8E90] hover:underline cursor-pointer"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Layout: Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* DESKTOP FILTERS SIDEBAR */}
          <aside className="hidden lg:block lg:col-span-3 bg-white p-6 rounded-3xl border border-[#EDE4DD] shadow-xs h-fit sticky top-28">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#F5EFEB]">
              <h3 className="font-display font-black text-xs uppercase tracking-wider text-[#2B2730]">
                Filters
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-[10px] font-bold uppercase tracking-wider text-[#DC8E90] hover:underline cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>

            <FiltersPanel
              category={category}
              setCategory={setCategory}
              subCategory={subCategory}
              setSubCategory={setSubCategory}
              selectedSizes={selectedSizes}
              toggleSize={toggleSize}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              priceBounds={priceBounds}
              sortOption={sortOption}
              setSortOption={setSortOption}
              bestsellerOnly={bestsellerOnly}
              setBestsellerOnly={setBestsellerOnly}
            />
          </aside>

          {/* PRODUCTS GRID AREA (9 COLS) */}
          <div ref={productsRef} className="lg:col-span-9">
            {displayedProducts.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white border border-[#EDE4DD] shadow-xs">
                <div className="w-16 h-16 rounded-full bg-[#FAF6F2] text-[#DC8E90] flex items-center justify-center mx-auto mb-4 text-2xl">
                  🐾
                </div>
                <h3 className="font-display font-black text-lg uppercase tracking-tight text-[#2B2730] mb-2">
                  No Streetwear Drops Matched
                </h3>
                <p className="text-xs text-[#58545F] max-w-sm mx-auto mb-6 font-medium">
                  Try adjusting your price range, clearing filters, or exploring all unisex oversized drops.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2.5 rounded-full bg-[#58545F] text-white text-xs font-black uppercase tracking-wider hover:bg-[#2B2730] transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {displayedProducts.map((p) => (
                  <Card key={p._id || p.id} product={p} />
                ))}
              </div>
            )}

            {/* Load More Button */}
            {visibleCount < filteredProducts.length && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                  className="px-8 py-3.5 rounded-full bg-white border border-[#58545F] hover:bg-[#58545F] hover:text-white text-[#58545F] font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-xs cursor-pointer"
                >
                  Load More Drops ({filteredProducts.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </div>

        </div>

      </main>

      {/* MOBILE FILTERS MODAL */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-xs bg-white text-[#2B2730] h-full shadow-2xl flex flex-col z-10 p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#EDE4DD] mb-6">
                <h3 className="font-display font-black text-sm uppercase tracking-wider text-[#2B2730]">
                  Filter Streetwear Drops
                </h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#FAF6F2] flex items-center justify-center text-[#7E7785] hover:text-[#2B2730]"
                >
                  <X size={16} />
                </button>
              </div>

              <FiltersPanel
                category={category}
                setCategory={setCategory}
                subCategory={subCategory}
                setSubCategory={setSubCategory}
                selectedSizes={selectedSizes}
                toggleSize={toggleSize}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                priceBounds={priceBounds}
                sortOption={sortOption}
                setSortOption={setSortOption}
                bestsellerOnly={bestsellerOnly}
                setBestsellerOnly={setBestsellerOnly}
                isMobile={true}
              />

              <div className="pt-6 mt-6 border-t border-[#EDE4DD] flex gap-3">
                <button
                  onClick={() => {
                    clearFilters();
                    setMobileFiltersOpen(false);
                  }}
                  className="flex-1 py-3 rounded-full bg-[#FAF6F2] border border-[#EDE4DD] text-xs font-bold uppercase tracking-wider text-[#58545F]"
                >
                  Reset
                </button>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="flex-1 py-3 rounded-full bg-[#58545F] hover:bg-[#2B2730] text-white text-xs font-black uppercase tracking-wider"
                >
                  Apply Filters
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}