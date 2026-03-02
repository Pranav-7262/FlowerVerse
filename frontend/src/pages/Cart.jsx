import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ChevronLeft,
  Truck,
  CreditCard,
} from "lucide-react";
import { useCart } from "../contexts/CartContext";

const Cart = () => {
  const navigate = useNavigate();
  const {
    cart,
    loading,
    fetchCart,
    updateQuantity,
    removeFromCart,
    getCartSummary,
  } = useCart();

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (flowerId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateQuantity(flowerId, newQuantity);
    } catch (err) {
      // Error toast already shown by context
    }
  };

  const handleRemove = async (flowerId) => {
    try {
      await removeFromCart(flowerId);
    } catch (err) {
      // Error toast already shown by context
    }
  };

  if (loading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  const { items, subtotal, shipping, tax, total } = getCartSummary();

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto text-center py-20 space-y-6"
      >
        <div className="bg-emerald-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto text-emerald-600">
          <ShoppingBag size={40} />
        </div>
        <h2 className="text-3xl font-serif font-bold text-gray-900">
          Your bag is empty
        </h2>
        <p className="text-gray-500">
          Looks like you haven't added any blooms to your collection yet.
        </p>
        <Link
          to="/"
          className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all"
        >
          Explore Flowers
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center gap-4 mb-10">
        <h1 className="text-4xl font-serif font-bold text-gray-900">
          Shopping Bag
        </h1>
        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-bold">
          {items.length} Items
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Items List */}
        <div className="flex-1 space-y-6">
          <AnimatePresence>
            {items
              .filter((item) => item.flower)
              .map((item) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={item.flower._id}
                  className="flex flex-col sm:flex-row items-center gap-6 bg-white p-6 rounded-4xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Image */}
                  <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gray-50 shrink-0">
                    <img
                      src={item.flower.image}
                      alt={item.flower.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-xl font-bold text-gray-900">
                      {item.flower.name}
                    </h3>
                    <p className="text-sm text-emerald-600 font-medium">
                      {item.flower.category}
                    </p>
                    <p className="text-lg font-bold text-gray-700 mt-2">
                      ₹{item.flower.price}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-xl">
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.flower._id, item.quantity - 1)
                      }
                      className="p-1 hover:text-emerald-600 transition-colors"
                    >
                      <Minus size={20} />
                    </button>
                    <span className="font-bold w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.flower._id, item.quantity + 1)
                      }
                      className="p-1 hover:text-emerald-600 transition-colors"
                    >
                      <Plus size={20} />
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => handleRemove(item.flower._id)}
                    className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </motion.div>
              ))}
          </AnimatePresence>

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm font-bold text-emerald-700 hover:underline px-4"
          >
            <ChevronLeft size={16} /> Continue Shopping
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:w-96">
          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl sticky top-28">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Summary</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-gray-900">
                  {shipping === 0 ? "FREE" : `₹${shipping}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-[10px] text-emerald-600 bg-emerald-50 p-2 rounded-lg flex items-center gap-2 font-bold">
                  <Truck size={14} /> Add ₹{500 - subtotal} more for FREE
                  shipping!
                </p>
              )}
              <div className="pt-4 border-t border-gray-100 flex justify-between text-xl font-bold text-gray-900">
                <span>Total</span>
                <span>₹{subtotal + shipping}</span>
              </div>
            </div>

            <button
              onClick={() =>
                navigate("/checkout", {
                  state: {
                    items: cart.items, // This must contain the updated quantities
                    totalAmount: subtotal, // Your calculated subtotal + shipping
                  },
                })
              }
              className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold ..."
            >
              Proceed to Checkout
            </button>
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
                <CreditCard size={14} /> Secure Payment Guaranteed
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
