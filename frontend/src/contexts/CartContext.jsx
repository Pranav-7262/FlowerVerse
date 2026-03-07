import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios.js";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const { user, loading: authLoading } = useAuth();

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await api.get("/cart");
      const cartData = res.data.data.Mycart;
      setCart(cartData);
      // count should reflect total quantity, not just number of line items
      const totalQty = cartData?.items?.reduce(
        (acc, item) => acc + (item.quantity || 0),
        0,
      );
      setCartCount(totalQty || 0);
      return cartData;
    } catch (err) {
      console.error("Cart fetch error:", err);
      setCart(null);
      setCartCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch cart when user is authenticated and auth is not loading
    if (!authLoading && user) {
      fetchCart();
    } else if (!authLoading && !user) {
      // Clear cart when user is not authenticated
      setCart(null);
      setCartCount(0);
      setLoading(false);
    }

    // Listen for cart updates from other operations
    const handleCartUpdate = () => {
      if (user) {
        fetchCart();
      }
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [user, authLoading]);

  const addToCart = async (flowerId, quantity = 1) => {
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }
    try {
      const res = await api.post("/cart/add", { flowerId, quantity });
      toast.success("Added to cart 🌸");
      await fetchCart();
      window.dispatchEvent(new Event("cartUpdated"));
      return res.data;
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Failed to add to cart");
      throw err;
    }
  };

  const updateQuantity = async (flowerId, newQuantity) => {
    if (!user) {
      toast.error("Please login to update cart");
      return;
    }
    if (newQuantity < 1) return;
    try {
      const res = await api.patch("/cart/update", {
        flowerId,
        quantity: newQuantity,
      });
      await fetchCart();
      window.dispatchEvent(new Event("cartUpdated"));
      return res.data;
    } catch (err) {
      console.error("Error updating quantity:", err);
      toast.error("Stock limit reached");
      throw err;
    }
  };

  const removeFromCart = async (flowerId) => {
    if (!user) {
      toast.error("Please login to remove items from cart");
      return;
    }
    try {
      const res = await api.delete(`/cart/remove/${flowerId}`);
      toast.success("Removed from bag");
      await fetchCart();
      window.dispatchEvent(new Event("cartUpdated"));
      return res.data;
    } catch (err) {
      console.error("Error removing from cart:", err);
      toast.error("Failed to remove");
      throw err;
    }
  };

  const getCartSummary = () => {
    if (!cart || !cart.items) {
      return {
        items: [],
        subtotal: 0,
        shipping: 0,
        tax: 0,
        total: 0,
        itemCount: 0,
      };
    }

    const items = cart.items;
    const subtotal = items.reduce(
      (acc, item) =>
        item.flower ? acc + item.flower.price * item.quantity : acc,
      0,
    );

    const shipping = subtotal > 500 ? 0 : 50;
    const tax = Math.round((subtotal * 5) / 100);
    const total = subtotal + shipping + tax;
    const itemCount = items.length;

    return {
      items,
      subtotal,
      shipping,
      tax,
      total,
      itemCount,
    };
  };

  const clearCart = async () => {
    try {
      // Assuming there's a clear cart endpoint
      await api.delete("/cart/clear-cart");
      toast.success("Cart cleared");
      await fetchCart();

      setCart(null);
      setCartCount(0);
      toast.success("Cart cleared");
    } catch (err) {
      console.error("Error clearing cart:", err);
      toast.error("Failed to clear cart");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        cartCount,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        getCartSummary,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
