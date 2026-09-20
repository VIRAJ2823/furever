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
} from "lucide-react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import razorpayLogo from "../assets/razorpay.png";
import { authDataContext } from "../context/Authcontext";
import { shopDataContext } from "../context/ShopContext";

export default function PlaceOrder() {
  const navigate = useNavigate();

  const { serverUrl } = useContext(authDataContext);
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
      const product = products.find((item) => item._id === productId);
      if (!product || !productSizes) return;

      Object.entries(productSizes).forEach(([size, quantity]) => {
        if (Number(quantity) <= 0) return;
        items.push({
          productId: product._id,
          name: product.name,
          price: Number(product.price),
          quantity: Number(quantity),
          size,
          image: product.image1,
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
    setSuccessMessage(message || "Order placed successfully!");
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
      name: "FurEver Studio",
      description: "Streetwear Order Checkout",
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
        color: "#0D0D11",
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
              verificationResult.data?.message || "Payment verified! Order placed."
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

    if (orderItems.length === 0) {
      setErrorMessage("Your bag is empty. Please select drops before placing an order.");
      return;
    }

    // Form validation
    if (
      !formData.firstName.trim() ||
      !formData.phone.trim() ||
      !formData.street.trim() ||
      !formData.city.trim() ||
      !formData.zipcode.trim()
    ) {
      setErrorMessage("Please fill in all required shipping address fields.");
      return;
    }

    try {
      setPlacingOrder(true);
      setErrorMessage("");
      setSuccessMessage("");

      const orderData = getOrderData();

      // RAZORPAY FLOW
      if (paymentMethod === "Razorpay") {
        if (!window.Razorpay) {
          setErrorMessage("Razorpay checkout is unavailable. Please refresh.");
          setPlacingOrder(false);
          return;
        }

        const result = await axios.post(
          `${serverUrl}/api/order/placeorderrazorpay`,
          orderData,
          { withCredentials: true }
        );

        if (!result.data?.success) {
          setErrorMessage(result.data?.message || "Unable to initialize Razorpay checkout.");
          setPlacingOrder(false);
          return;
        }

        const razorpayOrder =
          result.data?.razorpayOrder || result.data?.paymentOrder || result.data?.order;

        if (!razorpayOrder?.id) {
          setErrorMessage("Invalid payment order received from server.");
          setPlacingOrder(false);
          return;
        }

        await initPay(razorpayOrder);
        return;
      }

      // CASH ON DELIVERY FLOW
      const result = await axios.post(
        `${serverUrl}/api/order/placeorder`,
        orderData,
        { withCredentials: true }
      );

      if (result.data?.success) {
        handleOrderSuccess(result.data?.order, result.data?.message || "Order placed successfully!");
        return;
      }

      setErrorMessage(result.data?.message || "Unable to place order. Please try again.");
    } catch (error) {
      console.log("Place Order Error:", error);
      setErrorMessage(error?.response?.data?.message || "Order placement failed.");
    } finally {
      if (paymentMethod !== "Razorpay") {
        setPlacingOrder(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#121217] flex flex-col justify-between">
      <Nav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex-1 w-full">
        {/* Header */}
        <div className="pb-6 mb-8 border-b border-neutral-200 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FF462D] mb-1">
              <Lock size={14} />
              <span>Encrypted Checkout</span>
            </div>
            <h1 className="font-heading font-black text-3xl sm:text-4xl uppercase tracking-tight text-neutral-950">
              SHIPPING & PAYMENT
            </h1>
          </div>

          <Link
            to="/cart"
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-neutral-950"
          >
            <ArrowLeft size={14} />
            <span>Back to Bag</span>
          </Link>
        </div>

        {/* Form Container */}
        <form onSubmit={onSubmitHandler}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* LEFT: SHIPPING ADDRESS FORM */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Shipping Details Box */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-sm space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-neutral-100">
                  <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900">
                    <MapPin size={16} />
                  </div>
                  <h2 className="font-heading font-bold text-base uppercase text-neutral-950">
                    Delivery Address
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-600 uppercase mb-1.5">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      name="firstName"
                      value={formData.firstName}
                      onChange={onChangeHandler}
                      placeholder="e.g. Rahul"
                      className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-sm outline-none focus:border-neutral-900 focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-600 uppercase mb-1.5">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={onChangeHandler}
                      placeholder="e.g. Sharma"
                      className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-sm outline-none focus:border-neutral-900 focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-600 uppercase mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      name="email"
                      value={formData.email}
                      onChange={onChangeHandler}
                      placeholder="for order tracking"
                      className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-sm outline-none focus:border-neutral-900 focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-600 uppercase mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      name="phone"
                      value={formData.phone}
                      onChange={onChangeHandler}
                      placeholder="10-digit mobile"
                      className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-sm outline-none focus:border-neutral-900 focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 uppercase mb-1.5">
                    Street Address & Flat / Building *
                  </label>
                  <input
                    type="text"
                    required
                    name="street"
                    value={formData.street}
                    onChange={onChangeHandler}
                    placeholder="House no., street, locality"
                    className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-sm outline-none focus:border-neutral-900 focus:bg-white transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-600 uppercase mb-1.5">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      name="city"
                      value={formData.city}
                      onChange={onChangeHandler}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-sm outline-none focus:border-neutral-900 focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-600 uppercase mb-1.5">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      name="state"
                      value={formData.state}
                      onChange={onChangeHandler}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-sm outline-none focus:border-neutral-900 focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-600 uppercase mb-1.5">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      required
                      name="zipcode"
                      value={formData.zipcode}
                      onChange={onChangeHandler}
                      placeholder="6 digits"
                      className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-sm outline-none focus:border-neutral-900 focus:bg-white transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* PAYMENT METHOD SELECTOR */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-sm space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b border-neutral-100">
                  <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900">
                    <CreditCard size={16} />
                  </div>
                  <h2 className="font-heading font-bold text-base uppercase text-neutral-950">
                    Payment Method
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Razorpay Card */}
                  <div
                    onClick={() => setPaymentMethod("Razorpay")}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === "Razorpay"
                        ? "border-[#0D0D11] bg-neutral-50 shadow-sm"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === "Razorpay"}
                          onChange={() => setPaymentMethod("Razorpay")}
                          className="accent-[#0D0D11]"
                        />
                        <span className="font-heading font-bold text-sm text-neutral-900">
                          Online Payment
                        </span>
                      </div>
                      <img src={razorpayLogo} alt="Razorpay" className="h-4 object-contain" />
                    </div>
                    <p className="text-xs text-neutral-500">
                      UPI (GPay, PhonePe, Paytm), Credit / Debit Cards, NetBanking.
                    </p>
                  </div>

                  {/* Cash on Delivery */}
                  <div
                    onClick={() => setPaymentMethod("COD")}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === "COD"
                        ? "border-[#0D0D11] bg-neutral-50 shadow-sm"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === "COD"}
                          onChange={() => setPaymentMethod("COD")}
                          className="accent-[#0D0D11]"
                        />
                        <span className="font-heading font-bold text-sm text-neutral-900">
                          Cash on Delivery
                        </span>
                      </div>
                      <Banknote size={18} className="text-neutral-700" />
                    </div>
                    <p className="text-xs text-neutral-500">
                      Pay in cash or UPI to courier upon doorstep arrival.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT: ORDER SUMMARY & CTAS */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-md sticky top-28 space-y-6">
              <h2 className="font-heading font-black text-lg uppercase tracking-tight text-neutral-950 pb-4 border-b border-neutral-100">
                Order Review ({orderItems.length} {orderItems.length === 1 ? "Drop" : "Drops"})
              </h2>

              {/* Items List Thumbnail Strip */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {orderItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 py-2 border-b border-neutral-100 last:border-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-16 rounded-xl object-cover bg-neutral-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-heading font-bold text-xs text-neutral-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-neutral-500">
                        Size: {item.size} • Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-heading font-bold text-xs text-neutral-950 shrink-0">
                      {currency}{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Calculation */}
              <div className="space-y-2.5 text-xs sm:text-sm pt-2 border-t border-neutral-100">
                <div className="flex justify-between text-neutral-500">
                  <span>Subtotal</span>
                  <span className="font-bold text-neutral-900">{currency}{cartAmount}</span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>Shipping</span>
                  <span>
                    {isFreeDelivery ? (
                      <strong className="text-[#00A878] uppercase">FREE</strong>
                    ) : (
                      `${currency}${finalDeliveryFee}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>Animal Welfare Contribution</span>
                  <strong className="text-[#FF462D]">10% Included</strong>
                </div>
                <div className="pt-3 border-t border-neutral-200 flex justify-between items-baseline">
                  <span className="font-heading font-bold text-base text-neutral-900">Total Payable</span>
                  <span className="font-heading font-black text-2xl text-[#FF462D]">
                    {currency}{totalAmount}
                  </span>
                </div>
              </div>

              {/* Alerts */}
              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-3.5 rounded-2xl bg-[#00A878]/10 border border-[#00A878]/20 text-[#00A878] text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 size={16} className="shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={placingOrder}
                className="w-full py-4 rounded-full bg-[#0D0D11] hover:bg-[#FF462D] active:scale-[0.99] text-white font-heading text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {placingOrder ? (
                  <>
                    <LoaderCircle size={16} className="animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <span>{paymentMethod === "Razorpay" ? "Pay & Confirm Order" : "Confirm COD Order"}</span>
                    <ChevronRight size={16} />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-400">
                <ShieldCheck size={14} className="text-[#00A878]" />
                <span>100% Secure Checkout • Safe Doorstep Delivery</span>
              </div>

            </div>

          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}