import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  ShoppingBag,
  CheckCircle2,
  XCircle,
  Calendar,
  User,
  ExternalLink,
  ArrowUpRight,
} from "lucide-react";
import api from "../api/axios.js";
import toast from "react-hot-toast";

const Orders = () => {
  const [view, setView] = useState("buying"); // 'buying' or 'selling'
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const endpoint = view === "buying" ? "/orders/my" : "/orders/seller";
      const res = await api.get(endpoint);
      setOrders(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [view]);

  const handleCancel = async (orderId) => {
    try {
      await api.patch(`/orders/cancel-order/${orderId}`);
      toast.success("Order cancelled and restocked");
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Cancellation failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10">
      {/* Header & Toggle */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-serif font-bold text-gray-900">
            Activity Hub
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your flower purchases and business sales.
          </p>
        </div>

        <div className="flex bg-white shadow-sm border border-gray-100 p-1 rounded-2xl">
          <button
            onClick={() => setView("buying")}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${view === "buying" ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100" : "text-gray-400 hover:text-emerald-600"}`}
          >
            My Purchases
          </button>
          <button
            onClick={() => setView("selling")}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${view === "selling" ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100" : "text-gray-400 hover:text-emerald-600"}`}
          >
            My Sales
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid gap-6">
          <AnimatePresence mode="wait">
            {orders.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-white rounded-4xl border-2 border-dashed border-gray-100"
              >
                <p className="text-gray-400 font-medium">
                  No records found yet 🌸
                </p>
              </motion.div>
            ) : (
              orders.map((order) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={order._id}
                  className="bg-white rounded-4xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  {/* Status Bar */}
                  <div
                    className={`px-8 py-3 flex justify-between items-center ${order.status === "PLACED" ? "bg-emerald-50" : "bg-red-50"}`}
                  >
                    <div className="flex items-center gap-2">
                      {order.status === "PLACED" ? (
                        <CheckCircle2 size={16} className="text-emerald-600" />
                      ) : (
                        <XCircle size={16} className="text-red-600" />
                      )}
                      <span
                        className={`text-xs font-black uppercase tracking-widest ${order.status === "PLACED" ? "text-emerald-700" : "text-red-700"}`}
                      >
                        Order {order.status}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-gray-400 uppercase">
                      ID: {order._id.slice(-8)}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-8 flex flex-col md:flex-row justify-between gap-8">
                    <div className="space-y-4 flex-1">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <img
                            src={item.flower?.image}
                            alt=""
                            className="w-14 h-14 rounded-xl object-cover"
                          />
                          <div>
                            <h4 className="font-bold text-gray-900">
                              {item.flower?.name}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {item.quantity} units @ ₹{item.priceAtPurchase}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col md:items-end justify-between border-t md:border-t-0 pt-6 md:pt-0">
                      <div className="text-right">
                        <p className="text-xs text-gray-400 font-bold uppercase">
                          Grand Total
                        </p>
                        <p className="text-2xl font-black text-emerald-900">
                          ₹{order.totalAmount}
                        </p>
                      </div>

                      <div className="flex gap-3 mt-4">
                        {view === "buying" && order.status === "PLACED" && (
                          <button
                            onClick={() => handleCancel(order._id)}
                            className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-600 hover:text-white transition-all"
                          >
                            Cancel Order
                          </button>
                        )}
                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-xl text-xs font-bold">
                          <Calendar size={14} />{" "}
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Info */}
                  <div className="px-8 py-3 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center text-[11px] font-bold text-gray-400 uppercase">
                    <span className="flex items-center gap-1">
                      <User size={12} />{" "}
                      {view === "buying"
                        ? `Seller: ${order.items[0]?.seller?.userName}`
                        : `Buyer: ${order.buyer?.userName}`}
                    </span>
                    <span className="flex items-center gap-1">
                      Secure Transaction <ArrowUpRight size={12} />
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Orders;
