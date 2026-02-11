import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  ArrowRight,
  ChevronLeft,
  Lock,
  MapPin,
} from "lucide-react";
import api from "../api/axios.js";
import toast from "react-hot-toast";

const Checkout = () => {
  const { state } = useLocation(); // Receives { items, totalAmount } from Cart
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (!state || !state.items || state.items.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Your bag is empty</h2>
        <Link to="/" className="text-emerald-600 font-bold underline">
          Go shopping
        </Link>
      </div>
    );
  }
  const handlePlaceOrder = async () => {
    setLoading(true);
    const toastId = toast.loading("Processing your order...");

    try {
      for (const item of state.items) {
        const targetFlowerId = item.flowerId?._id;
        console.log("Sending ID to backend:", targetFlowerId);
        await api.post("/orders/checkout", {
          flowerId: targetFlowerId, // SENDING THE STRING ID
          quantity: item.quantity,
        });
      }
      await api.delete("/cart/clear-cart");

      toast.success("Order Placed Successfully! 🌸", { id: toastId });
      navigate("/orders");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Order failed", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-emerald-700 mb-8 transition-colors"
      >
        <ChevronLeft size={18} /> Review Bag
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* LEFT: Shipping & Summary */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white rounded-4xl p-8 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MapPin className="text-emerald-600" /> Delivery Details
            </h2>
            <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-100">
              <p className="font-bold text-emerald-900">Standard Delivery</p>
              <p className="text-sm text-emerald-700 opacity-80">
                Estimated arrival: 2-3 Business Days
              </p>
            </div>
          </section>

          <section className="bg-white rounded-4xl p-8 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Truck className="text-emerald-600" /> Order Review
            </h2>
            <div className="divide-y divide-gray-50">
              {state.items.map((item, idx) => (
                <div
                  key={idx}
                  className="py-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.flower?.image || item.image}
                      className="w-12 h-12 rounded-lg object-cover"
                      alt=""
                    />
                    <div>
                      <p className="font-bold text-gray-800">
                        {item.flower?.name || item.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-gray-700">
                    ₹{(item.flower?.price || item.price) * item.quantity}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT: Payment & Total */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white sticky top-28 shadow-2xl shadow-emerald-900/20">
            <h3 className="text-xl font-bold mb-8">Payment</h3>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-400 text-sm">
                <span>Subtotal</span>
                <span>₹{state.totalAmount}</span>
              </div>
              <div className="flex justify-between text-gray-400 text-sm">
                <span>Shipping</span>
                <span className="text-emerald-400 font-bold">FREE</span>
              </div>
              <div className="h-px bg-white/10 my-4" />
              <div className="flex justify-between text-2xl font-black">
                <span>Total</span>
                <span>₹{state.totalAmount}</span>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                <CreditCard className="text-emerald-400" size={20} />
                <span className="text-sm font-bold">Cash on Delivery</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-gray-900 py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "Processing..." : "Pay & Place Order"}
              {!loading && <ArrowRight size={20} />}
            </button>

            <div className="mt-6 flex flex-col items-center gap-2 opacity-50">
              <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest">
                <Lock size={12} /> Secure Checkout
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest">
                <ShieldCheck size={12} /> Buyer Protection Active
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
