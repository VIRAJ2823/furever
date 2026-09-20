import React from "react";
import Nav from "../components/Nav";
import Hero from "../components/Hero";
import Product from "./Product";
import BrandStory from "../components/BrandStory";
import OurPolicy from "../components/OurPolicy";
import Feedback from "../components/Feedback";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#121217] flex flex-col">
      <Nav />
      <Hero />
      <Product />
      <BrandStory />
      <OurPolicy />
      <Feedback />
      <Footer />
    </div>
  );
}