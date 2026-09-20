import React, { useContext, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  MapPin,
  Banknote,
  ChevronRight,
  ShoppingBag,
  ShieldCheck,
  LoaderCircle,
  ArrowLeft,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Lock,
  Heart,
} from "lucide-react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import razorpayLogo from "../assets/razorpay.png";
import { authDataContext } from "../context/Authcontext";
import { shopDataContext } from "../context/ShopContext";

export default function PlaceOrder() {
  const navigate = useNavigate();

  const { serverUrl } = useContext(authDataContext) || {};
  const {
    cartItems,
    setCartItems,
    getCartAmount,
    products = [],
    currency = "₹",
    deliveryFee = 50,
  } = useContext(shopDataContext) || {};

  const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "India",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage("");
  };

  const orderItems = useMemo(() => {
    const items = [];
    Object.entries(cartItems || {}).forEach(([productId, productSizes]) => {
      const product = products.find((item) => item._id === productId || item.id === productId);
      if (!product || !productSizes) return;

      Object.entries(productSizes).forEach(([size, quantity]) => {
        if (Number(quantity) <= 0) return;
        items.push({
          productId: product._id || product.id,
          name: product.name,
          price: Number(product.price),
          quantity: Number(quantity),
          size,
          image: product.images?.black || product.image1 || product.image?.[0],
        });
      });
    });
    return items;
  }, [cartItems, products]);

  const cartAmount = typeof getCartAmount === "function" ? Number(getCartAmount()) : 0;
  const freeShippingThreshold = 999;
  const isFreeDelivery = cartAmount >= freeShippingThreshold;
  const finalDeliveryFee = cartAmount > 0 && !isFreeDelivery ? Number(deliveryFee) : 0;
  const totalAmount = cartAmount + finalDeliveryFee;
  const ngoContribution = Math.round(totalAmount * 0.10);

  const getAddressData = () => ({
    firstName: formData.firstName.trim(),
    lastName: formData.lastName.trim(),
    email: formData.email.trim(),
    phone: formData.phone.trim(),
    street: formData.street.trim(),
    city: formData.city.trim(),
    state: formData.state.trim(),
    zipcode: formData.zipcode.trim(),
    country: formData.country.trim(),
  });

  const getOrderData = () => ({
    items: orderItems,
    amount: totalAmount,
    address: getAddressData(),
  });

  const handleOrderSuccess = (order, message) => {
    if (order) {
      sessionStorage.setItem("latestOrder", JSON.stringify(order));
    }
    setSuccessMessage(message || "Street order placed! Thanks for supporting our animal welfare mission 🐾");
    setCartItems({});
    setTimeout(() => {
      navigate("/orders", { replace: true });
    }, 1500);
  };

  const initPay = async (razorpayOrder) => {
    if (!window.Razorpay) {
      setErrorMessage("Razorpay SDK failed to load. Please refresh and try again.");
      setPlacingOrder(false);
      return;
    }

    if (!razorpayKeyId) {
      setErrorMessage("VITE_RAZORPAY_KEY_ID is missing from frontend environment.");
      setPlacingOrder(false);
      return;
    }

    const options = {
      key: razorpayKeyId,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency || "INR",
      name: "FUREVER STREETWEAR",
      description: "240 GSM Cotton Drop Checkout",
      order_id: razorpayOrder.id,
      prefill: {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        contact: formData.phone,
      },
      notes: {
        customer_name: `${formData.firstName} ${formData.lastName}`.trim(),
      },
      theme: {
        color: "#58545F",
      },
      handler: async (response) => {
        try {
          setPlacingOrder(true);
          const verificationResult = await axios.post(
            `${serverUrl}/api/order/verifypayment`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            },
            { withCredentials: true }
          );

          if (verificationResult.data?.success) {
            handleOrderSuccess(
              verificationResult.data?.order,
              verificationResult.data?.message || "Payment verified! Your street order is getting printed."
            );
            return;
          }

          setErrorMessage(
            verificationResult.data?.message || "Payment verification failed."
          );
        } catch (error) {
          console.log("Razorpay verification error:", error);
          setErrorMessage(
            error?.response?.data?.message || "Payment completed, but verification failed."
          );
        } finally {
          setPlacingOrder(false);
        }
      },
      modal: {
        ondismiss: () => {
          setPlacingOrder(false);
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", (response) => {
      console.log("Razorpay payment failed:", response);
      setErrorMessage(response?.error?.description || "Payment failed. Please try again.");
      setPlacingOrder(false);
    });

    rzp.open();
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!orderItems.length) {
      setErrorMessage("Your street bag is empty.");
      return;
    }

    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "street",
      "city",
      "state",
      "zipcode",
      "country",
    ];

    for (const field of requiredFields) {
      if (!formData[field] || !formData[field].trim()) {
        setErrorMessage("Please complete all shipping address fields.");
        return;
      }
    }

    try {
      setPlacingOrder(true);
      setErrorMessage("");
      setSuccessMessage("");

      const orderData = getOrderData();

      if (paymentMethod === "COD") {
        const response = await axios.post(
          `${serverUrl}/api/order/place`,
          orderData,
          { withCredentials: true }
        );

        if (response.data.success) {
          handleOrderSuccess(response.data.order, "Order placed successfully! Tail wags incoming 🐾");
          return;
        }

        setErrorMessage(response.data.message || "Failed to place order.");
        return;
      }

      if (paymentMethod === "RAZORPAY") {
        const response = await axios.post(
          `${serverUrl}/api/order/razorpay`,
          orderData,
          { withCredentials: true }
        );

        if (response.data?.success && response.data?.order) {
          await initPay(response.data.order);
          return;
        }

        setErrorMessage(
          response.data?.message || "Failed to initiate online payment."
        );
        return;
      }
    } catch (error) {
      console.log("Order placement error:", error);
      setErrorMessage(
        error.response?.data?.message || "Error processing order. Please try again."
      );
    } finally {
      if (paymentMethod !== "RAZORPAY") {
        setPlacingOrder(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F2] text-[#2B2730] flex flex-col justify-between">
      <Nav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex-1 w-full">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#EDE4DD]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#58545F] text-white text-[11px] font-black uppercase tracking-wider mb-2 shadow-xs">
              <Lock size={13} className="text-[#FDAC98]" />
              <span>Secure Street Checkout</span>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-[#2B2730]">
              Delivery & Payment
            </h1>
          </div>

          <Link
            to="/cart"
            className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#58545F] hover:text-[#2B2730] transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Return to Bag</span>
          </Link>
        </div>

        {orderItems.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-[#EDE4DD] p-8 max-w-xl mx-auto shadow-xs">
            <h2 className="font-display font-black text-2xl uppercase tracking-tight text-[#2B2730] mb-2">
              Your Street Bag is Empty
            </h2>
            <p className="text-xs sm:text-sm text-[#58545F] mb-6 font-medium">
              You must have at least one streetwear item in your bag to proceed with checkout.
            </p>
            <button
              onClick={() => navigate("/collections")}
              className="px-8 py-3.5 rounded-full bg-[#58545F] hover:bg-[#2B2730] text-white text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer"
            >
              Shop Street Drops 🐾
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmitHandler}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              
              {/* LEFT COLUMN: SHIPPING ADDRESS & PAYMENT (7 COLS) */}
              <div className="lg:col-span-7 space-y-8">
                
                {/* Step 1: Address Card */}
                <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EDE4DD] shadow-xs space-y-5">
                  <div className="flex items-center gap-3 pb-4 border-b border-[#F5EFEB]">
                    <div className="w-8 h-8 rounded-full bg-[#58545F] text-white flex items-center justify-center font-black text-xs">
                      1
                    </div>
                    <div>
                      <h3 className="font-display font-black text-sm uppercase tracking-wider text-[#2B2730]">
                        Shipping & Delivery Address
                      </h3>
                      <p className="text-xs text-[#7E7785] font-medium">Where should we deliver your 240 GSM drop?</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-black uppercase tracking-wider text-[#58545F] block mb-1">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={onChangeHandler}
                        placeholder="e.g. Rahul"
                        className="w-full px-4 py-3 rounded-2xl bg-[#FAF6F2] border border-[#EDE4DD] text-xs font-bold text-[#2B2730] placeholder-[#7E7785] focus:outline-none focus:border-[#58545F]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-black uppercase tracking-wider text-[#58545F] block mb-1">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={onChangeHandler}
                        placeholder="e.g. Sharma"
                        className="w-full px-4 py-3 rounded-2xl bg-[#FAF6F2] border border-[#EDE4DD] text-xs font-bold text-[#2B2730] placeholder-[#7E7785] focus:outline-none focus:border-[#58545F]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-black uppercase tracking-wider text-[#58545F] block mb-1">Email Address (Order Updates) *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={onChangeHandler}
                        placeholder="rahul@example.com"
                        className="w-full px-4 py-3 rounded-2xl bg-[#FAF6F2] border border-[#EDE4DD] text-xs font-bold text-[#2B2730] placeholder-[#7E7785] focus:outline-none focus:border-[#58545F]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-black uppercase tracking-wider text-[#58545F] block mb-1">Phone Number (WhatsApp Art Proof) *</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={onChangeHandler}
                        placeholder="9876543210"
                        className="w-full px-4 py-3 rounded-2xl bg-[#FAF6F2] border border-[#EDE4DD] text-xs font-bold text-[#2B2730] placeholder-[#7E7785] focus:outline-none focus:border-[#58545F]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-black uppercase tracking-wider text-[#58545F] block mb-1">Street Address, Landmark & House No. *</label>
                    <input
                      type="text"
                      name="street"
                      required
                      value={formData.street}
                      onChange={onChangeHandler}
                      placeholder="Flat 402, Green Valley Apartments"
                      className="w-full px-4 py-3 rounded-2xl bg-[#FAF6F2] border border-[#EDE4DD] text-xs font-bold text-[#2B2730] placeholder-[#7E7785] focus:outline-none focus:border-[#58545F]"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-black uppercase tracking-wider text-[#58545F] block mb-1">City *</label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={onChangeHandler}
                        placeholder="Bengaluru"
                        className="w-full px-4 py-3 rounded-2xl bg-[#FAF6F2] border border-[#EDE4DD] text-xs font-bold text-[#2B2730] placeholder-[#7E7785] focus:outline-none focus:border-[#58545F]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-black uppercase tracking-wider text-[#58545F] block mb-1">State *</label>
                      <input
                        type="text"
                        name="state"
                        required
                        value={formData.state}
                        onChange={onChangeHandler}
                        placeholder="Karnataka"
                        className="w-full px-4 py-3 rounded-2xl bg-[#FAF6F2] border border-[#EDE4DD] text-xs font-bold text-[#2B2730] placeholder-[#7E7785] focus:outline-none focus:border-[#58545F]"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-xs font-black uppercase tracking-wider text-[#58545F] block mb-1">Pincode *</label>
                      <input
                        type="text"
                        name="zipcode"
                        required
                        value={formData.zipcode}
                        onChange={onChangeHandler}
                        placeholder="560001"
                        className="w-full px-4 py-3 rounded-2xl bg-[#FAF6F2] border border-[#EDE4DD] text-xs font-bold text-[#2B2730] placeholder-[#7E7785] focus:outline-none focus:border-[#58545F]"
                      />
                    </div>
                  </div>
                </div>

                {/* Step 2: Payment Method */}
                <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EDE4DD] shadow-xs space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b border-[#F5EFEB]">
                    <div className="w-8 h-8 rounded-full bg-[#58545F] text-white flex items-center justify-center font-black text-xs">
                      2
                    </div>
                    <div>
                      <h3 className="font-display font-black text-sm uppercase tracking-wider text-[#2B2730]">
                        Payment Option
                      </h3>
                      <p className="text-xs text-[#7E7785] font-medium">Select your preferred payment gateway</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* COD Option */}
                    <label
                      onClick={() => setPaymentMethod("COD")}
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                        paymentMethod === "COD"
                          ? "border-[#58545F] bg-[#FAF6F2] shadow-xs"
                          : "border-[#EDE4DD] bg-white hover:bg-[#FAF6F2]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            paymentMethod === "COD"
                              ? "border-[#58545F] bg-[#58545F]"
                              : "border-[#A97882]"
                          }`}
                        >
                          {paymentMethod === "COD" && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                        <div>
                          <p className="font-display font-black text-xs uppercase tracking-wider text-[#2B2730]">
                            Cash on Delivery (COD) 🐾
                          </p>
                          <p className="text-xs text-[#58545F] font-medium">Pay securely at your doorstep</p>
                        </div>
                      </div>
                      <Banknote size={20} className="text-[#DC8E90]" />
                    </label>

                    {/* Razorpay Online Option */}
                    <label
                      onClick={() => setPaymentMethod("RAZORPAY")}
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                        paymentMethod === "RAZORPAY"
                          ? "border-[#58545F] bg-[#FAF6F2] shadow-xs"
                          : "border-[#EDE4DD] bg-white hover:bg-[#FAF6F2]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            paymentMethod === "RAZORPAY"
                              ? "border-[#58545F] bg-[#58545F]"
                              : "border-[#A97882]"
                          }`}
                        >
                          {paymentMethod === "RAZORPAY" && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                        <div>
                          <p className="font-display font-black text-xs uppercase tracking-wider text-[#2B2730]">
                            Online Payment (Cards, UPI, NetBanking)
                          </p>
                          <p className="text-xs text-[#58545F] font-medium">
                            Instant confirmation via Razorpay secure checkout
                          </p>
                        </div>
                      </div>
                      {razorpayLogo ? (
                        <img src={razorpayLogo} alt="Razorpay" className="h-5 object-contain" />
                      ) : (
                        <CreditCard size={20} className="text-[#DC8E90]" />
                      )}
                    </label>
                  </div>
                </div>

                {/* Error Message */}
                {errorMessage && (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                    <AlertCircle size={16} />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Success Message */}
                {successMessage && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>{successMessage}</span>
                  </div>
                )}

              </div>

              {/* RIGHT COLUMN: ORDER SUMMARY & SUBMIT (5 COLS) */}
              <div className="lg:col-span-5">
                <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EDE4DD] shadow-xs sticky top-28 space-y-6">
                  <h3 className="font-display font-black text-base uppercase tracking-wider text-[#2B2730]">
                    Street Bag Summary ({orderItems.length})
                  </h3>

                  {/* 10% Social Impact Ribbon */}
                  <div className="p-3.5 rounded-2xl bg-[#DC8E90]/15 border border-[#DC8E90]/30 flex items-center gap-2.5">
                    <Heart size={16} className="text-[#DC8E90] shrink-0 fill-[#DC8E90]" />
                    <span className="text-[11px] font-bold text-[#2B2730] leading-tight">
                      🐾 10% Social Grant: <strong>₹{ngoContribution}</strong> will be donated directly to partner shelters for stray rescue and vaccination!
                    </span>
                  </div>

                  {/* Item List Preview */}
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                    {orderItems.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 py-2 border-b border-[#F5EFEB]">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-14 rounded-xl object-contain p-1 bg-[#FAF6F2] border border-[#EDE4DD]"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-black uppercase tracking-tight text-[#2B2730] truncate">{item.name}</p>
                          <p className="text-[10px] text-[#7E7785] font-semibold">
                            Size: {item.size} • Qty: {item.quantity} • 240 GSM
                          </p>
                        </div>
                        <span className="font-display font-black text-xs text-[#2B2730]">
                          {currency}{item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Calculations */}
                  <div className="space-y-2.5 text-xs text-[#58545F] border-b border-[#EDE4DD] pb-4 font-medium">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-black text-[#2B2730]">{currency}{cartAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Express Shipping</span>
                      <span>
                        {isFreeDelivery ? (
                          <span className="text-emerald-700 font-black">FREE</span>
                        ) : (
                          `${currency}${finalDeliveryFee}`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>10% Shelter NGO Grant</span>
                      <span className="text-[#DC8E90] font-black">Included ❤️</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-baseline">
                    <span className="font-display font-black text-sm uppercase tracking-wider text-[#2B2730]">Total Amount</span>
                    <span className="font-display font-black text-2xl text-[#2B2730]">
                      {currency}{totalAmount}
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={placingOrder}
                    className="w-full py-4 rounded-full bg-[#58545F] hover:bg-[#2B2730] text-white font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {placingOrder ? (
                      <>
                        <LoaderCircle size={18} className="animate-spin text-[#FDAC98]" />
                        <span>Confirming Street Order...</span>
                      </>
                    ) : (
                      <>
                        <span>Confirm & Place Order 🐾</span>
                        <ChevronRight size={16} />
                      </>
                    )}
                  </button>

                  <div className="p-3.5 rounded-2xl bg-[#FAF6F2] border border-[#EDE4DD] text-[10px] text-[#58545F] flex items-center gap-2 font-medium">
                    <ShieldCheck size={16} className="text-[#DC8E90] shrink-0" />
                    <span>240 GSM Heavyweight Terry • 7-Day Size Swaps • 10% NGO Impact</span>
                  </div>
                </div>
              </div>

            </div>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}