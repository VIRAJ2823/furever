import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  Package,
  ShoppingBag,
  MapPin,
  CreditCard,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  AlertCircle,
  Truck,
  RotateCcw,
} from "lucide-react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { authDataContext } from "../context/Authcontext";
import { shopDataContext } from "../context/ShopContext";

export default function Order() {
  const navigate = useNavigate();
  const { serverUrl } = useContext(authDataContext);
  const { currency = "₹" } = useContext(shopDataContext) || {};

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const getUserOrders = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      const result = await axios.get(`${serverUrl}/api/order/myorders`, {
        withCredentials: true,
      });

      if (result.data.success) {
        setOrders(result.data.orders || []);
      } else {
        setErrorMessage(result.data.message || "Unable to fetch your pet orders.");
      }
    } catch (error) {
      console.log("Get Orders Error:", error);
      setErrorMessage(error?.response?.data?.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserOrders();
  }, [serverUrl]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#231F1D] flex flex-col justify-between">
      <Nav />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex-1 w-full">
        {/* Header */}
        <div className="pb-6 mb-8 border-b border-[#EAE4DC] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF2EE] text-[#3D6857] text-xs font-bold uppercase tracking-wider mb-2">
              <Package size={13} />
              <span>Pet Parent Hub</span>
            </div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#231F1D] tracking-tight">
              My Pet Orders 🐾
            </h1>
          </div>

          <Link
            to="/collections"
            className="flex items-center gap-2 text-xs font-bold text-[#6E675F] hover:text-[#3D6857] transition-colors"
          >
            <span>Explore Pet Collections</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="py-24 text-center">
            <div className="w-8 h-8 rounded-full border-2 border-[#3D6857] border-t-transparent animate-spin mx-auto mb-4" />
            <p className="font-display text-xs uppercase tracking-wider text-[#6E675F] font-bold">
              Fetching Your Pet Deliveries...
            </p>
          </div>
        ) : errorMessage ? (
          <div className="p-6 rounded-3xl bg-white border border-rose-200 text-center max-w-md mx-auto">
            <AlertCircle size={28} className="text-rose-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-[#231F1D] mb-4">{errorMessage}</p>
            <button
              onClick={getUserOrders}
              className="pill-button px-6 py-2.5 rounded-full bg-[#3D6857] text-white text-xs font-bold"
            >
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-[#EAE4DC] p-8 max-w-xl mx-auto">
            <div className="w-20 h-20 rounded-full bg-[#EAF2EE] text-[#3D6857] flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🐾</span>
            </div>
            <h2 className="font-display font-bold text-2xl text-[#231F1D] mb-2">
              No Orders Found Yet
            </h2>
            <p className="text-xs sm:text-sm text-[#6E675F] mb-6">
              You haven't placed an order yet. Treat your pet to our cushioned harnesses or cozy knits!
            </p>
            <button
              onClick={() => navigate("/collections")}
              className="pill-button px-8 py-3.5 rounded-full bg-[#3D6857] hover:bg-[#2D5042] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              Shop Pet Collections 🐾
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-3xl border border-[#EAE4DC] p-6 sm:p-8 shadow-2xs space-y-6"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#F4EFEA]">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6E675F]">
                      Order ID
                    </span>
                    <p className="font-mono text-xs font-bold text-[#231F1D]">#{order._id}</p>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-[#6E675F]">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-[#3D6857]" />
                      <span>{new Date(order.date || Date.now()).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <CreditCard size={14} className="text-[#3D6857]" />
                      <span className="font-semibold uppercase">{order.paymentMethod || "COD"}</span>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EAF2EE] text-[#3D6857]">
                    <span className="w-2 h-2 rounded-full bg-[#3D6857]" />
                    <span>{order.status || "Packing with Love 🐾"}</span>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-4">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <img
                        src={item.image || item.image1}
                        alt={item.name}
                        className="w-16 h-16 rounded-2xl object-cover bg-[#F4EFEA] border border-[#EAE4DC]"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-display font-bold text-sm text-[#231F1D] truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs text-[#6E675F]">
                          Size: {item.size} • Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="font-display font-bold text-sm text-[#231F1D]">
                        {currency}{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer of Order Card */}
                <div className="pt-4 border-t border-[#F4EFEA] flex flex-wrap items-center justify-between gap-4 text-xs text-[#6E675F]">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-[#3D6857]" />
                    <span>
                      {order.address?.street}, {order.address?.city}, {order.address?.zipcode}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-display font-black text-base text-[#231F1D]">
                    <span>Total Paid:</span>
                    <span className="text-[#3D6857]">{currency}{order.amount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}