import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Heart,
} from "lucide-react";
import { shopDataContext } from "../context/ShopContext";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

export default function Cart() {
  const navigate = useNavigate();

  const {
    cartItems,
    products = [],
    currency = "₹",
    deliveryFee = 50,
    cartLoading,
    updateQuantity,
    removeFromCart,
    getCartCount,
    getCartAmount,
  } = useContext(shopDataContext) || {};

  const cartEntries = Object.entries(cartItems || {}).flatMap(([productId, sizes]) => {
    const product = products.find((item) => item._id === productId || item.id === productId);
    if (!product || !sizes) return [];

    return Object.entries(sizes).map(([size, quantity]) => {
      if (Number(quantity) <= 0) return null;
      return {
        productId,
        size,
        quantity: Number(quantity),
        product,
      };
    }).filter(Boolean);
  });

  const subtotal = typeof getCartAmount === "function" ? getCartAmount() : 0;
  const cartCount = typeof getCartCount === "function" ? getCartCount() : 0;
  const finalDeliveryFee = subtotal > 0 ? deliveryFee : 0;
  const total = subtotal + finalDeliveryFee;
  const ngoContribution = Math.round(subtotal * 0.10);

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-[#FAF6F2] flex flex-col justify-between">
        <Nav />
        <div className="py-24 text-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#58545F] border-t-transparent animate-spin mx-auto mb-4" />
          <p className="font-heading text-xs uppercase tracking-wider text-[#7E7785] font-bold">
            Loading Your Bag...
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6F2] text-[#2B2730] flex flex-col justify-between">
      <Nav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex-1 w-full">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#EDE4DD]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#58545F] text-white text-[11px] font-black uppercase tracking-wider mb-2 shadow-xs">
              <ShoppingBag size={13} className="text-[#FDAC98]" />
              <span>FurEver Shopping Bag</span>
            </div>
            <h1 className="font-heading font-black text-3xl sm:text-4xl uppercase tracking-tight text-[#2B2730]">
              Your Bag <span className="text-[#7E7785] font-normal">({cartCount} {cartCount === 1 ? "piece" : "pieces"})</span>
            </h1>
          </div>

          <Link
            to="/originals"
            className="hidden sm:flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#58545F] hover:text-[#2B2730] transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Continue Exploring 🐾</span>
          </Link>
        </div>

        {cartEntries.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-[#EDE4DD] p-8 max-w-xl mx-auto shadow-xs">
            <div className="w-20 h-20 rounded-full bg-[#FAF6F2] text-[#DC8E90] flex items-center justify-center mx-auto mb-4 text-3xl">
              🐾
            </div>
            <h2 className="font-heading font-black text-2xl uppercase tracking-tight text-[#2B2730] mb-2">
              Your Bag is Empty
            </h2>
            <p className="text-xs sm:text-sm text-[#58545F] mb-6 font-medium">
              Explore our original animal graphic silhouettes or create a personalized custom memory tee for your companion.
            </p>
            <button
              onClick={() => navigate("/originals")}
              className="px-8 py-3.5 rounded-full bg-[#58545F] hover:bg-[#2B2730] text-white text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer"
            >
              Explore Originals 🐾
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* LEFT: CART ITEMS LIST (8 COLS) */}
            <div className="lg:col-span-8 space-y-4">
              {cartEntries.map(({ productId, size, quantity, product }) => (
                <div
                  key={`${productId}-${size}`}
                  className="flex gap-4 p-5 rounded-3xl bg-white border border-[#EDE4DD] shadow-xs hover:border-[#DC8E90]/50 transition-all"
                >
                  <img
                    src={product.images?.black || product.image1 || product.image?.[0]}
                    alt={product.name}
                    className="w-24 h-28 sm:w-28 sm:h-32 rounded-2xl object-contain p-2 bg-[#FAF6F2] shrink-0 border border-[#EDE4DD]"
                  />

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/product/${productId}`}
                          className="font-heading font-black text-sm sm:text-base uppercase tracking-tight text-[#2B2730] hover:text-[#DC8E90] transition-colors truncate"
                        >
                          {product.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(productId, size)}
                          className="text-[#7E7785] hover:text-rose-600 transition-colors p-1 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-md bg-[#58545F] text-[10px] font-black uppercase tracking-wider text-white">
                          SIZE: {size}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md bg-[#DC8E90]/15 text-[10px] font-black uppercase tracking-wider text-[#A97882]">
                          {product.category || "Furever Animals"}
                        </span>
                        <span className="text-xs font-bold text-[#58545F]">
                          {currency}{product.price} each
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity Modifier */}
                      <div className="inline-flex items-center border border-[#EDE4DD] rounded-full bg-[#FAF6F2]">
                        <button
                          onClick={() => updateQuantity(productId, size, quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-[#58545F] hover:text-[#2B2730] hover:bg-[#EDE4DD] rounded-full transition-colors cursor-pointer"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-xs font-black text-[#2B2730]">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(productId, size, quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-[#58545F] hover:text-[#2B2730] hover:bg-[#EDE4DD] rounded-full transition-colors cursor-pointer"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Total for item */}
                      <span className="font-heading font-black text-base sm:text-lg text-[#2B2730]">
                        {currency}{product.price * quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT: ORDER SUMMARY (4 COLS) */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-3xl border border-[#EDE4DD] p-6 sm:p-8 shadow-xs sticky top-28 space-y-6">
                
                {/* 10% Animal Welfare Callout */}
                <div className="p-4 rounded-2xl bg-[#FAF6F2] border border-[#EDE4DD] flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#DC8E90] text-white flex items-center justify-center shrink-0">
                    <Heart size={18} fill="currentColor" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#A97882] block">
                      10% TO ANIMAL WELFARE
                    </span>
                    <span className="text-xs text-[#2B2730] font-semibold">
                      Your order dedicates <strong>{currency}{ngoContribution}</strong> to stray animal care.
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-heading font-black text-lg uppercase tracking-tight text-[#2B2730] mb-4">
                    Order Summary
                  </h3>

                  <div className="space-y-3 text-xs border-b border-[#EDE4DD] pb-4">
                    <div className="flex justify-between text-[#58545F] font-medium">
                      <span>Subtotal ({cartCount} {cartCount === 1 ? "piece" : "pieces"})</span>
                      <span className="font-bold text-[#2B2730]">{currency}{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-[#58545F] font-medium">
                      <span>Standard Shipping</span>
                      <span className="font-bold text-[#2B2730]">{currency}{finalDeliveryFee}</span>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between items-baseline mb-6">
                    <span className="font-heading font-black text-base uppercase tracking-wider text-[#2B2730]">
                      Total
                    </span>
                    <span className="font-heading font-black text-2xl sm:text-3xl text-[#2B2730]">
                      {currency}{total}
                    </span>
                  </div>

                  <button
                    onClick={() => navigate("/placeorder")}
                    className="w-full py-4 rounded-full bg-[#58545F] hover:bg-[#2B2730] text-white font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight size={16} />
                  </button>

                  <div className="mt-4 pt-4 border-t border-[#EDE4DD] flex items-center justify-center gap-2 text-[10px] text-[#7E7785] font-semibold text-center">
                    <ShieldCheck size={14} className="text-[#DC8E90]" />
                    <span>Heavyweight Combed Cotton • 7-Day Size Exchanges</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}