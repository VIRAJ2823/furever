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

function ShopContext({ children }) {
  const { serverUrl } = useContext(authDataContext);

  const { userData } = useContext(userDataContext);

  // ---------------- PRODUCTS ----------------

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  // ---------------- CART ----------------

  const [cartItems, setCartItems] =
    useState({});

  const [cartLoading, setCartLoading] =
    useState(false);

  const currency = "₹";

  const deliveryFee = 50;

  // ---------------- SEARCH & DRAWER ----------------
  const [search, setSearch] = useState("");
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // ---------------- FUREVER STREETWEAR CATALOG (AUTHENTIC PDF ASSETS) ----------------
  const DEFAULT_STREETWEAR_PRODUCTS = [
    {
      _id: "fur-001",
      id: "fur-001",
      name: "Just Vibin' Brontosaurus Oversized Tee",
      category: "Unisex",
      subCategory: "Oversized Drops",
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
      image1: "/images/products/vibin-black.png",
      image2: "/images/products/vibin-white.png",
      specs: {
        gsm: 240,
        fit: "Heavyweight Oversized Fit",
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
      category: "Men",
      subCategory: "Oversized Drops",
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
      image1: "/images/products/igojim-black.png",
      image2: "/images/products/igojim-white.png",
      specs: {
        gsm: 240,
        fit: "Heavyweight Oversized Fit",
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
      category: "Unisex",
      subCategory: "Oversized Drops",
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
      image1: "/images/products/panda-black.png",
      image2: "/images/products/panda-white.png",
      specs: {
        gsm: 240,
        fit: "Heavyweight Oversized Fit",
        fabric: "100% Combed Cotton"
      },
      bestseller: false,
      rating: 4.9,
      reviewCount: 29
    },
    {
      _id: "fur-custom-01",
      id: "fur-custom-01",
      name: "Custom Pet Line Art Oversized Tee",
      category: "Customs",
      subCategory: "Custom Pet Tee",
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
      image1: "/images/customs/lineart-black.png",
      image2: "/images/customs/lineart-white.png",
      specs: {
        gsm: 240,
        customNote: "Art proof shared via WhatsApp/Email within 24 hours."
      },
      bestseller: true,
      rating: 5.0,
      reviewCount: 64
    },
    {
      _id: "fur-custom-02",
      id: "fur-custom-02",
      name: "Custom Pet Stencil Art Oversized Tee",
      category: "Customs",
      subCategory: "Custom Pet Tee",
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
      image1: "/images/customs/stencil-black.png",
      image2: "/images/customs/stencil-white.png",
      specs: {
        gsm: 240,
        customNote: "Art proof shared via WhatsApp/Email within 24 hours."
      },
      bestseller: false,
      rating: 4.9,
      reviewCount: 31
    }
  ];

  const upcomingDrops = DEFAULT_STREETWEAR_PRODUCTS;

  // ==================================================
  // GET PRODUCTS
  // ==================================================

  const getProducts = async () => {
    try {
      setLoading(true);

      if (serverUrl) {
        const response = await axios.get(`${serverUrl}/api/product/listproduct`);
        if (response.data.success && Array.isArray(response.data.products) && response.data.products.length > 0) {
          // Merge server products with the rich streetwear catalog
          const serverItems = response.data.products;
          const merged = [...serverItems];
          DEFAULT_STREETWEAR_PRODUCTS.forEach((dp) => {
            if (!merged.some((m) => m.name === dp.name)) {
              merged.push(dp);
            }
          });
          setProducts(merged);
          return;
        }
      }
      setProducts(DEFAULT_STREETWEAR_PRODUCTS);
    } catch (error) {
      console.log("Get Products Error:", error.response?.data || error.message);
      setProducts(DEFAULT_STREETWEAR_PRODUCTS);
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

  useEffect(() => {
    if (
      userData?._id &&
      serverUrl
    ) {
      getCartData();

    } else {
      setCartItems({});
    }

  }, [
    userData?._id,
    serverUrl,
  ]);

  // ==================================================
  // ADD TO CART
  // ==================================================

  const addToCart = async (
    productId,
    size,
    quantity = 1
  ) => {
    if (
      !userData?._id ||
      !serverUrl
    ) {
      return false;
    }

    try {
      const response =
        await axios.post(
          `${serverUrl}/api/cart/add`,
          {
            productId,
            size,
            quantity:
              Number(quantity),
          },
          {
            withCredentials: true,
          }
        );

      if (response.data.success) {
        setCartItems(
          response.data.cartData || {}
        );

        return true;
      }

      return false;

    } catch (error) {
      console.log(
        "Add To Cart Error:",
        error.response?.data ||
          error.message
      );

      return false;
    }
  };

  // ==================================================
  // UPDATE CART QUANTITY
  // ==================================================

  const updateQuantity = async (
    productId,
    size,
    quantity
  ) => {
    if (
      !userData?._id ||
      !serverUrl
    ) {
      return false;
    }

    try {
      const response =
        await axios.post(
          `${serverUrl}/api/cart/update`,
          {
            productId,
            size,
            quantity:
              Number(quantity),
          },
          {
            withCredentials: true,
          }
        );

      if (response.data.success) {
        setCartItems(
          response.data.cartData || {}
        );

        return true;
      }

      return false;

    } catch (error) {
      console.log(
        "Update Cart Error:",
        error.response?.data ||
          error.message
      );

      return false;
    }
  };

  // ==================================================
  // REMOVE FROM CART
  // ==================================================

  const removeFromCart = async (
    productId,
    size
  ) => {
    if (
      !userData?._id ||
      !serverUrl
    ) {
      return false;
    }

    try {
      const response =
        await axios.post(
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
        setCartItems(
          response.data.cartData || {}
        );

        return true;
      }

      return false;

    } catch (error) {
      console.log(
        "Remove Cart Error:",
        error.response?.data ||
          error.message
      );

      return false;
    }
  };

  // ==================================================
  // CLEAR CART
  // ==================================================

  const clearCart = async () => {
    if (
      !userData?._id ||
      !serverUrl
    ) {
      setCartItems({});

      return false;
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