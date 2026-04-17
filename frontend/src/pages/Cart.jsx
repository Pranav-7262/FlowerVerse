import React, { useEffect, useState } from "react";
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
  CheckCircle2,
} from "lucide-react";
import { useCart } from "../contexts/CartContext";

const Cart = () => {
  const {
    cart,
    loading,
    fetchCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();
  const navigate = useNavigate();

  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    if (cart?.items?.length > 0 && selectedItems.length === 0) {
      setSelectedItems(cart.items.map((item) => item.flower._id)); // auto-select all items when cart loads
    }
  }, [cart]);

  const toggleSelection = (flowerId) => {
    setSelectedItems((prev) =>
      prev.includes(flowerId)
        ? prev.filter((id) => id !== flowerId)
        : [...prev, flowerId],
    );
  };

  // Select/Deselect All
  const toggleAll = () => {
    if (selectedItems.length === cart.items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart.items.map((item) => item.flower._id)); // select all flower ids in the cart
    }
  };

  const selectedCartItems =
    cart?.items?.filter((item) => selectedItems.includes(item.flower?._id)) ||
    []; // only the items that are selected for checkout

  const subtotal = selectedCartItems.reduce(
    (acc, item) => acc + item.flower.price * item.quantity,
    0,
  );

  const shipping = subtotal > 0 && subtotal < 500 ? 50 : 0;
  const total = subtotal + shipping;

  const handleUpdateQuantity = async (flowerId, newQuantity) => {
    if (newQuantity < 1) return;
    await updateQuantity(flowerId, newQuantity);
  };

  if (loading)
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-pink-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-pink-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto text-center space-y-6"
        >
          <div className="bg-rose-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto text-rose-600">
            <ShoppingBag size={40} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-slate-800">
            Your bag is empty
          </h2>
          <Link
            to="/"
            className="inline-block bg-gradient-to-r from-rose-600 to-pink-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-rose-600/40 hover:shadow-xl transition-all"
          >
            Explore Flowers
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-serif font-bold text-slate-900">
              Shopping Bag
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Manage your blooms before checkout
            </p>
          </div>
          <button
            onClick={toggleAll}
            className="text-sm font-bold text-slate-600 bg-rose-100/60 border border-rose-300/50 px-4 py-2 rounded-xl hover:bg-rose-100 transition-colors"
          >
            {selectedItems.length === cart.items.length
              ? "Deselect All"
              : "Select All Items"}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Items List */}
          <div className="flex-1 space-y-6">
            <AnimatePresence mode="popLayout">
              {cart.items
                .filter((item) => item.flower)
                .map((item) => {
                  const isSelected = selectedItems.includes(item.flower._id);
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -20 }}
                      key={item.flower._id}
                      className={`flex items-center gap-4 sm:gap-6 p-6 rounded-[2rem] border transition-all duration-300 ${
                        isSelected
                          ? "bg-white border-rose-300/60 shadow-lg shadow-rose-200/30"
                          : "bg-white/70 border-rose-100/50 opacity-90"
                      }`}
                    >
                      <button
                        onClick={() => toggleSelection(item.flower._id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? "bg-rose-600 border-rose-600 text-slate-600"
                            : "bg-rose-100 border-rose-300"
                        }`}
                      >
                        {isSelected && <CheckCircle2 size={16} />}
                      </button>

                      {/* Image */}
                      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shrink-0 shadow-sm">
                        <img
                          src={item.flower.image}
                          alt={item.flower.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                          {item.flower.name}
                        </h3>
                        <p className="text-sm text-rose-600 font-medium">
                          {item.flower.category}
                        </p>
                        <p className="text-md font-bold text-rose-700 mt-1">
                          ₹{item.flower.price}/kg
                        </p>

                        {/* Mobile Quantity (Hidden on desktop) */}
                        <div className="flex sm:hidden items-center gap-3 mt-3">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.flower._id,
                                item.quantity - 1,
                              )
                            }
                            className="p-1"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="font-bold">{item.quantity}</span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.flower._id,
                                item.quantity + 1,
                              )
                            }
                            className="p-1"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Desktop Quantity Controls */}
                      <div className="hidden sm:flex items-center gap-4 bg-rose-100/40 p-2 rounded-xl border border-rose-200/50">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.flower._id,
                              item.quantity - 1,
                            )
                          }
                          className="p-1 hover:text-rose-700"
                        >
                          <Minus size={18} />
                        </button>
                        <span className="font-bold w-6 text-center text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.flower._id,
                              item.quantity + 1,
                            )
                          }
                          className="p-1 hover:text-rose-700"
                        >
                          <Plus size={18} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.flower._id)}
                        className="p-2 text-gray-600 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </motion.div>
                  );
                })}
            </AnimatePresence>

            <div className="flex justify-between items-center px-4">
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-sm font-bold text-emerald-700 hover:underline"
              >
                <ChevronLeft size={16} /> Continue Shopping
              </button>
              <button
                onClick={clearCart}
                className="text-sm font-bold text-red-400 hover:text-red-600 flex items-center gap-2"
              >
                <Trash2 size={16} /> Clear Bag
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-96">
            <div className="bg-white/80 rounded-[2.5rem] p-8 border border-rose-200/50 shadow-lg shadow-rose-200/20 sticky top-28">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Summary
              </h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-slate-700 font-medium">
                  <span>Selected Items ({selectedItems.length})</span>
                  <span className="text-slate-900 font-bold">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-slate-700 font-medium">
                  <span>Shipping</span>
                  <span
                    className={
                      shipping === 0
                        ? "text-rose-600 font-bold"
                        : "text-slate-900 font-bold"
                    }
                  >
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </span>
                </div>

                {subtotal > 0 && subtotal < 500 && (
                  <div className="bg-rose-100/40 p-3 rounded-xl flex items-center gap-3 border border-rose-300/30">
                    <Truck size={18} className="text-rose-600" />
                    <p className="text-[11px] text-slate-700 leading-tight">
                      Add <b>₹{500 - subtotal}</b> more for <b>FREE shipping</b>
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t border-rose-200/50 flex justify-between text-2xl font-black text-slate-900">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <button
                disabled={selectedItems.length === 0}
                onClick={() =>
                  navigate("/checkout", {
                    state: {
                      items: selectedCartItems, // Passing ONLY selected items to checkout
                      totalAmount: total,
                    },
                  })
                }
                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
                  selectedItems.length === 0
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg shadow-rose-600/30 hover:from-rose-500 hover:to-pink-500 hover:-translate-y-1"
                }`}
              >
                Checkout Selected <ArrowRight size={18} />
              </button>

              <div className="mt-6 flex items-center justify-center gap-3 text-[10px] text-slate-600 font-black uppercase tracking-widest">
                <CreditCard size={14} /> Encrypted Payment
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
