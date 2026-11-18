import React, { useContext, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import Title from "../components/Title";
import Card from "../components/Card";
import { shopDataContext } from "../context/ShopContext";

const TABS = ["All", "Furever Animals", "Furever Customs"];

export default function Product() {
  const navigate = useNavigate();
  const { products = [] } = useContext(shopDataContext) || {};
  const [activeTab, setActiveTab] = useState("All");

  const filteredProducts = useMemo(() => {
    if (activeTab === "All") return products;
    if (activeTab === "Furever Customs") {
      return products.filter((p) => p.category === "Furever Customs" || p.category === "Customs" || p.customizable);
    }
    return products.filter(
      (p) =>
        p.category === "Furever Animals" ||
        p.category === "Unisex" ||
        p.category === "Men" ||
        p.category === "Women" ||
        !p.customizable
    );
  }, [products, activeTab]);

  return (
    <section className="w-full bg-[#FAF6F2] py-16 sm:py-24 border-t border-[#EDE4DD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ================= SECTION 1: ORIGINALS & TAB FILTER ================= */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Title text1="FUREVER" text2="ORIGINALS" subtitle="OUR STORIES" />

          <p className="text-center text-[#58545F] max-w-2xl mx-auto mt-4 mb-8 text-sm sm:text-base font-medium leading-relaxed">
            Animal-inspired silhouettes cut from heavyweight combed cotton. Comfortable, relaxed drape with 10% net profit dedicated to animal welfare.
          </p>

          {/* Tab Filter [All, Furever Animals, Furever Customs] */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar mb-12">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full font-heading text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  activeTab === tab
                    ? "bg-[#58545F] text-white shadow-xs"
                    : "bg-white text-[#58545F] hover:bg-[#F5EFEB] border border-[#EDE4DD]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.slice(0, 6).map((item) => (
              <Card key={item._id || item.id} product={item} />
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <button
              onClick={() => navigate("/originals")}
              className="px-8 py-3.5 rounded-full bg-[#58545F] hover:bg-[#2B2730] text-white font-heading text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Originals</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
}