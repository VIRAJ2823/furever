import React, { useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Flame } from "lucide-react";
import { shopDataContext } from "../context/ShopContext";
import Card from "./Card";

export default function BestSeller() {
  const navigate = useNavigate();
  const { products = [], loading } = useContext(shopDataContext) || {};

  if (loading) {
    return (
      <div className="py-16 text-center text-[#6E6E73] font-medium text-xs font-heading uppercase">
        Loading Bestsellers...
      </div>
    );
  }

  // Filter bestsellers or top drops
  let bestSellerProducts = products.filter((p) => p.bestseller || p.badge === "Bestseller");
  if (bestSellerProducts.length === 0) {
    bestSellerProducts = products.slice(0, 4);
  } else if (bestSellerProducts.length < 4) {
    products.forEach((p) => {
      if (bestSellerProducts.length < 4 && !bestSellerProducts.some((b) => b.id === p.id || b._id === p._id)) {
        bestSellerProducts.push(p);
      }
    });
  }

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {bestSellerProducts.slice(0, 4).map((product) => (
          <Card key={product._id || product.id} product={product} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex justify-center mt-12 sm:mt-16"
      >
        <button
          onClick={() =>
            navigate("/collections", {
              state: { filter: "bestseller" },
            })
          }
          className="pill-button px-8 py-4 rounded-full bg-[#58545F] hover:bg-[#2B2730] active:scale-[0.98] text-white font-heading text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Shop High-Rotation Pieces</span>
          <ArrowRight size={15} />
        </button>
      </motion.div>
    </section>
  );
}