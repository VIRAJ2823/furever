import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import Product from "./models/productModel.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const PRODUCTS = [
  // --- FUREVER ORIGINALS: GRAPHIC TEES ---
  {
    id: "fur-001",
    name: "Just Vibin' Brontosaurus Oversized Tee",
    category: "Unisex",
    drop: "Drop 001",
    price: 499,
    originalPrice: 899,
    badge: "Bestseller",
    description: "240 GSM Heavyweight French Terry cotton. Relaxed streetwear drape featuring our chill dino graphic.",
    colors: [
      { name: "Vintage Black", hex: "#111111", inStock: true },
      { name: "Cloud White", hex: "#F5F5F3", inStock: true }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: {
      black: "/images/products/vibin-black.png",
      white: "/images/products/vibin-white.png"
    },
    specs: {
      gsm: 240,
      fit: "Heavyweight Oversized Fit",
      fabric: "100% Combed Cotton",
      care: "Cold machine wash inside out, do not iron on print"
    }
  },
  {
    id: "fur-002",
    name: "I Go Jim Dino Oversized Tee",
    category: "Men",
    drop: "Drop 001",
    price: 499,
    originalPrice: 899,
    badge: "Trending",
    description: "240 GSM Heavyweight French Terry. The gym-bro mini dino tee built for pump covers and street fits.",
    colors: [
      { name: "Vintage Black", hex: "#111111", inStock: true },
      { name: "Cloud White", hex: "#F5F5F3", inStock: true }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: {
      black: "/images/products/igojim-black.png",
      white: "/images/products/igojim-white.png"
    },
    specs: {
      gsm: 240,
      fit: "Heavyweight Oversized Fit",
      fabric: "100% Combed Cotton"
    }
  },
  {
    id: "fur-003",
    name: "Do Not Disturb Lazy Panda Tee",
    category: "Unisex",
    drop: "Drop 001",
    price: 499,
    originalPrice: 899,
    badge: "Essential",
    description: "240 GSM breathable cotton with our sleeping panda graphic print. Slouchy dropped shoulders.",
    colors: [
      { name: "Vintage Black", hex: "#111111", inStock: true },
      { name: "Cloud White", hex: "#F5F5F3", inStock: true }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: {
      black: "/images/products/panda-black.png",
      white: "/images/products/panda-white.png"
    },
    specs: {
      gsm: 240,
      fit: "Heavyweight Oversized Fit",
      fabric: "100% Combed Cotton"
    }
  },

  // --- FUREVER CUSTOMS: WEAR YOUR PET ---
  {
    id: "fur-custom-01",
    name: "Custom Pet Line Art Oversized Tee",
    category: "Customs",
    drop: "Memory Series",
    price: 429,
    originalPrice: 799,
    badge: "10% to Animal Welfare",
    description: "Upload a photo of your pet. We hand-draw a custom minimalist line-art portrait printed on 240 GSM heavyweight cotton.",
    customizable: true,
    styleVariant: "Minimalist Line Art",
    colors: [
      { name: "Vintage Black", hex: "#111111", inStock: true },
      { name: "Cloud White", hex: "#F5F5F3", inStock: true }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: {
      black: "/images/customs/lineart-black.png",
      white: "/images/customs/lineart-white.png"
    },
    specs: {
      gsm: 240,
      customNote: "Art proof shared via WhatsApp/Email within 24 hours."
    }
  },
  {
    id: "fur-custom-02",
    name: "Custom Pet Stencil Art Oversized Tee",
    category: "Customs",
    drop: "Memory Series",
    price: 429,
    originalPrice: 799,
    badge: "10% to Animal Welfare",
    description: "High-contrast monochrome stencil portrait of your pet. 240 GSM heavyweight streetwear fit.",
    customizable: true,
    styleVariant: "Graphic Stencil Art",
    colors: [
      { name: "Vintage Black", hex: "#111111", inStock: true },
      { name: "Cloud White", hex: "#F5F5F3", inStock: true }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: {
      black: "/images/customs/stencil-black.png",
      white: "/images/customs/stencil-white.png"
    },
    specs: {
      gsm: 240,
      customNote: "Art proof shared via WhatsApp/Email within 24 hours."
    }
  }
];

export async function seedDatabase() {
  const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/furever";
  console.log("Connecting to MongoDB:", mongoUri);

  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB successfully.");

    for (const item of PRODUCTS) {
      const formatted = {
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        subCategory: item.subCategory || (item.category === "Customs" ? "Custom Pet Tee" : "Oversized Drops"),
        image1: item.images?.black,
        image2: item.images?.white || "",
        sizes: item.sizes,
        bestseller: item.badge === "Bestseller" || false,
        rating: 4.9,
        reviewCount: 38,
      };

      await Product.findOneAndUpdate(
        { name: item.name },
        { $set: formatted },
        { upsert: true, new: true }
      );
      console.log(`Seeded / Updated product: ${item.name}`);
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    await mongoose.disconnect();
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedDatabase();
}
