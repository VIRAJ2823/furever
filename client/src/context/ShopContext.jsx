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

  // ---------------- UPCOMING DROPS (TEASERS) ----------------
  const upcomingDrops = [
    {
      _id: "upcoming-01",
      name: "Shadow Stalker 260 GSM Tee",
      category: "Men",
      subCategory: "Topwear",
      price: 1299,
      image1: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop",
      image2: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop",
      sizes: ["S", "M", "L", "XL", "XXL"],
      bestseller: false,
      isUpcoming: true,
      dropBadge: "DROP 02 • SOON",
      dropDate: "Drops Next Week",
      description: "260 GSM Heavyweight French Terry in Obsidian Black with high-density silicone puff prints. Limited to 200 pieces."
    },
    {
      _id: "upcoming-02",
      name: "Cyber Stray Boxy Zip Hoodie",
      category: "Men",
      subCategory: "Winterwear",
      price: 2499,
      image1: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop",
      image2: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=800&auto=format&fit=crop",
      sizes: ["M", "L", "XL", "XXL"],
      bestseller: true,
      isUpcoming: true,
      dropBadge: "DROP 02 • SOON",
      dropDate: "Drops Next Week",
      description: "380 GSM ultra-heavyweight cotton fleece. Custom double-ended metal zipper with relaxed drop-shoulder silhouette."
    },
    {
      _id: "upcoming-03",
      name: "Rebel Pack Acid-Wash Tee",
      category: "Women",
      subCategory: "Topwear",
      price: 1199,
      image1: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop",
      image2: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=800&auto=format&fit=crop",
      sizes: ["S", "M", "L", "XL"],
      bestseller: false,
      isUpcoming: true,
      dropBadge: "DROP 02 • SOON",
      dropDate: "Drops Next Week",
      description: "Hand-treated mineral wash 240 GSM single jersey with vintage distressed collar and raw-cut edge aesthetics."
    }
  ];

  // ==================================================
  // GET PRODUCTS
  // ==================================================

  const getProducts = async () => {
    if (!serverUrl) {
      return;
    }

    try {
      setLoading(true);

      const response = await axios.get(
        `${serverUrl}/api/product/listproduct`
      );

      if (response.data.success) {
        setProducts(
          response.data.products || []
        );
      }

    } catch (error) {
      console.log(
        "Get Products Error:",
        error.response?.data ||
          error.message
      );

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