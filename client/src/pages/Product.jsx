import React, { useContext, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import Title from "../components/Title";
import Card from "../components/Card";
import { shopDataContext } from "../context/ShopContext";

const TABS = ["All", "Unisex", "Men", "Women", "Customs"];

export default function Product() {
  const navigate = useNavigate();
  const { products = [] } = useContext(shopDataContext) || {};
  const [activeTab, setActiveTab] = useState("All");

  const filteredProducts = useMemo(() => {
    if (activeTab === "All") return products;
    if (activeTab === "Customs") {
      return products.filter((p) => p.category === "Customs" || p.customizable);
    }
    return products.filter(
      (p) =>
        p.category?.toLowerCase() === activeTab.toLowerCase() ||
        p.subCategory?.toLowerCase() === activeTab.toLowerCase()
    );
  }, [products, activeTab]);

  return (
    <section className="w-full bg-[#FAF6F2] py-16 sm:py-24 border-t border-[#EDE4DD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ================= SECTION 1: STREETWEAR DROPS & TAB FILTER ================= */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Title text1="DROP 001" text2="ORIGINALS" subtitle="240 GSM HEAVYWEIGHT" />

          <p className="text-center text-[#58545F] max-w-2xl mx-auto mt-4 mb-8 text-sm sm:text-base font-medium leading-relaxed">
            Animal-inspired graphic streetwear cut from 240 GSM French Terry combed cotton. Pure boxy streetwear fits with 10% net profit funding animal welfare.
          </p>

          {/* D2C Tab Filter [All, Unisex, Men, Women, Customs] */}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.slice(0, 4).map((item) => (
              <Card key={item._id || item.id} product={item} />
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <button
              onClick={() => navigate("/collections")}
              className="pill-button px-8 py-3.5 rounded-full bg-[#58545F] hover:bg-[#2B2730] text-white font-heading text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>Explore All Drops</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </motion.div>

        <div className="py-12 sm:py-16" />

        {/* ================= SECTION 2: WEAR YOUR PET CUSTOMS ================= */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="rounded-3xl bg-white border border-[#EDE4DD] p-8 sm:p-12 shadow-xs"
        >
          <div className="max-w-2xl mx-auto text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF6F2] text-[#58545F] text-[10px] font-extrabold uppercase tracking-widest mb-3 border border-[#EDE4DD]">
              <Sparkles size={12} className="text-[#DC8E90]" />
              <span>MEMORY SERIES CUSTOMS</span>
            </div>
            <h3 className="font-heading font-black text-2xl sm:text-4xl uppercase tracking-tight text-[#2B2730]">
              WEAR YOUR PET. <span className="text-[#DC8E90]">FOREVER.</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#58545F] mt-2 font-medium">
              Upload a photo of your pet. Our in-house artists hand-draw minimalist line-art or monochrome stencil portraits printed on heavy 240 GSM tees.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {products
              .filter((p) => p.category === "Customs" || p.customizable)
              .slice(0, 2)
              .map((customProduct) => (
                <Card key={customProduct._id || customProduct.id} product={customProduct} />
              ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}