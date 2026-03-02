import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  ShoppingBag,
  CheckCircle2,
  XCircle,
  Calendar,
  User,
  ArrowUpRight,
  TrendingUp,
  DollarSign,
  BarChart3,
} from "lucide-react";
import { useOrder } from "../contexts/OrderContext";

const Orders = () => {
  const { orders, loading, view, stats, fetchOrders, cancelOrder } = useOrder();

  useEffect(() => {
    fetchOrders(view);
  }, [view]);

  const handleCancel = async (orderId) => {
    try {
      await cancelOrder(orderId);
    } catch (err) {
      // Error toast already shown by context
    }
  };

  const handleViewChange = (newView) => {
    fetchOrders(newView);
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      {/* Header & Toggle */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-serif font-bold text-gray-900">
            Activity Hub
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your purchases and business sales.
          </p>
        </div>

        <div className="flex bg-white shadow-sm border border-gray-100 p-1 rounded-2xl">
          <button
            onClick={() => handleViewChange("buying")}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${view === "buying" ? "bg-emerald-600 text-white shadow-lg" : "text-gray-400 hover:text-emerald-600"}`}
          >
            My Purchases
          </button>
          <button
            onClick={() => handleViewChange("selling")}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${view === "selling" ? "bg-emerald-600 text-white shadow-lg" : "text-gray-400 hover:text-emerald-600"}`}
          >
            My Sales
          </button>
        </div>
      </div>

      {/* --- SELLER DASHBOARD SECTION --- */}
      <AnimatePresence>
        {view === "selling" && !loading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10"
          >
            <div className="bg-emerald-900 text-white p-6 rounded-[2.5rem] shadow-xl shadow-emerald-100 flex items-center gap-5">
              <div className="p-4 bg-emerald-500/20 rounded-2xl text-emerald-300">
                <DollarSign size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">
                  Total Revenue
                </p>
                <p className="text-3xl font-black">₹{stats.revenue}</p>
              </div>
            </div>

            <div className="bg-white border border-gray-100 p-6 rounded-[2.5rem] shadow-sm flex items-center gap-5">
              <div className="p-4 bg-blue-50 rounded-2xl text-blue-600">
                <BarChart3 size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Total Sales
                </p>
                <p className="text-3xl font-black text-gray-900">
                  {stats.ordersCount}
                </p>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-[2.5rem] hidden lg:flex items-center gap-5">
              <div className="p-4 bg-emerald-100 rounded-2xl text-emerald-600">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-800/60">
                  Success Rate
                </p>
                <p className="text-3xl font-black text-emerald-900">100%</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Orders List */}
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
                  className="group bg-white rounded-4xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
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
                        className={`text-[10px] font-black uppercase tracking-widest ${order.status === "PLACED" ? "text-emerald-700" : "text-red-700"}`}
                      >
                        Order {order.status}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-gray-400">
                      #{order._id.slice(-8)}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between gap-8">
                    <div className="space-y-4 flex-1">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <img
                            src={item.flower?.image}
                            alt=""
                            className="w-16 h-16 rounded-2xl object-cover shadow-sm"
                          />
                          <div>
                            <h4 className="font-bold text-gray-900">
                              {item.flower?.name}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {item.quantity} units x ₹{item.priceAtPurchase}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col md:items-end justify-between">
                      <div className="md:text-right">
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                          Grand Total
                        </p>
                        <p className="text-3xl font-black text-emerald-900">
                          ₹{order.totalAmount}
                        </p>
                      </div>

                      <div className="flex gap-3 mt-6">
                        {view === "buying" && order.status === "PLACED" && (
                          <button
                            onClick={() => handleCancel(order._id)}
                            className="px-6 py-2.5 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-600 hover:text-white transition-all shadow-sm shadow-red-100"
                          >
                            Cancel Order
                          </button>
                        )}
                        <div className="flex items-center gap-2 px-6 py-2.5 bg-gray-50 text-gray-500 rounded-xl text-xs font-bold border border-gray-100">
                          <Calendar size={14} />{" "}
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer - Buyer/Seller Info */}
                  <div className="px-8 py-4 bg-gray-50/50 border-t border-gray-50 flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <User size={10} />
                      </div>
                      {view === "buying"
                        ? `Seller: ${order.items[0]?.seller?.userName || "Floral Artisan"}`
                        : `Buyer: ${order.buyer?.userName}`}
                    </span>
                    <span className="hidden sm:flex items-center gap-1 opacity-60">
                      Verified Payment <ArrowUpRight size={12} />
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
