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
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (!cart?.items || cart.items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto text-center py-20 space-y-6"
      >
        <div className="bg-emerald-600/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto text-emerald-400">
          <ShoppingBag size={40} />
        </div>
        <h2 className="text-3xl font-serif font-bold text-gray-100">
          Your bag is empty
        </h2>
        <Link
          to="/"
          className="inline-block bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-600/40 hover:shadow-xl transition-all"
        >
          Explore Flowers
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-900">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-serif font-bold text-gray-100">
            Shopping Bag
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage your blooms before checkout
          </p>
        </div>
        <button
          onClick={toggleAll}
          className="text-sm font-bold text-emerald-300 bg-emerald-600/20 border border-emerald-500/50 px-4 py-2 rounded-xl hover:bg-emerald-600/30 transition-colors"
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
                        ? "bg-slate-800 border-emerald-500/50 shadow-lg shadow-emerald-600/30"
                        : "bg-slate-800/50 border-slate-700 opacity-70"
                    }`}
                  >
                    <button
                      onClick={() => toggleSelection(item.flower._id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-emerald-600 border-emerald-600 text-white"
                          : "bg-slate-700 border-slate-600"
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
                      <h3 className="text-lg sm:text-xl font-bold text-gray-100 truncate">
                        {item.flower.name}
                      </h3>
                      <p className="text-sm text-emerald-400 font-medium">
                        {item.flower.category}
                      </p>
                      <p className="text-md font-bold text-emerald-300 mt-1">
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
                    <div className="hidden sm:flex items-center gap-4 bg-slate-700/50 p-2 rounded-xl">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(
                            item.flower._id,
                            item.quantity - 1,
                          )
                        }
                        className="p-1 hover:text-emerald-600"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="font-bold w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(
                            item.flower._id,
                            item.quantity + 1,
                          )
                        }
                        className="p-1 hover:text-emerald-600"
                      >
                        <Plus size={18} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.flower._id)}
                      className="p-2 text-gray-300 hover:text-red-500 transition-colors"
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
          <div className="bg-slate-800/50 rounded-[2.5rem] p-8 border border-slate-700 shadow-xl shadow-black/40 sticky top-28\">
            <h2 className="text-2xl font-bold text-gray-100 mb-6\">Summary</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Selected Items ({selectedItems.length})</span>
                <span className="text-gray-100">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Shipping</span>
                <span
                  className={
                    shipping === 0 ? "text-emerald-400" : "text-gray-100"
                  }
                >
                  {shipping === 0 ? "FREE" : `₹${shipping}`}
                </span>
              </div>

              {subtotal > 0 && subtotal < 500 && (
                <div className="bg-emerald-50 p-3 rounded-xl flex items-center gap-3">
                  <Truck size={18} className="text-emerald-600" />
                  <p className="text-[11px] text-emerald-700 leading-tight">
                    Add <b>₹{500 - subtotal}</b> more for <b>FREE shipping</b>
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-slate-700 flex justify-between text-2xl font-black text-gray-100">
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
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-emerald-600 text-white shadow-lg shadow-emerald-100 hover:bg-emerald-700 hover:-translate-y-1"
              }`}
            >
              Checkout Selected <ArrowRight size={18} />
            </button>

            <div className="mt-6 flex items-center justify-center gap-3 text-[10px] text-gray-400 font-black uppercase tracking-widest">
              <CreditCard size={14} /> Encrypted Payment
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
