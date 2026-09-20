import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  Star,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Heart,
  ChevronDown,
  Flame,
  Check,
  Clock,
  Sparkles,
  Send,
  AlertCircle,
  Share2,
} from "lucide-react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Card from "../components/Card";
import { shopDataContext } from "../context/ShopContext";
import { userDataContext } from "../context/UserContext";
import { authDataContext } from "../context/Authcontext";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    products = [],
    currency = "₹",
    addToCart,
    setIsCartDrawerOpen,
  } = useContext(shopDataContext) || {};
  const { userData } = useContext(userDataContext) || {};
  const { serverUrl } = useContext(authDataContext) || {};

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Accordion state
  const [openAccordion, setOpenAccordion] = useState("fabric");

  // Review states
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const foundProduct = products.find((item) => item._id === id);
    setProduct(foundProduct || null);
    setSelectedImage(0);
    setSelectedSize("");
    setQuantity(1);
  }, [products, id]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      if (!id || !serverUrl) return;
      try {
        setReviewsLoading(true);
        const response = await axios.get(`${serverUrl}/api/product/${id}/reviews`);
        if (response.data.success) {
          setProduct((prev) => (prev ? { ...prev, ...response.data } : prev));
        }
      } catch (err) {
        console.log("Fetch reviews error:", err);
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  }, [id, serverUrl]);

  const productImages = useMemo(() => {
    if (!product) return [];
    return [product.image1, product.image2, product.image3, product.image4].filter(Boolean);
  }, [product]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(
        (item) =>
          item._id !== product._id &&
          (item.category === product.category || item.subCategory === product.subCategory)
      )
      .slice(0, 4);
  }, [products, product]);

  const handleAddToCart = async () => {
    if (!product) return;

    if (!userData) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    if (product.sizes?.length > 0 && !selectedSize) {
      setMessage("Please select a size first.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    try {
      setIsAdding(true);
      const success = await addToCart(product._id, selectedSize || "One Size", quantity);
      if (success) {
        if (typeof setIsCartDrawerOpen === "function") {
          setIsCartDrawerOpen(true);
        }
      }
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;

    if (!userData) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    if (product.sizes?.length > 0 && !selectedSize) {
      setMessage("Please select a size first.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    const success = await addToCart(product._id, selectedSize || "One Size", quantity);
    if (success) {
      navigate("/placeorder");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!userData) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    if (!reviewText.trim()) {
      setMessage("Please write a review.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    try {
      setReviewLoading(true);
      const res = await axios.post(
        `${serverUrl}/api/product/${product._id}/review`,
        {
          rating: reviewRating,
          comment: reviewText.trim(),
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        setMessage("Review submitted! Thank you for the support.");
        setReviewText("");
        setReviewRating(5);
        // Refresh reviews
        const updated = await axios.get(`${serverUrl}/api/product/${product._id}/reviews`);
        if (updated.data.success) {
          setProduct((prev) => ({ ...prev, ...updated.data }));
        }
      }
    } catch (error) {
      console.log("Review submit error:", error);
      setMessage(error.response?.data?.message || "Failed to submit review.");
    } finally {
      setReviewLoading(false);
      setTimeout(() => setMessage(""), 4000);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-between">
        <Nav />
        <div className="py-32 text-center px-4">
          <h2 className="font-heading font-black text-3xl sm:text-5xl text-neutral-900 uppercase mb-4">
            Piece Not Found
          </h2>
          <p className="text-sm text-neutral-500 mb-8">
            This archive piece may have sold out or retired.
          </p>
          <button
            onClick={() => navigate("/collections")}
            className="px-8 py-4 rounded-full bg-neutral-950 text-white font-heading text-xs font-bold uppercase tracking-wider"
          >
            Back to All Drops
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const sizes = product.sizes && product.sizes.length ? product.sizes : ["S", "M", "L", "XL", "XXL"];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#121217] flex flex-col">
      <Nav />

      {/* ================= BREADCRUMB ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2 w-full">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
          <Link to="/" className="hover:text-neutral-900 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/collections" className="hover:text-neutral-900 transition-colors">Drops</Link>
          <span>/</span>
          <span className="text-neutral-900 truncate">{product.name}</span>
        </div>
      </div>

      {/* ================= MAIN PDP CONTAINER ================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* LEFT: GALLERY (THUMBNAILS + HERO IMAGE) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            
            {/* Thumbnail Strip */}
            {productImages.length > 1 && (
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto no-scrollbar shrink-0">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-16 h-20 sm:w-20 sm:h-24 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedImage === idx
                        ? "border-[#FF462D] shadow-md scale-95"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover bg-neutral-100" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Stage Image */}
            <div className="relative flex-1 aspect-[4/5] rounded-3xl overflow-hidden bg-[#F0EAE1] border border-neutral-200/80 shadow-lg group">
              <img
                src={productImages[selectedImage] || product.image1}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {product.bestseller && (
                  <span className="badge-streetwear bg-[#0D0D11] text-white border border-white/10 shadow-md flex items-center gap-1">
                    <Flame size={12} className="text-[#FF462D]" fill="currentColor" />
                    Genesis Bestseller
                  </span>
                )}
                <span className="badge-streetwear bg-white/95 text-neutral-900 border border-neutral-200 shadow-md">
                  240 GSM French Terry
                </span>
              </div>
            </div>

          </div>

          {/* RIGHT: DETAILS, SIZES, CTAS, ACCORDIONS */}
          <div className="lg:col-span-5 flex flex-col">
            
            {/* Tag & Rating */}
            <div className="flex items-center justify-between gap-4 mb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#FF462D]">
                {product.category} • {product.subCategory}
              </span>

              <div className="flex items-center gap-1 text-xs font-bold text-neutral-800">
                <Star size={13} className="text-[#FF462D] fill-[#FF462D]" />
                <span>{(product.rating || 5).toFixed(1)}</span>
                <span className="text-neutral-400 font-normal">
                  ({product.reviewCount || product.reviews?.length || 24} reviews)
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-neutral-950 mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Price Block */}
            <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-neutral-200">
              <span className="font-heading font-extrabold text-3xl sm:text-4xl text-neutral-950">
                {currency}{product.price}
              </span>
              <span className="text-sm text-neutral-400 line-through">
                {currency}{Math.round(product.price * 1.35)}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#FF462D]/10 text-[#FF462D] text-xs font-extrabold uppercase">
                Save 25%
              </span>
            </div>

            {/* Stock Urgency Indicator */}
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-700 mb-6 bg-white p-3 rounded-2xl border border-neutral-200/80">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF462D] animate-ping" />
              <span>
                <strong className="text-neutral-900">High Demand:</strong> Batch limited to 150 pieces. Ships within 24h.
              </span>
            </div>

            {/* Size Selector */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2.5">
                <span className="font-heading text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Select Size (Oversized Boxy Fit)
                </span>
                <span className="text-xs text-neutral-400 underline cursor-pointer">
                  Size Guide
                </span>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`h-12 min-w-[50px] px-4 rounded-2xl font-heading text-xs font-black uppercase transition-all duration-200 cursor-pointer ${
                      selectedSize === sz
                        ? "bg-[#0D0D11] text-white shadow-md scale-105"
                        : "bg-white border border-neutral-200 text-neutral-800 hover:border-neutral-900"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-8">
              <span className="font-heading text-xs font-bold uppercase tracking-wider text-neutral-900">
                Quantity:
              </span>
              <div className="flex items-center border border-neutral-200 bg-white rounded-full overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors"
                >
                  -
                </button>
                <span className="w-10 text-center font-heading font-bold text-sm">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-10 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Feedback Message */}
            {message && (
              <div className="mb-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{message}</span>
              </div>
            )}

            {/* PRIMARY ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-3.5 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="flex-1 py-4 px-6 rounded-full bg-[#0D0D11] hover:bg-[#FF462D] active:scale-[0.99] text-white font-heading text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <ShoppingBag size={16} />
                <span>{isAdding ? "Adding..." : "Add to Bag"}</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 py-4 px-6 rounded-full bg-[#FF462D] hover:bg-[#E03B24] active:scale-[0.99] text-white font-heading text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-xl shadow-[#FF462D]/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Buy Now</span>
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Value Props Strip */}
            <div className="grid grid-cols-2 gap-3 mb-8 pt-6 border-t border-neutral-200 text-xs text-neutral-600 font-medium">
              <div className="flex items-center gap-2">
                <Truck size={16} className="text-[#FF462D]" />
                <span>Free Express Delivery &gt; ₹999</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw size={16} className="text-[#FF462D]" />
                <span>7-Day Easy Size Exchange</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#FF462D]" />
                <span>100% Bio-Washed Cotton</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart size={16} className="text-[#FF462D]" fill="currentColor" />
                <span>10% Dedicated to Rescues</span>
              </div>
            </div>

            {/* ACCORDIONS */}
            <div className="space-y-3">
              {/* Fabric & Weight */}
              <div className="border border-neutral-200 bg-white rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenAccordion(openAccordion === "fabric" ? "" : "fabric")}
                  className="w-full p-4.5 flex items-center justify-between text-left font-heading text-xs font-bold uppercase tracking-wider text-neutral-900 cursor-pointer"
                >
                  <span>Fabric & Craftsmanship</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      openAccordion === "fabric" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openAccordion === "fabric" && (
                  <div className="px-4.5 pb-4 text-xs text-neutral-500 leading-relaxed space-y-1.5 border-t border-neutral-100 pt-3">
                    <p>• <strong>Weight:</strong> 240 GSM Luxury French Terry</p>
                    <p>• <strong>Material:</strong> 100% Super-Combed Bio-Washed Organic Cotton</p>
                    <p>• <strong>Silhouette:</strong> Boxy fit with relaxed dropped shoulders</p>
                    <p>• <strong>Neckline:</strong> 1.25" Heavy-duty ribbed collar that will not bacon</p>
                    <p>• <strong>Print:</strong> High-density vegan water-based screenprint</p>
                  </div>
                )}
              </div>

              {/* Size & Fit Guide */}
              <div className="border border-neutral-200 bg-white rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenAccordion(openAccordion === "fit" ? "" : "fit")}
                  className="w-full p-4.5 flex items-center justify-between text-left font-heading text-xs font-bold uppercase tracking-wider text-neutral-900 cursor-pointer"
                >
                  <span>Silhouette & Fit Recommendation</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      openAccordion === "fit" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openAccordion === "fit" && (
                  <div className="px-4.5 pb-4 text-xs text-neutral-500 leading-relaxed border-t border-neutral-100 pt-3">
                    This tee is cut for an oversized, boxy street look. We recommend picking your standard size for the intended relaxed drop-shoulder drape. If you prefer a snug, regular fit, order one size down.
                  </div>
                )}
              </div>

              {/* Animal Welfare Impact */}
              <div className="border border-neutral-200 bg-white rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenAccordion(openAccordion === "mission" ? "" : "mission")}
                  className="w-full p-4.5 flex items-center justify-between text-left font-heading text-xs font-bold uppercase tracking-wider text-neutral-900 cursor-pointer"
                >
                  <span>The FurEver Rescue Mission</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      openAccordion === "mission" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openAccordion === "mission" && (
                  <div className="px-4.5 pb-4 text-xs text-neutral-500 leading-relaxed border-t border-neutral-100 pt-3">
                    10% of profit from this specific order is routed directly to local animal rescues for street dog vaccination, emergency surgery funds, and daily feeding drives.
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* ================= REVIEWS SECTION ================= */}
        <section className="mt-20 pt-16 border-t border-neutral-200">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-heading font-black text-3xl sm:text-4xl uppercase tracking-tight text-neutral-950 mb-2">
                VERIFIED DROP REVIEWS
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 font-medium">
                Honest feedback from rebels wearing this genesis drop.
              </p>
            </div>

            {/* Review Submission Form */}
            <div className="p-8 rounded-3xl bg-white border border-neutral-200/80 shadow-md mb-12">
              <h3 className="font-heading font-bold text-base uppercase text-neutral-900 mb-4">
                Leave A Review
              </h3>

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-600 uppercase mb-2">
                    Rating:
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="p-1 cursor-pointer"
                      >
                        <Star
                          size={20}
                          className={`${
                            star <= reviewRating
                              ? "text-[#FF462D] fill-[#FF462D]"
                              : "text-neutral-200"
                          } transition-colors`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <textarea
                    rows={3}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder={
                      userData
                        ? "How does the 240 GSM weight feel? How is the fit and collar?"
                        : "Sign in to write your review..."
                    }
                    className="w-full p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs sm:text-sm outline-none focus:border-neutral-900 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={reviewLoading}
                  className="px-8 py-3.5 rounded-full bg-[#0D0D11] hover:bg-[#FF462D] text-white font-heading text-xs font-bold uppercase tracking-widest transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  <span>{reviewLoading ? "Posting..." : "Post Review"}</span>
                  <Send size={13} />
                </button>
              </form>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((rev, idx) => (
                  <div
                    key={rev._id || idx}
                    className="p-6 rounded-2xl bg-white border border-neutral-200/80"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-neutral-100 font-bold text-xs flex items-center justify-center text-neutral-800">
                          {(rev.userName || "U")[0]}
                        </div>
                        <span className="font-heading font-bold text-sm text-neutral-900">
                          {rev.userName}
                        </span>
                        <span className="text-[10px] text-[#00A878] font-bold uppercase bg-[#00A878]/10 px-2 py-0.5 rounded-full">
                          Verified Buyer
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={12}
                            className={
                              s <= rev.rating
                                ? "text-[#FF462D] fill-[#FF462D]"
                                : "text-neutral-200"
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center text-neutral-400 text-xs font-medium">
                  Be the first rebel to review this genesis piece.
                </div>
              )}
            </div>

          </div>
        </section>

        {/* ================= RELATED DROPS ================= */}
        {relatedProducts.length > 0 && (
          <section className="mt-24 pt-16 border-t border-neutral-200">
            <h2 className="font-heading font-black text-2xl sm:text-3xl uppercase tracking-tight text-neutral-950 mb-8">
              MORE FROM THIS ARCHIVE
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <Card key={rel._id} product={rel} />
              ))}
            </div>
          </section>
        )}

      </main>

      <Footer />
    </div>
  );
}