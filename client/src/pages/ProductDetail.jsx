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
  Sparkles,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Scissors,
  Check,
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
  const [selectedColor, setSelectedColor] = useState("black"); // "black" or "white"
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("L");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Customizer state
  const [customStyle, setCustomStyle] = useState("line-art"); // "line-art" | "stencil"
  const [petName, setPetName] = useState("");
  const [petPhotoPreview, setPetPhotoPreview] = useState(null);
  const [petPhotoName, setPetPhotoName] = useState("");

  // Accordion state
  const [openAccordion, setOpenAccordion] = useState("craftsmanship");

  // Review states
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const foundProduct = products.find((item) => item._id === id || item.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      setSelectedImage(0);
      setSelectedSize(foundProduct.sizes?.[2] || foundProduct.sizes?.[0] || "L");
      setSelectedColor("black");
      if (foundProduct.id === "fur-custom-02" || foundProduct._id === "fur-custom-02") {
        setCustomStyle("stencil");
      } else {
        setCustomStyle("line-art");
      }
    }
  }, [products, id]);

  // Fetch reviews from backend
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

  // Image list derived from color selection or standard images
  const currentDisplayImage = useMemo(() => {
    if (!product) return "";
    if (product.images) {
      if (selectedColor === "black" && product.images.black) return product.images.black;
      if (selectedColor === "white" && product.images.white) return product.images.white;
    }
    const standardImages = [product.image1, product.image2, product.image3, product.image4].filter(Boolean);
    return standardImages[selectedImage] || standardImages[0] || "";
  }, [product, selectedColor, selectedImage]);

  const productThumbnails = useMemo(() => {
    if (!product) return [];
    if (product.images) {
      return [
        { key: "black", label: "Vintage Black", src: product.images.black },
        { key: "white", label: "Cloud White", src: product.images.white },
      ].filter((item) => Boolean(item.src));
    }
    return [product.image1, product.image2, product.image3, product.image4]
      .filter(Boolean)
      .map((src, i) => ({ key: `img-${i}`, label: `View ${i + 1}`, src }));
  }, [product]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((item) => item._id !== product._id && item.id !== product.id)
      .slice(0, 4);
  }, [products, product]);

  const isCustomizable =
    product?.customizable ||
    product?.category === "Customs" ||
    product?.id?.includes("custom") ||
    product?._id?.includes("custom");

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPetPhotoName(file.name);
      setPetPhotoPreview(URL.createObjectURL(file));
      setMessage("Pet photo attached! Artwork proof will be prepared.");
      setTimeout(() => setMessage(""), 3500);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    if (!userData) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    if (!selectedSize) {
      setMessage("Please select your streetwear size.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    if (isCustomizable && !petPhotoPreview) {
      setMessage("Please upload your pet photo for custom printing.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    try {
      setIsAdding(true);
      const success = await addToCart(product._id || product.id, selectedSize, quantity);
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

    if (!selectedSize) {
      setMessage("Please select your streetwear size.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    if (isCustomizable && !petPhotoPreview) {
      setMessage("Please upload your pet photo for custom printing.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    const success = await addToCart(product._id || product.id, selectedSize, quantity);
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
      setMessage("Please write your review thoughts.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    try {
      setReviewLoading(true);
      const res = await axios.post(
        `${serverUrl}/api/product/${product._id || product.id}/review`,
        {
          rating: reviewRating,
          comment: reviewText.trim(),
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        setMessage("Review posted! Thanks for rep'ing Furever Streetwear 🐾");
        setReviewText("");
        setReviewRating(5);
        const updated = await axios.get(`${serverUrl}/api/product/${product._id || product.id}/reviews`);
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
      <div className="min-h-screen bg-[#FAF6F2] flex flex-col justify-between">
        <Nav />
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center px-4">
          <div className="w-16 h-16 rounded-2xl bg-[#58545F] text-[#DC8E90] flex items-center justify-center mb-4 text-2xl font-black">
            🐾
          </div>
          <h2 className="font-display font-extrabold text-2xl text-[#2B2730] mb-2 tracking-tight">
            DROP NOT FOUND
          </h2>
          <p className="text-sm text-[#58545F] max-w-sm mb-6">
            This streetwear drop might have sold out or moved to our upcoming vault archive.
          </p>
          <button
            onClick={() => navigate("/collections")}
            className="px-6 py-3 rounded-full bg-[#58545F] hover:bg-[#DC8E90] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Explore Streetwear Drops
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const sizes = product.sizes && product.sizes.length ? product.sizes : ["S", "M", "L", "XL", "XXL"];
  const ngoContribution = Math.round(product.price * 0.10);

  return (
    <div className="min-h-screen bg-[#FAF6F2] text-[#2B2730] flex flex-col">
      <Nav />

      {/* ================= BREADCRUMB ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2 w-full">
        <div className="flex items-center gap-2 text-xs font-medium text-[#7E7785]">
          <Link to="/" className="hover:text-[#DC8E90] transition-colors">Home</Link>
          <span>/</span>
          <Link to="/collections" className="hover:text-[#DC8E90] transition-colors">Drops</Link>
          <span>/</span>
          <span className="text-[#2B2730] font-bold uppercase tracking-wider truncate max-w-xs">
            {product.name}
          </span>
        </div>
      </div>

      {/* ================= MAIN DETAIL VIEW ================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* LEFT: IMAGE STAGE & THUMBNAILS (6 COLS) */}
          <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-4">
            
            {/* Thumbnails */}
            {productThumbnails.length > 1 && (
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto no-scrollbar shrink-0">
                {productThumbnails.map((item, idx) => (
                  <button
                    key={item.key || idx}
                    type="button"
                    onClick={() => {
                      if (item.key === "black" || item.key === "white") {
                        setSelectedColor(item.key);
                      } else {
                        setSelectedImage(idx);
                      }
                    }}
                    className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer bg-[#F8F3EE] p-1 shrink-0 ${
                      (product.images && selectedColor === item.key) || (!product.images && selectedImage === idx)
                        ? "border-[#58545F] shadow-md ring-2 ring-[#DC8E90]/30"
                        : "border-[#EDE4DD] hover:border-[#DC8E90]"
                    }`}
                  >
                    <img src={item.src} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Stage (Authentic PDF Art, No Fake Clothes) */}
            <div className="relative flex-1 aspect-[4/5] rounded-3xl overflow-hidden bg-[#F8F3EE] border border-[#EDE4DD] shadow-sm flex items-center justify-center p-6">
              <img
                src={currentDisplayImage}
                alt={product.name}
                className="w-full h-full object-contain transition-opacity duration-300"
              />

              {/* Streetwear Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black tracking-wider uppercase bg-[#58545F] text-white shadow-sm">
                  240 GSM HEAVYWEIGHT
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black tracking-wider uppercase bg-[#DC8E90] text-white shadow-sm">
                  🐾 10% TO ANIMAL NGOs
                </span>
                {product.drop && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/95 text-[#2B2730] border border-[#EDE4DD]">
                    {product.drop}
                  </span>
                )}
              </div>

              {/* Color indicator tag */}
              <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#EDE4DD] text-[11px] font-bold text-[#2B2730] shadow-sm">
                Shade: {selectedColor === "black" ? "Vintage Black" : "Cloud White"}
              </div>
            </div>
          </div>

          {/* RIGHT: STREETWEAR DETAILS & CUSTOMIZER (6 COLS) */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              {/* Category, Drop & Rating */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#A97882] bg-[#DC8E90]/15 px-3 py-0.5 rounded-full border border-[#DC8E90]/30">
                    {product.category || "Unisex"}
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#7E7785]">
                    {product.subCategory || "Oversized Streetwear"}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-[#2B2730]">
                  <Star size={14} className="text-amber-500 fill-amber-500" />
                  <span>{(product.rating || 4.9).toFixed(1)}</span>
                  <span className="text-[#7E7785] font-normal">
                    ({product.reviews?.length || product.reviewCount || 38} reviews)
                  </span>
                </div>
              </div>

              {/* Title */}
              <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-[#2B2730] tracking-tight uppercase leading-tight mb-3">
                {product.name}
              </h1>

              {/* Pricing & Net Profit Grant Callout */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-display font-black text-3xl sm:text-4xl text-[#2B2730]">
                  {currency}{product.price}
                </span>
                <span className="text-base text-[#7E7785] line-through font-semibold">
                  {currency}{product.originalPrice || 899}
                </span>
                <span className="text-xs font-black text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Save {Math.round((((product.originalPrice || 899) - product.price) / (product.originalPrice || 899)) * 100)}% OFF
                </span>
              </div>

              {/* NGO Impact Ribbon - Warm Sophistication */}
              <div className="p-3.5 rounded-2xl bg-[#DC8E90]/15 border border-[#DC8E90]/30 text-[#2B2730] mb-6 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#DC8E90] text-white flex items-center justify-center shrink-0 text-base font-bold shadow-xs">
                  🐾
                </div>
                <div className="text-xs leading-relaxed">
                  <strong className="text-[#A97882] font-black uppercase tracking-wider block">
                    10% SOCIAL MISSION COMMITMENT
                  </strong>
                  <span>
                    Your purchase funds <strong>₹{ngoContribution}</strong> directly to local partner animal rescue shelters for stray food bowls, rabies vaccinations, and emergency medical care.
                  </span>
                </div>
              </div>

              {/* Product Description */}
              <p className="text-xs sm:text-sm text-[#58545F] leading-relaxed mb-6 font-medium">
                {product.description ||
                  "Heavyweight 240 GSM 100% Combed Cotton crafted for a relaxed, slouchy drop-shoulder streetwear fit. Features durable direct-to-garment line art graphics engineered to never peel or crack."}
              </p>

              {/* ================= DUAL COLOR SELECTOR ================= */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-xs font-black uppercase tracking-wider text-[#2B2730]">
                    Pick Shade: <span className="text-[#DC8E90] font-bold">{selectedColor === "black" ? "Vintage Black" : "Cloud White"}</span>
                  </label>
                  <span className="text-[11px] text-[#7E7785] font-semibold">240 GSM Reactive Dye</span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Black Dot */}
                  <button
                    type="button"
                    onClick={() => setSelectedColor("black")}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border-2 transition-all cursor-pointer ${
                      selectedColor === "black"
                        ? "border-[#58545F] bg-[#58545F] text-white shadow-sm"
                        : "border-[#EDE4DD] bg-white text-[#2B2730] hover:border-[#DC8E90]"
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-[#111111] border border-white/40 shrink-0" />
                    <span className="text-xs font-bold uppercase tracking-wider">Vintage Black</span>
                  </button>

                  {/* White Dot */}
                  <button
                    type="button"
                    onClick={() => setSelectedColor("white")}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border-2 transition-all cursor-pointer ${
                      selectedColor === "white"
                        ? "border-[#58545F] bg-white text-[#2B2730] shadow-sm ring-2 ring-[#DC8E90]/30"
                        : "border-[#EDE4DD] bg-white text-[#2B2730] hover:border-[#DC8E90]"
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-[#F5F5F3] border border-[#CCCCCC] shrink-0" />
                    <span className="text-xs font-bold uppercase tracking-wider">Cloud White</span>
                  </button>
                </div>
              </div>

              {/* ================= CUSTOMIZER 4-STEP BOX (FOR CUSTOM PET TEES) ================= */}
              {isCustomizable && (
                <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-white border-2 border-[#58545F] shadow-sm space-y-5">
                  <div className="flex items-center justify-between border-b border-[#EDE4DD] pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#DC8E90] text-white flex items-center justify-center text-xs font-bold">
                        ★
                      </div>
                      <h3 className="font-display font-black text-sm uppercase tracking-wider text-[#2B2730]">
                        Your Memory, Reimagined • 4-Step Customizer
                      </h3>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-[#58545F] text-white px-2 py-0.5 rounded-full">
                      Memory Series
                    </span>
                  </div>

                  {/* Step 1: Art Style */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-black uppercase tracking-wider text-[#2B2730]">
                        Step 1: Choose Art Style
                      </label>
                      <span className="text-[10px] text-[#7E7785] font-bold">Hand-drawn by artist</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setCustomStyle("line-art");
                          const lineArtProd = products.find((p) => p.id === "fur-custom-01" || p._id === "fur-custom-01");
                          if (lineArtProd) setProduct(lineArtProd);
                        }}
                        className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                          customStyle === "line-art"
                            ? "border-[#58545F] bg-[#FAF6F2] text-[#2B2730] shadow-xs"
                            : "border-[#EDE4DD] bg-white hover:border-[#DC8E90]"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs">Minimalist Line Art</span>
                          {customStyle === "line-art" && <Check size={14} className="text-[#DC8E90]" />}
                        </div>
                        <p className="text-[11px] text-[#58545F]">
                          Clean single-stroke outline highlighting your pet's silhouette.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setCustomStyle("stencil");
                          const stencilProd = products.find((p) => p.id === "fur-custom-02" || p._id === "fur-custom-02");
                          if (stencilProd) setProduct(stencilProd);
                        }}
                        className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                          customStyle === "stencil"
                            ? "border-[#58545F] bg-[#FAF6F2] text-[#2B2730] shadow-xs"
                            : "border-[#EDE4DD] bg-white hover:border-[#DC8E90]"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs">Graphic Stencil Art</span>
                          {customStyle === "stencil" && <Check size={14} className="text-[#DC8E90]" />}
                        </div>
                        <p className="text-[11px] text-[#58545F]">
                          Bold high-contrast streetwear stencil with deep shadow fills.
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Step 2: Pet Name */}
                  <div>
                    <label className="text-xs font-black uppercase tracking-wider text-[#2B2730] block mb-1.5">
                      Step 2: Pet's Name (Optional Tag Underneath)
                    </label>
                    <input
                      type="text"
                      value={petName}
                      onChange={(e) => setPetName(e.target.value)}
                      placeholder="e.g. Leo, Bruno, Simba (or leave blank)"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#EDE4DD] bg-[#FAF6F2] text-xs font-bold text-[#2B2730] focus:outline-none focus:border-[#58545F]"
                    />
                  </div>

                  {/* Step 3: Pet Photo Upload */}
                  <div>
                    <label className="text-xs font-black uppercase tracking-wider text-[#2B2730] block mb-1.5">
                      Step 3: Upload Pet Photo (Front-facing photo recommended)
                    </label>
                    <div className="relative border-2 border-dashed border-[#EDE4DD] hover:border-[#58545F] rounded-2xl p-4 text-center bg-[#FAF6F2] transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      {petPhotoPreview ? (
                        <div className="flex items-center gap-3">
                          <img
                            src={petPhotoPreview}
                            alt="Pet preview"
                            className="w-14 h-14 rounded-xl object-cover border border-[#EDE4DD]"
                          />
                          <div className="text-left flex-1 min-w-0">
                            <p className="text-xs font-bold text-[#2B2730] truncate">{petPhotoName}</p>
                            <p className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                              <CheckCircle2 size={12} /> Ready for hand-drawing
                            </p>
                          </div>
                          <span className="text-[10px] font-bold text-[#58545F] underline">Change</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-2">
                          <UploadCloud size={24} className="text-[#DC8E90] mb-1.5" />
                          <p className="text-xs font-bold text-[#2B2730]">
                            Click or drag to upload your pet photo
                          </p>
                          <p className="text-[10px] text-[#7E7785] mt-0.5">
                            PNG, JPG or HEIC up to 25MB
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Step 4: Digital WhatsApp Proof Promise */}
                  <div className="p-3 rounded-xl bg-[#FFC5A6]/20 border border-[#FFC5A6]/40 text-[#2B2730] text-xs flex items-start gap-2.5">
                    <span className="text-base">📲</span>
                    <div className="text-[11px] leading-relaxed">
                      <strong>FREE WhatsApp Digital Proof in 24 Hours:</strong> Before anything goes to our high-density garment printers, our design team will send you the vector artwork proof on WhatsApp for your 100% approval.
                    </div>
                  </div>
                </div>
              )}

              {/* Sizing Selector */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-xs font-black uppercase tracking-wider text-[#2B2730]">
                    Select Streetwear Size: <strong className="text-[#DC8E90]">{selectedSize || "None"}</strong>
                  </label>
                  <span className="text-[11px] font-bold text-[#58545F] underline cursor-pointer">
                    📏 Boxy Drop-Shoulder Guide
                  </span>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {sizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`min-w-[52px] px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                        selectedSize === sz
                          ? "bg-[#58545F] text-white shadow-sm ring-2 ring-[#DC8E90]/30"
                          : "bg-white text-[#2B2730] border border-[#EDE4DD] hover:border-[#58545F]"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-[#7E7785] mt-2 font-medium">
                  💡 <em>True-to-size streetwear cut. If you prefer an ultra-baggy 90s skater drape, size up by 1.</em>
                </p>
              </div>

              {/* Quantity & CTA Buttons */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  {/* Quantity Stepper */}
                  <div className="inline-flex items-center border border-[#EDE4DD] rounded-full bg-white p-1 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-9 h-9 flex items-center justify-center text-[#58545F] hover:text-[#2B2730] hover:bg-[#FAF6F2] rounded-full transition-colors cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-black text-[#2B2730]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-9 h-9 flex items-center justify-center text-[#58545F] hover:text-[#2B2730] hover:bg-[#FAF6F2] rounded-full transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="flex-1 py-4 px-6 rounded-full bg-[#58545F] hover:bg-[#2B2730] text-white font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <ShoppingBag size={18} />
                    <span>{isAdding ? "Adding Drop..." : "Add to Street Bag 🐾"}</span>
                  </button>
                </div>

                {/* Instant Buy Now */}
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full py-4 px-6 rounded-full bg-[#DC8E90] hover:bg-[#A97882] text-white font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Instant Buy Drop (₹{product.price * quantity})</span>
                  <ArrowRight size={16} />
                </button>

                {/* Alerts / Feedback message */}
                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-2xl bg-[#58545F] text-white text-xs font-bold flex items-center gap-2 shadow-lg"
                  >
                    <AlertCircle size={16} className="text-[#FFC5A6] shrink-0" />
                    <span>{message}</span>
                  </motion.div>
                )}
              </div>

              {/* Fast Trust Indicators */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-white border border-[#EDE4DD] mb-8">
                <div className="flex items-center gap-2.5 text-xs font-bold text-[#2B2730]">
                  <Truck size={16} className="text-[#DC8E90] shrink-0" />
                  <span>Free Shipping on All Orders</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold text-[#2B2730]">
                  <RotateCcw size={16} className="text-[#DC8E90] shrink-0" />
                  <span>7-Day Easy Size Exchanges</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold text-[#2B2730]">
                  <ShieldCheck size={16} className="text-[#DC8E90] shrink-0" />
                  <span>240 GSM Combed French Terry</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold text-[#2B2730]">
                  <Heart size={16} className="text-[#DC8E90] shrink-0 fill-[#DC8E90]" />
                  <span>10% Net Profit to Shelters</span>
                </div>
              </div>

              {/* Accordions: Craftsmanship, Sizing, NGO Grant */}
              <div className="space-y-2 border-t border-[#EDE4DD] pt-6">
                {[
                  {
                    id: "craftsmanship",
                    title: "👕 240 GSM Streetwear Craftsmanship",
                    content:
                      "Engineered with 100% combed cotton, French Terry loop knitting, and reinforced ribbed crew collars that do not sag after repeated washes. Pre-shrunk to retain its boxy streetwear silhouette.",
                  },
                  {
                    id: "ngo-impact",
                    title: "🐾 How Your 10% Donation Works",
                    content:
                      `With every order of this tee, ₹${ngoContribution} is disbursed to our verified animal rescue shelter partners (PAWS India, Friendicoes, and Stray Relief). We publish quarterly transparent audit records on our website.`,
                  },
                  {
                    id: "shipping",
                    title: "📦 Dispatch & Delivery Timeline",
                    content:
                      "Regular Drop 001 tees dispatch within 24-48 hours. Custom Pet Tees require 24 hours for artist proof generation and 48 hours for high-density curing. Doorstep delivery takes 3-5 business days across all Indian pin codes.",
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    className="border border-[#EDE4DD] rounded-2xl bg-white overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenAccordion(openAccordion === item.id ? "" : item.id)}
                      className="w-full p-4 flex items-center justify-between text-left font-display font-black text-xs uppercase tracking-wider text-[#2B2730]"
                    >
                      <span>{item.title}</span>
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${
                          openAccordion === item.id ? "rotate-180 text-[#DC8E90]" : "text-[#7E7785]"
                        }`}
                      />
                    </button>
                    {openAccordion === item.id && (
                      <div className="px-4 pb-4 text-xs text-[#58545F] leading-relaxed border-t border-[#FAF6F2] pt-2 font-medium">
                        {item.content}
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>

        {/* ================= REVIEWS SECTION ================= */}
        <section className="mt-20 pt-12 border-t border-[#EDE4DD]">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#A97882] bg-[#DC8E90]/15 px-3 py-1 rounded-full border border-[#DC8E90]/30">
                Community Feedback
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-[#2B2730] uppercase tracking-tight mt-2">
                Streetwear Verified Reviews 🐾
              </h2>
              <p className="text-xs text-[#58545F] mt-1 font-medium">
                Real fits and feedback from pet lovers and streetwear creators across India.
              </p>
            </div>

            {/* Submit Review Form */}
            <div className="p-6 rounded-3xl bg-white border border-[#EDE4DD] shadow-2xs mb-10">
              <h3 className="font-display font-black text-xs uppercase tracking-wider text-[#2B2730] mb-3">
                Rate & Review This Streetwear Drop
              </h3>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#58545F]">Your Rating:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setReviewRating(s)}
                        className="cursor-pointer"
                      >
                        <Star
                          size={18}
                          className={
                            reviewRating >= s
                              ? "text-amber-500 fill-amber-500"
                              : "text-[#D8D8D8]"
                          }
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share details on the 240 GSM cotton weight, boxy drape, print clarity, or sizing..."
                  rows={3}
                  className="w-full p-3.5 rounded-2xl bg-[#FAF6F2] border border-[#EDE4DD] text-xs text-[#2B2730] placeholder-[#7E7785] focus:outline-none focus:border-[#58545F] font-medium"
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={reviewLoading}
                    className="px-6 py-2.5 rounded-full bg-[#58545F] hover:bg-[#DC8E90] text-white text-xs font-black uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {reviewLoading ? "Posting..." : "Post Review 🐾"}
                  </button>
                </div>
              </form>
            </div>

            {/* Reviews List */}
            {product.reviews && product.reviews.length > 0 ? (
              <div className="space-y-4">
                {product.reviews.map((rev, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white border border-[#EDE4DD] shadow-2xs"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-xs text-[#2B2730] uppercase tracking-wider">
                          {rev.name || "Streetwear Creator"}
                        </span>
                        <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Verified Buyer
                        </span>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[...Array(rev.rating || 5)].map((_, i) => (
                          <Star key={i} size={12} className="text-amber-500 fill-amber-500" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-[#58545F] leading-relaxed font-medium">{rev.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-[#7E7785] font-medium">
                No written reviews yet. Be the first to rock and review this 240 GSM drop!
              </div>
            )}
          </div>
        </section>

        {/* ================= RELATED STREETWEAR DROPS ================= */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 pt-12 border-t border-[#EDE4DD]">
            <div className="text-center mb-10">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#DC8E90]">
                More from Drop 001
              </span>
              <h3 className="font-display font-black text-2xl text-[#2B2730] uppercase tracking-tight mt-1">
                Complete Your Street Fit 🐾
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <Card key={rel._id || rel.id} product={rel} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}