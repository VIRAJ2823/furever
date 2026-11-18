import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import axios from "axios";

import { authDataContext } from "./Authcontext.jsx";
import { userDataContext } from "./UserContext.jsx";

export const shopDataContext = createContext();

// ---------------- FUREVER LIFESTYLE CATALOG (AUTHENTIC COLLECTION ASSETS) ----------------
const DEFAULT_FUREVER_PRODUCTS = [
  // --- FUREVER ORIGINALS: DROP 001 LINE ART SERIES ---
  {
    _id: "fur-004",
    id: "fur-004",
    name: "Boy & Dog Line Art Oversized Tee",
    category: "Furever Originals",
    subCategory: "Drop 001 Bond Line Art Series",
    drop: "Drop 001",
    price: 399,
    originalPrice: 799,
    badge: "Drop 001",
    description: "240 GSM heavyweight combed cotton. Minimalist line-art illustration of the unbreakable human-canine bond with drop-shoulder silhouette.",
    colors: [
      { name: "Vintage Black", hex: "#111111", inStock: true },
      { name: "Cloud White", hex: "#F5F5F3", inStock: true }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: {
      black: "/images/products/originals-boy-dog-black.jpg",
      white: "/images/products/originals-boy-dog-white.jpg"
    },
    image1: "/images/products/originals-boy-dog-black.jpg",
    image2: "/images/products/originals-boy-dog-white.jpg",
    specs: {
      gsm: 240,
      fit: "Heavyweight Drop Shoulder Fit",
      fabric: "100% Combed Cotton",
      care: "Cold machine wash inside out, do not iron on print"
    },
    bestseller: true,
    rating: 5.0,
    reviewCount: 52
  },
  {
    _id: "fur-005",
    id: "fur-005",
    name: "Girl & Dog Line Art Oversized Tee",
    category: "Furever Originals",
    subCategory: "Drop 001 Bond Line Art Series",
    drop: "Drop 001",
    price: 399,
    originalPrice: 799,
    badge: "Drop 001",
    description: "240 GSM heavyweight combed cotton. Minimalist fine line-art portrait celebrating pure companionship on our signature oversized drop-shoulder drape.",
    colors: [
      { name: "Vintage Black", hex: "#111111", inStock: true },
      { name: "Cloud White", hex: "#F5F5F3", inStock: true }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: {
      black: "/images/products/originals-girl-dog-black.jpg",
      white: "/images/products/originals-girl-dog-white.jpg"
    },
    image1: "/images/products/originals-girl-dog-black.jpg",
    image2: "/images/products/originals-girl-dog-white.jpg",
    specs: {
      gsm: 240,
      fit: "Heavyweight Drop Shoulder Fit",
      fabric: "100% Combed Cotton",
      care: "Cold machine wash inside out, do not iron on print"
    },
    bestseller: true,
    rating: 5.0,
    reviewCount: 44
  },

  // --- FUREVER ESSENTIALS: DROP 002 EMBROIDERED & GRAPHIC SERIES ---
  {
    _id: "fur-006",
    id: "fur-006",
    name: "Minimal Embroidered Infinity Logo Tee",
    category: "Furever Essentials",
    subCategory: "Drop 002 Essentials Series",
    drop: "Drop 002",
    price: 189,
    originalPrice: 399,
    badge: "Essential",
    description: "100% soft breathable combed cotton. Subtle high-density embroidered Furever infinity logo on chest for clean everyday comfort.",
    colors: [
      { name: "Vintage Black", hex: "#111111", inStock: true },
      { name: "Cloud White", hex: "#F5F5F3", inStock: true },
      { name: "Heather Grey", hex: "#9E9E9E", inStock: true },
      { name: "Baby Pink", hex: "#F7CAD0", inStock: true }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: {
      black: "/images/products/essentials-logo-black.jpg",
      white: "/images/products/essentials-logo-white.jpg",
      grey: "/images/products/essentials-logo-grey.jpg",
      pink: "/images/products/essentials-logo-pink.jpg"
    },
    image1: "/images/products/essentials-logo-black.jpg",
    image2: "/images/products/essentials-logo-white.jpg",
    specs: {
      gsm: 200,
      fit: "Everyday Classic Fit",
      fabric: "100% Cotton",
      care: "Cold machine wash inside out"
    },
    bestseller: false,
    rating: 4.8,
    reviewCount: 39
  },
  {
    _id: "fur-007",
    id: "fur-007",
    name: "Just a Chill Girl Graphic Tee",
    category: "Furever Essentials",
    subCategory: "Drop 002 Graphic Series",
    drop: "Drop 002",
    price: 249,
    originalPrice: 499,
    badge: "Drop 002",
    description: "100% cotton everyday tee featuring the iconic sunglasses cat with headscarf and iced drink graphic.",
    colors: [
      { name: "Vintage Black", hex: "#111111", inStock: true },
      { name: "Cloud White", hex: "#F5F5F3", inStock: true },
      { name: "Heather Grey", hex: "#9E9E9E", inStock: true },
      { name: "Baby Pink", hex: "#F7CAD0", inStock: true }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: {
      black: "/images/products/essentials-chillgirl.jpg",
      white: "/images/products/essentials-chillgirl.jpg"
    },
    image1: "/images/products/essentials-chillgirl.jpg",
    image2: "/images/products/essentials-chillgirl.jpg",
    specs: {
      gsm: 220,
      fit: "Relaxed Everyday Fit",
      fabric: "100% Cotton",
      care: "Cold machine wash inside out, do not iron on print"
    },
    bestseller: false,
    rating: 4.9,
    reviewCount: 27
  },
  {
    _id: "fur-008",
    id: "fur-008",
    name: "Polaroid Best Friends Graphic Tee",
    category: "Furever Essentials",
    subCategory: "Drop 002 Graphic Series",
    drop: "Drop 002",
    price: 249,
    originalPrice: 499,
    badge: "Drop 002",
    description: "100% cotton tee featuring dual vintage Polaroid snapshots of our gamer cat and puppy in cap.",
    colors: [
      { name: "Vintage Black", hex: "#111111", inStock: true },
      { name: "Cloud White", hex: "#F5F5F3", inStock: true },
      { name: "Heather Grey", hex: "#9E9E9E", inStock: true },
      { name: "Baby Pink", hex: "#F7CAD0", inStock: true }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: {
      black: "/images/products/essentials-polaroid.jpg",
      white: "/images/products/essentials-polaroid.jpg"
    },
    image1: "/images/products/essentials-polaroid.jpg",
    image2: "/images/products/essentials-polaroid.jpg",
    specs: {
      gsm: 220,
      fit: "Relaxed Everyday Fit",
      fabric: "100% Cotton",
      care: "Cold machine wash inside out, do not iron on print"
    },
    bestseller: false,
    rating: 4.9,
    reviewCount: 31
  },
  {
    _id: "fur-009",
    id: "fur-009",
    name: "Pookie Don Bow Cat Graphic Tee",
    category: "Furever Essentials",
    subCategory: "Drop 002 Graphic Series",
    drop: "Drop 002",
    price: 249,
    originalPrice: 499,
    badge: "Drop 002",
    description: "100% cotton tee featuring the internet-favorite pink bow pookie don cat with knife graphic.",
    colors: [
      { name: "Vintage Black", hex: "#111111", inStock: true },
      { name: "Cloud White", hex: "#F5F5F3", inStock: true },
      { name: "Heather Grey", hex: "#9E9E9E", inStock: true },
      { name: "Baby Pink", hex: "#F7CAD0", inStock: true }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: {
      black: "/images/products/essentials-pookiedon.jpg",
      white: "/images/products/essentials-pookiedon.jpg"
    },
    image1: "/images/products/essentials-pookiedon.jpg",
    image2: "/images/products/essentials-pookiedon.jpg",
    specs: {
      gsm: 220,
      fit: "Relaxed Everyday Fit",
      fabric: "100% Cotton",
      care: "Cold machine wash inside out, do not iron on print"
    },
    bestseller: false,
    rating: 4.8,
    reviewCount: 22
  },
  {
    _id: "fur-010",
    id: "fur-010",
    name: "Winter is Coming Knight Cat Graphic Tee",
    category: "Furever Essentials",
    subCategory: "Drop 002 Graphic Series",
    drop: "Drop 002",
    price: 249,
    originalPrice: 499,
    badge: "Drop 002",
    description: "100% cotton tee featuring armored knight cat with broadsword and flowing cape ('Winter is Coming').",
    colors: [
      { name: "Vintage Black", hex: "#111111", inStock: true },
      { name: "Cloud White", hex: "#F5F5F3", inStock: true },
      { name: "Heather Grey", hex: "#9E9E9E", inStock: true },
      { name: "Baby Pink", hex: "#F7CAD0", inStock: true }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: {
      black: "/images/products/essentials-winteriscoming.jpg",
      white: "/images/products/essentials-winteriscoming.jpg"
    },
    image1: "/images/products/essentials-winteriscoming.jpg",
    image2: "/images/products/essentials-winteriscoming.jpg",
    specs: {
      gsm: 220,
      fit: "Relaxed Everyday Fit",
      fabric: "100% Cotton",
      care: "Cold machine wash inside out, do not iron on print"
    },
    bestseller: false,
    rating: 4.9,
    reviewCount: 19
  },

  // --- FUREVER ORIGINALS: ANIMAL GRAPHIC SERIES ---
  {
    _id: "fur-001",
    id: "fur-001",
    name: "Just Vibin' Brontosaurus Oversized Tee",
    category: "Furever Animals",
    subCategory: "Originals Graphic Series",
    drop: "Originals",
    price: 399,
    originalPrice: 799,
    badge: "Bestseller",
    description: "240 GSM Heavyweight French Terry cotton. Relaxed drape featuring our chill dino graphic.",
    colors: [
      { name: "Vintage Black", hex: "#111111", inStock: true },
      { name: "Cloud White", hex: "#F5F5F3", inStock: true }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: {
      black: "/images/products/vibin-black.png",
      white: "/images/products/vibin-white.png"
    },
    image1: "/images/products/vibin-black.png",
    image2: "/images/products/vibin-white.png",
    specs: {
      gsm: 240,
      fit: "Heavyweight Relaxed Fit",
      fabric: "100% Combed Cotton",
      care: "Cold machine wash inside out, do not iron on print"
    },
    bestseller: true,
    rating: 4.9,
    reviewCount: 48
  },
  {
    _id: "fur-002",
    id: "fur-002",
    name: "I Go Jim Dino Oversized Tee",
    category: "Furever Animals",
    subCategory: "Originals Graphic Series",
    drop: "Originals",
    price: 399,
    originalPrice: 799,
    badge: "Trending",
    description: "240 GSM Heavyweight French Terry. The mini dino tee built for comfortable everyday wear.",
    colors: [
      { name: "Vintage Black", hex: "#111111", inStock: true },
      { name: "Cloud White", hex: "#F5F5F3", inStock: true }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: {
      black: "/images/products/igojim-black.png",
      white: "/images/products/igojim-white.png"
    },
    image1: "/images/products/igojim-black.png",
    image2: "/images/products/igojim-white.png",
    specs: {
      gsm: 240,
      fit: "Heavyweight Relaxed Fit",
      fabric: "100% Combed Cotton"
    },
    bestseller: true,
    rating: 4.8,
    reviewCount: 36
  },
  {
    _id: "fur-003",
    id: "fur-003",
    name: "Do Not Disturb Lazy Panda Tee",
    category: "Furever Animals",
    subCategory: "Originals Graphic Series",
    drop: "Originals",
    price: 399,
    originalPrice: 799,
    badge: "Essential",
    description: "240 GSM breathable cotton with our sleeping panda graphic print. Slouchy relaxed drape.",
    colors: [
      { name: "Vintage Black", hex: "#111111", inStock: true },
      { name: "Cloud White", hex: "#F5F5F3", inStock: true }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: {
      black: "/images/products/panda-black.png",
      white: "/images/products/panda-white.png"
    },
    image1: "/images/products/panda-black.png",
    image2: "/images/products/panda-white.png",
    specs: {
      gsm: 240,
      fit: "Heavyweight Relaxed Fit",
      fabric: "100% Combed Cotton"
    },
    bestseller: false,
    rating: 4.9,
    reviewCount: 29
  },

  // --- FUREVER CUSTOMS: WEAR YOUR PET ---
  {
    _id: "fur-custom-01",
    id: "fur-custom-01",
    name: "Custom Pet Line Art Oversized Tee",
    category: "Furever Customs",
    subCategory: "Custom Pet Memory Series",
    drop: "Memory Series",
    price: 429,
    originalPrice: 799,
    badge: "10% to Animal Welfare",
    description: "Upload a photo of your companion. We hand-draw a minimalist line-art portrait printed on heavyweight cotton. Photos given in high quality will be printed with exceptional detail.",
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
    image1: "/images/customs/lineart-black.png",
    image2: "/images/customs/lineart-white.png",
    specs: {
      gsm: 240,
      customNote: "Photos given in high quality will be printed. Art proof shared via WhatsApp within 24 hours."
    },
    bestseller: true,
    rating: 5.0,
    reviewCount: 64
  },
  {
    _id: "fur-custom-02",
    id: "fur-custom-02",
    name: "Custom Pet Stencil Art Oversized Tee",
    category: "Furever Customs",
    subCategory: "Custom Pet Memory Series",
    drop: "Memory Series",
    price: 429,
    originalPrice: 799,
    badge: "10% to Animal Welfare",
    description: "High-contrast monochrome stencil portrait of your pet. Heavyweight relaxed drape. Photos given in high quality will be printed with crisp sharpness.",
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
    image1: "/images/customs/stencil-black.png",
    image2: "/images/customs/stencil-white.png",
    specs: {
      gsm: 240,
      customNote: "Photos given in high quality will be printed. Art proof shared via WhatsApp within 24 hours."
    },
    bestseller: false,
    rating: 4.9,
    reviewCount: 31
  }
];

function ShopContext({ children }) {
  const { serverUrl } = useContext(authDataContext);
  const { userData } = useContext(userDataContext);

  // ---------------- PRODUCTS ----------------
  const [products, setProducts] = useState(DEFAULT_FUREVER_PRODUCTS);
  const [loading, setLoading] = useState(false);

  // ---------------- CART ----------------
  const [cartItems, setCartItems] = useState({});
  const [cartLoading, setCartLoading] = useState(false);

  const currency = "₹";
  const deliveryFee = 50;

  // ---------------- SEARCH & DRAWER ----------------
  const [search, setSearch] = useState("");
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  const upcomingDrops = DEFAULT_FUREVER_PRODUCTS;

  // Helper to normalize category
  const normalizeCategory = (cat) => {
    if (!cat) return "Furever Animals";
    const lower = cat.toLowerCase();
    if (lower.includes("custom")) return "Furever Customs";
    return "Furever Animals";
  };

  // ==================================================
  // GET PRODUCTS
  // ==================================================

  const getProducts = async () => {
    try {
      setLoading(true);

      if (serverUrl) {
        const response = await axios.get(`${serverUrl}/api/product/listproduct`);
        if (response.data.success && Array.isArray(response.data.products) && response.data.products.length > 0) {
          const serverItems = response.data.products.map((item) => ({
            ...item,
            category: normalizeCategory(item.category),
          }));
          const merged = [...serverItems];
          DEFAULT_FUREVER_PRODUCTS.forEach((dp) => {
            if (!merged.some((m) => m.name === dp.name)) {
              merged.push(dp);
            }
          });
          setProducts(merged);
          return;
        }
      }
      setProducts(DEFAULT_FUREVER_PRODUCTS);
    } catch (error) {
      console.log("Get Products Error:", error.response?.data || error.message);
      setProducts(DEFAULT_FUREVER_PRODUCTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, [serverUrl]);

  // ==================================================
  // GET CART FROM BACKEND
  // ==================================================

  const getCartData = async () => {
    if (
      !userData?._id ||
      !serverUrl
    ) {
      setCartItems({});
      return;
    }

    try {
      setCartLoading(true);

      const response = await axios.get(
        `${serverUrl}/api/cart/get`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setCartItems(
          response.data.cartData || {}
        );
      } else {
        setCartItems({});
      }

    } catch (error) {
      console.log(
        "Get Cart Error:",
        error.response?.data ||
          error.message
      );

      setCartItems({});

    } finally {
      setCartLoading(false);
    }
  };

  // ==================================================
  // LOAD CART WHEN USER CHANGES
  // ==================================================

  // ==================================================
  // LOAD CART WHEN USER CHANGES (WITH GUEST CART SYNC)
  // ==================================================

  useEffect(() => {
    if (userData?._id && serverUrl) {
      // Sync guest cart to server if any items exist
      try {
        const guestCartRaw = localStorage.getItem("furever_guest_cart");
        if (guestCartRaw) {
          const guestCart = JSON.parse(guestCartRaw);
          const syncPromises = [];
          Object.entries(guestCart).forEach(([pId, sizes]) => {
            Object.entries(sizes || {}).forEach(([sz, qty]) => {
              if (Number(qty) > 0) {
                syncPromises.push(
                  axios.post(
                    `${serverUrl}/api/cart/add`,
                    { productId: pId, size: sz, quantity: Number(qty) },
                    { withCredentials: true }
                  ).catch((err) => console.log("Guest sync item err", err))
                );
              }
            });
          });
          if (syncPromises.length > 0) {
            Promise.all(syncPromises).finally(() => {
              localStorage.removeItem("furever_guest_cart");
              getCartData();
            });
            return;
          }
        }
      } catch (e) {
        console.log("Guest cart sync err", e);
      }
      getCartData();
    } else {
      // Load from guest cart in localStorage
      try {
        const guestCartRaw = localStorage.getItem("furever_guest_cart");
        if (guestCartRaw) {
          setCartItems(JSON.parse(guestCartRaw));
        } else {
          setCartItems({});
        }
      } catch {
        setCartItems({});
      }
    }
  }, [userData?._id, serverUrl]);

  // ==================================================
  // ADD TO CART (WITH GUEST FALLBACK)
  // ==================================================

  const addToCart = async (productId, size, quantity = 1) => {
    if (!productId || !size) return false;

    // Guest Cart Fallback
    if (!userData?._id || !serverUrl) {
      try {
        setCartItems((prev) => {
          const updated = { ...prev };
          if (!updated[productId]) updated[productId] = {};
          updated[productId][size] = (Number(updated[productId][size]) || 0) + Number(quantity);
          try {
            localStorage.setItem("furever_guest_cart", JSON.stringify(updated));
          } catch (e) {
            console.error(e);
          }
          return updated;
        });
        return true;
      } catch (err) {
        console.error(err);
        return false;
      }
    }

    try {
      const response = await axios.post(
        `${serverUrl}/api/cart/add`,
        {
          productId,
          size,
          quantity: Number(quantity),
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setCartItems(response.data.cartData || {});
        return true;
      }

      return false;
    } catch (error) {
      console.log("Add To Cart Error:", error.response?.data || error.message);
      return false;
    }
  };

  // ==================================================
  // UPDATE CART QUANTITY (WITH GUEST FALLBACK)
  // ==================================================

  const updateQuantity = async (productId, size, quantity) => {
    const qty = Number(quantity);

    // Guest Cart Fallback
    if (!userData?._id || !serverUrl) {
      setCartItems((prev) => {
        const updated = { ...prev };
        if (!updated[productId]) updated[productId] = {};
        if (qty <= 0) {
          delete updated[productId][size];
          if (Object.keys(updated[productId]).length === 0) {
            delete updated[productId];
          }
        } else {
          updated[productId][size] = qty;
        }
        try {
          localStorage.setItem("furever_guest_cart", JSON.stringify(updated));
        } catch (e) {
          console.error(e);
        }
        return updated;
      });
      return true;
    }

    try {
      const response = await axios.post(
        `${serverUrl}/api/cart/update`,
        {
          productId,
          size,
          quantity: qty,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setCartItems(response.data.cartData || {});
        return true;
      }

      return false;
    } catch (error) {
      console.log("Update Cart Error:", error.response?.data || error.message);
      return false;
    }
  };

  // ==================================================
  // REMOVE FROM CART (WITH GUEST FALLBACK)
  // ==================================================

  const removeFromCart = async (productId, size) => {
    // Guest Cart Fallback
    if (!userData?._id || !serverUrl) {
      return updateQuantity(productId, size, 0);
    }

    try {
      const response = await axios.post(
        `${serverUrl}/api/cart/remove`,
        {
          productId,
          size,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setCartItems(response.data.cartData || {});
        return true;
      }

      return false;
    } catch (error) {
      console.log("Remove Cart Error:", error.response?.data || error.message);
      return false;
    }
  };

  // ==================================================
  // CLEAR CART
  // ==================================================

  const clearCart = async () => {
    if (!userData?._id || !serverUrl) {
      setCartItems({});
      try {
        localStorage.removeItem("furever_guest_cart");
      } catch (e) {
        console.error(e);
      }
      return true;
    }

    try {
      const response =
        await axios.post(
          `${serverUrl}/api/cart/clear`,
          {},
          {
            withCredentials: true,
          }
        );

      if (response.data.success) {
        setCartItems({});

        return true;
      }

      return false;

    } catch (error) {
      console.log(
        "Clear Cart Error:",
        error.response?.data ||
          error.message
      );

      return false;
    }
  };

  // ==================================================
  // GET TOTAL CART QUANTITY
  // ==================================================

  const getCartCount = () => {
    let totalCount = 0;

    Object.values(
      cartItems || {}
    ).forEach(
      (productSizes) => {
        Object.values(
          productSizes || {}
        ).forEach(
          (quantity) => {
            totalCount +=
              Number(quantity || 0);
          }
        );
      }
    );

    return totalCount;
  };

  // ==================================================
  // GET TOTAL CART AMOUNT
  // ==================================================

  const getCartAmount = () => {
    let totalAmount = 0;

    Object.entries(
      cartItems || {}
    ).forEach(
      ([
        productId,
        productSizes,
      ]) => {
        const product =
          products.find(
            (item) =>
              item._id ===
              productId
          );

        if (!product) {
          return;
        }

        Object.values(
          productSizes || {}
        ).forEach(
          (quantity) => {
            totalAmount +=
              Number(
                product.price || 0
              ) *
              Number(
                quantity || 0
              );
          }
        );
      }
    );

    return totalAmount;
  };

  // ==================================================
  // CONTEXT VALUE
  // ==================================================

  const value = {
    // Products

    products,

    setProducts,

    loading,

    getProducts,

    // Store

    currency,

    deliveryFee,

    // Cart

    cartItems,

    setCartItems,

    cartLoading,

    getCartData,

    addToCart,

    updateQuantity,

    removeFromCart,

    clearCart,

    getCartCount,

    getCartAmount,

    // Search & Drawer
    search,

    setSearch,

    isCartDrawerOpen,

    setIsCartDrawerOpen,

    upcomingDrops,
  };

  return (
    <shopDataContext.Provider
      value={value}
    >
      {children}
    </shopDataContext.Provider>
  );
}

export default ShopContext;