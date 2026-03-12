import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Calendar,
  User,
  ArrowUpRight,
  ShoppingBag,
  Clock,
} from "lucide-react";
import { useOrder } from "../contexts/OrderContext";

const Orders = () => {
  const { orders, loading, fetchOrders, cancelOrder } = useOrder();

  useEffect(() => {
    fetchOrders("buying");
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-20">
      <div className="max-w-5xl mx-auto py-12 px-6">
        {/* Header Section */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-emerald-600 font-bold text-sm mb-2 tracking-widest uppercase"
            >
              <ShoppingBag size={16} /> Purchase History
            </motion.div>
            <h1 className="text-5xl font-serif font-black text-gray-900 tracking-tight">
              My Orders
            </h1>
          </div>
          <p className="text-gray-500 max-w-xs md:text-right text-sm leading-relaxed">
            Manage your recent floral acquisitions and track delivery status in
            real-time.
          </p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
            <p className="text-gray-400 font-medium animate-pulse">
              Syncing your vault...
            </p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid gap-8"
          >
            <AnimatePresence mode="popLayout">
              {orders.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 flex flex-col items-center"
                >
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                    <ShoppingBag size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    No orders found
                  </h3>
                  <p className="text-gray-400 mt-2 max-w-xs">
                    Looks like your garden is empty. Time to pick some fresh
                    blooms!
                  </p>
                </motion.div>
              ) : (
                orders.map((order) => (
                  <motion.div
                    variants={itemVariants}
                    key={order._id}
                    className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 hover:shadow-2xl hover:shadow-emerald-900/5 hover:border-emerald-100 transition-all duration-500 overflow-hidden"
                  >
                    {/* Status Ribbon */}
                    <div
                      className={`px-10 py-4 flex justify-between items-center transition-colors ${
                        order.status === "PLACED"
                          ? "bg-emerald-50/50"
                          : "bg-red-50/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-1.5 rounded-full ${
                            order.status === "PLACED"
                              ? "bg-emerald-100 text-emerald-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {order.status === "PLACED" ? (
                            <CheckCircle2 size={14} />
                          ) : (
                            <XCircle size={14} />
                          )}
                        </div>
                        <span
                          className={`text-[11px] font-black uppercase tracking-[0.2em] ${
                            order.status === "PLACED"
                              ? "text-emerald-700"
                              : "text-red-700"
                          }`}
                        >
                          Status: {order.status}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-50">
                        ID_{order._id.slice(-8).toUpperCase()}
                      </span>
                    </div>

                    <div className="p-8 md:p-10 flex flex-col md:flex-row gap-10">
                      {/* Product Details */}
                      <div className="flex-1 space-y-6">
                        {order.items.map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-6 group/item"
                          >
                            <div className="relative h-20 w-20 flex-shrink-0">
                              <img
                                src={item.flower?.image}
                                alt=""
                                className="w-full h-full rounded-[1.5rem] object-cover shadow-md group-hover/item:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute -top-2 -right-2 bg-emerald-600 text-white text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
                                {item.quantity}
                              </div>
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-gray-900 group-hover/item:text-emerald-700 transition-colors">
                                {item.flower?.name}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm font-semibold text-gray-400">
                                  Unit Price:
                                </span>
                                <span className="text-sm font-bold text-gray-700">
                                  ₹{item.priceAtPurchase}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Financials & Actions */}
                      <div className="flex flex-col md:items-end justify-between border-t md:border-t-0 md:border-l border-gray-100 pt-8 md:pt-0 md:pl-10">
                        <div className="md:text-right">
                          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-1">
                            Settlement Amount
                          </p>
                          <div className="text-4xl font-black text-gray-900 flex items-start md:justify-end">
                            <span className="text-lg mt-1 mr-1 text-emerald-600">
                              ₹
                            </span>
                            {order.totalAmount}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3 mt-8">
                          <div className="flex items-center gap-2 px-5 py-3 bg-gray-50 text-gray-600 rounded-2xl text-[12px] font-bold border border-gray-100">
                            <Calendar size={14} className="text-emerald-500" />
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </div>

                          {order.status === "PLACED" && (
                            <button
                              onClick={() => cancelOrder(order._id)}
                              className="px-6 py-3 bg-white text-red-500 border border-red-100 rounded-2xl text-[12px] font-bold hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300 shadow-sm shadow-red-50"
                            >
                              Revoke Order
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Meta Footer */}
                    <div className="px-10 py-5 bg-gray-50/30 border-t border-gray-50 flex flex-wrap justify-between items-center gap-4">
                      <div className="flex items-center gap-6">
                        <span className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                          <User size={12} className="text-emerald-500" />{" "}
                          Merchant: FlowerMart Admin
                        </span>
                        <span className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                          <Clock size={12} className="text-emerald-500" />{" "}
                          Instant Delivery
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 uppercase tracking-tighter cursor-help hover:opacity-80 transition-opacity">
                        Transaction Verified <ArrowUpRight size={12} />
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Orders;
