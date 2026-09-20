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
        setErrorMessage(result.data.message || "Unable to fetch your orders.");
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
    <div className="min-h-screen bg-[#FAF8F5] text-[#121217] flex flex-col justify-between">
      <Nav />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex-1 w-full">
        {/* Header */}
        <div className="pb-6 mb-8 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FF462D] mb-1">
              <Package size={14} />
              <span>Account Hub</span>
            </div>
            <h1 className="font-heading font-black text-3xl sm:text-4xl uppercase tracking-tight text-neutral-950">
              MY ORDER ARCHIVE
            </h1>
          </div>

          <Link
            to="/collections"
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-neutral-950"
          >
            <span>Explore Drops</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-8 h-8 rounded-full border-2 border-[#FF462D] border-t-transparent animate-spin mx-auto mb-4" />
            <p className="font-heading text-xs uppercase tracking-widest text-neutral-500 font-bold">
              Fetching Your Orders...
            </p>
          </div>
        ) : errorMessage ? (
          <div className="p-6 rounded-3xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold text-center max-w-md mx-auto">
            <AlertCircle size={24} className="mx-auto mb-2" />
            <p>{errorMessage}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-neutral-200 p-8 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4 text-neutral-400">
              <ShoppingBag size={28} />
            </div>
            <h2 className="font-heading font-black text-2xl uppercase text-neutral-900 mb-2">
              No Orders Placed Yet
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mb-6">
              You haven't claimed any FurEver drops yet. Browse our genesis collection to start your streetwear rotation.
            </p>
            <button
              onClick={() => navigate("/collections")}
              className="px-8 py-4 rounded-full bg-[#0D0D11] hover:bg-[#FF462D] text-white font-heading text-xs font-bold uppercase tracking-widest transition-all shadow-lg cursor-pointer"
            >
              Explore Drops
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-3xl border border-neutral-200/80 shadow-sm p-6 sm:p-8 space-y-6"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-100 text-xs text-neutral-500">
                  <div className="space-y-1">
                    <p className="font-mono text-[11px] font-bold text-neutral-400">
                      ORDER ID: #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-neutral-700 font-semibold">
                      Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-neutral-100 text-neutral-800">
                      Status: {order.status}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        order.payment
                          ? "bg-[#00E599]/15 text-[#00A878]"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {order.paymentMethod === "COD" ? "Cash On Delivery" : order.payment ? "Paid Online" : "Payment Pending"}
                    </span>
                  </div>
                </div>

                {/* Items in this Order */}
                <div className="space-y-3">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 sm:gap-6">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-20 sm:w-20 sm:h-24 rounded-2xl object-cover bg-neutral-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-heading font-bold text-sm sm:text-base text-neutral-900 truncate">
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-neutral-500 mt-1">
                          <span className="font-bold text-neutral-700">Size: {item.size}</span>
                          <span>•</span>
                          <span>Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-heading font-bold text-sm sm:text-base text-neutral-950">
                          {currency}{item.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Details: Delivery address & Total */}
                <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div className="flex items-start gap-2 text-neutral-500 max-w-sm">
                    <MapPin size={15} className="text-[#FF462D] shrink-0 mt-0.5" />
                    <span>
                      {order.address?.street}, {order.address?.city}, {order.address?.state} - {order.address?.zipcode}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2 text-right">
                    <span className="text-neutral-500 font-medium">Order Total:</span>
                    <span className="font-heading font-black text-xl text-[#FF462D]">
                      {currency}{order.amount}
                    </span>
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