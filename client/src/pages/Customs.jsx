import { useContext, useState, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowRight,
  Info,
} from "lucide-react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { shopDataContext } from "../context/ShopContext";
import { userDataContext } from "../context/UserContext";

const SIZES = ["S", "M", "L", "XL", "XXL"];
const MAX_FILE_SIZE_MB = 15;

export default function Customs() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const { products = [], addToCart, setIsCartDrawerOpen, currency = "₹" } =
    useContext(shopDataContext) || {};
  const { userData } = useContext(userDataContext) || {};

  // Color & Size
  const [selectedColor, setSelectedColor] = useState("black"); // "black" | "white"
  const [selectedSize, setSelectedSize] = useState("M");

  // PNG Upload State
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

  // Target product from catalog
  const customProduct =
    products.find((p) => p.id === "fur-custom-01" || p._id === "fur-custom-01") ||
    products.find((p) => p.customizable) || {
      _id: "fur-custom-01",
      name: "Custom Graphic Oversized Heavyweight Tee",
      price: 429,
      originalPrice: 799,
    };

  // Garment base mockup
  const garmentBase =
    selectedColor === "black"
      ? "/images/customs/lineart-black.png"
      : "/images/customs/lineart-white.png";

  const handleFileChange = (e) => {
    setUploadError("");
    setActionMessage("");
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate PNG
    if (file.type !== "image/png" && !file.name.toLowerCase().endsWith(".png")) {
      setUploadError("Please upload a PNG file with a transparent or clean background.");
      return;
    }

    // Validate file size (15MB)
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      setUploadError(`File is too large (${fileSizeMB.toFixed(1)}MB). Maximum allowed is ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    setUploadedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleRemoveFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setUploadedFile(null);
    setPreviewUrl(null);
    setUploadError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddToCart = async (buyNow = false) => {
    if (!selectedSize) {
      setActionMessage("Please select a size to proceed.");
      return;
    }

    try {
      setIsAdding(true);
      setActionMessage("");
      const prodId = customProduct._id || customProduct.id;
      const success = await addToCart(prodId, selectedSize, 1);

      if (success) {
        if (buyNow) {
          if (!userData) {
            navigate("/login", { state: { from: "/placeorder" } });
          } else {
            navigate("/placeorder");
          }
        } else if (typeof setIsCartDrawerOpen === "function") {
          setIsCartDrawerOpen(true);
        }
      }
    } catch (err) {
      console.error(err);
      setActionMessage("Unable to add to cart. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#141414] flex flex-col selection:bg-[#141414] selection:text-[#FAF8F5]">
      <Nav />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        
        {/* ================= EDITORIAL HEADER ================= */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 text-[11px] font-mono font-medium uppercase tracking-[0.18em] text-[#141414]/60 mb-3"
          >
            <span>Custom Studio</span>
            <span>•</span>
            <span>PNG Print Experience</span>
          </motion.div>

          <motion.h1
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl uppercase tracking-[0.16em] text-[#141414] mb-4 leading-none"
          >
            Custom
          </motion.h1>

          <motion.p
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="text-sm sm:text-base text-[#141414]/70 leading-relaxed font-normal max-w-2xl"
          >
            Upload your own high-resolution PNG artwork to preview on our signature 240 GSM heavyweight streetwear silhouette.
          </motion.p>
        </div>

        {/* ================= 2-COLUMN STUDIO EXPERIENCE ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          
          {/* LEFT: GARMENT MOCKUP PREVIEW (7 COLS) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="relative w-full aspect-[4/5] max-w-xl rounded-2xl bg-white border border-[#141414]/10 shadow-sm overflow-hidden flex items-center justify-center p-6 sm:p-8">
              
              {/* Garment Base Template */}
              <img
                src={garmentBase}
                alt="Furever Oversized Tee Mockup"
                className="w-full h-full object-contain pointer-events-none select-none"
              />

              {/* Uploaded Artwork Placement Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-[48%] h-[48%] flex items-center justify-center">
                  {previewUrl ? (
                    <motion.img
                      key={previewUrl}
                      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                      src={previewUrl}
                      alt="Uploaded artwork on garment"
                      className="max-w-full max-h-full object-contain filter drop-shadow-md"
                      style={{ objectFit: "contain" }}
                    />
                  ) : (
                    <div className="w-full h-full border-2 border-dashed border-[#141414]/25 rounded-lg flex flex-col items-center justify-center p-4 text-center bg-white/40 backdrop-blur-2xs">
                      <Upload size={22} className="text-[#141414]/40 mb-2" />
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#141414]/60">
                        PNG Artwork Area
                      </span>
                      <span className="text-[9px] text-[#141414]/40 mt-1">
                        Aspect ratio preserved
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Garment Tag Indicator */}
              <div className="absolute top-4 left-4 text-[10px] font-mono tracking-widest uppercase text-[#141414]/50">
                Mockup Preview • {selectedColor === "black" ? "Vintage Black" : "Paper White"}
              </div>
            </div>

            {/* Scale & placement note */}
            <p className="text-[11px] font-mono text-[#141414]/50 text-center mt-3 tracking-wide">
              On-screen digital mockup is an approximate layout preview.
            </p>
          </div>

          {/* RIGHT: UPLOAD & CONFIGURATION CONTROLS (5 COLS) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 1. PNG UPLOAD BOX */}
            <div className="p-6 rounded-2xl bg-white border border-[#141414]/10 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-heading font-black uppercase tracking-[0.14em] text-[#141414]">
                  01. Upload Design
                </span>
                <span className="text-[10px] font-mono text-[#141414]/50 uppercase tracking-widest">
                  PNG Only (Max {MAX_FILE_SIZE_MB}MB)
                </span>
              </div>

              {!uploadedFile ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#141414]/20 hover:border-[#141414] rounded-xl p-8 text-center cursor-pointer transition-colors bg-[#FAF8F5]/60 hover:bg-[#FAF8F5]"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".png,image/png"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="w-10 h-10 rounded-full bg-[#141414]/5 flex items-center justify-center mx-auto mb-3 text-[#141414]">
                    <Upload size={18} strokeWidth={1.8} />
                  </div>
                  <p className="text-xs font-heading font-bold uppercase tracking-wider text-[#141414] mb-1">
                    Select High-Res PNG File
                  </p>
                  <p className="text-[11px] text-[#141414]/60">
                    Transparent PNG recommended for clean garment printing.
                  </p>
                </div>
              ) : (
                <div className="border border-[#141414]/15 rounded-xl p-4 bg-[#FAF8F5]/80 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={previewUrl}
                      alt="Thumbnail"
                      className="w-12 h-12 rounded-lg object-contain bg-white border border-[#141414]/10 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-heading font-bold text-[#141414] truncate">
                        {uploadedFile.name}
                      </p>
                      <p className="text-[10px] font-mono text-emerald-700 flex items-center gap-1 mt-0.5">
                        <CheckCircle2 size={12} /> Ready for preview
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs font-heading font-bold uppercase tracking-wider text-[#141414]/70 hover:text-[#141414] underline cursor-pointer"
                    >
                      Replace
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      aria-label="Remove artwork"
                      className="w-7 h-7 rounded-full bg-[#141414]/5 hover:bg-[#141414]/10 flex items-center justify-center text-[#141414]/70 hover:text-[#141414] cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".png,image/png"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              )}

              {uploadError && (
                <div className="mt-3 flex items-start gap-2 text-rose-600 text-xs">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <span>{uploadError}</span>
                </div>
              )}
            </div>

            {/* 2. GARMENT SHADE */}
            <div className="p-6 rounded-2xl bg-white border border-[#141414]/10 shadow-xs">
              <span className="text-xs font-heading font-black uppercase tracking-[0.14em] text-[#141414] block mb-3">
                02. Garment Shade
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedColor("black")}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    selectedColor === "black"
                      ? "border-[#141414] bg-[#141414] text-[#FAF8F5]"
                      : "border-[#141414]/15 bg-transparent text-[#141414] hover:border-[#141414]/40"
                  }`}
                >
                  <span className="w-3 h-3 rounded-full bg-[#141414] border border-white/40" />
                  <span>Vintage Black</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedColor("white")}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    selectedColor === "white"
                      ? "border-[#141414] bg-[#FAF8F5] text-[#141414] shadow-xs"
                      : "border-[#141414]/15 bg-transparent text-[#141414] hover:border-[#141414]/40"
                  }`}
                >
                  <span className="w-3 h-3 rounded-full bg-[#FAF8F5] border border-black/30" />
                  <span>Paper White</span>
                </button>
              </div>
            </div>

            {/* 3. SIZE SELECTION */}
            <div className="p-6 rounded-2xl bg-white border border-[#141414]/10 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-heading font-black uppercase tracking-[0.14em] text-[#141414]">
                  03. Select Size
                </span>
                <span className="text-xs font-mono font-medium text-[#141414]/60">
                  Selected: {selectedSize}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {SIZES.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`py-2.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      selectedSize === sz
                        ? "bg-[#141414] text-[#FAF8F5]"
                        : "bg-transparent text-[#141414]/70 hover:text-[#141414] border border-[#141414]/15 hover:border-[#141414]/40"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. PRICING & CHECKOUT ACTIONS */}
            <div className="p-6 rounded-2xl bg-white border border-[#141414]/10 shadow-xs">
              <div className="flex items-baseline justify-between mb-4">
                <div>
                  <span className="text-[10px] font-mono text-[#141414]/50 uppercase tracking-widest block">
                    Custom Reservation
                  </span>
                  <span className="font-heading font-black text-3xl text-[#141414]">
                    {currency}{customProduct.price}
                  </span>
                </div>
                <span className="text-xs font-mono text-[#141414]/60">
                  240 GSM Combed Cotton
                </span>
              </div>

              {actionMessage && (
                <p className="text-xs text-rose-600 font-bold mb-3">{actionMessage}</p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleAddToCart(false)}
                  disabled={isAdding}
                  className="w-full py-3.5 rounded-full border border-[#141414] bg-transparent hover:bg-[#141414]/5 text-[#141414] font-heading font-bold text-xs uppercase tracking-[0.14em] transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isAdding ? "Adding..." : "Add to Cart"}
                </button>
                <button
                  type="button"
                  onClick={() => handleAddToCart(true)}
                  disabled={isAdding}
                  className="w-full py-3.5 rounded-full bg-[#141414] hover:bg-[#141414]/90 text-[#FAF8F5] font-heading font-bold text-xs uppercase tracking-[0.14em] transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                  <span>Order Now</span>
                  <ArrowRight
                    size={14}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </button>
              </div>

              {/* Truthful Backend Limitation Disclaimer */}
              <div className="mt-4 p-3 rounded-xl bg-[#FAF8F5] border border-[#141414]/10 text-[11px] text-[#141414]/70 leading-relaxed flex items-start gap-2">
                <Info size={14} className="shrink-0 mt-0.5 text-[#141414]/50" />
                <p>
                  <strong>Artwork Note:</strong> Design files are previewed in your browser and not permanently saved to the server. Placing an order reserves your custom tee; our studio reaches out directly to collect your full-res artwork before printing.
                </p>
              </div>
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
