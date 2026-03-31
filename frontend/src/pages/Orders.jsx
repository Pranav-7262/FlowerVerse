import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Calendar,
  User,
  ShoppingBag,
  Clock,
  Truck,
  Package,
  ChevronRight,
} from "lucide-react";
import { useOrder } from "../contexts/OrderContext";

const Orders = () => {
  const { orders, loading, fetchOrders, cancelOrder } = useOrder();

  useEffect(() => {
    fetchOrders("buying");
  }, []);

  const getStatusConfig = (status) => {
    const configs = {
      PLACED: {
        icon: <Clock size={16} />,
        label: "Placed",
        bg: "bg-amber-500/10",
        text: "text-amber-400",
        border: "border-amber-500/20",
      },
      CONFIRMED: {
        icon: <Package size={16} />,
        label: "Confirmed",
        bg: "bg-blue-500/10",
        text: "text-blue-400",
        border: "border-blue-500/20",
      },
      SHIPPED: {
        icon: <Truck size={16} />,
        label: "In Transit",
        bg: "bg-purple-500/10",
        text: "text-purple-400",
        border: "border-purple-500/20",
      },
      DELIVERED: {
        icon: <CheckCircle2 size={16} />,
        label: "Delivered",
        bg: "bg-emerald-500/10",
        text: "text-emerald-400",
        border: "border-emerald-500/20",
      },
      CANCELLED: {
        icon: <XCircle size={16} />,
        label: "Cancelled",
        bg: "bg-red-500/10",
        text: "text-red-400",
        border: "border-red-500/20",
      },
    };
    return configs[status] || configs.PLACED;
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-32 selection:bg-emerald-500/30">
      {/* Background Glow */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-5xl mx-auto py-20 px-6">
        {/* Header Section */}
        <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-800 pb-12">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-emerald-500 font-black text-[10px] mb-4 tracking-[0.4em] uppercase"
            >
              <ShoppingBag size={14} strokeWidth={3} /> My Collection
            </motion.div>
            <h1 className="text-7xl font-serif font-black text-white tracking-tighter">
              Orders
            </h1>
          </div>
          <p className="text-slate-400 max-w-xs md:text-right text-xs leading-loose font-medium opacity-80">
            Track your floral acquisitions from our garden to your doorstep.
          </p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 space-y-6">
            <div className="w-12 h-12 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500/50">
              Synchronizing Ledger
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            <AnimatePresence mode="popLayout">
              {orders.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-32 bg-slate-900/50 rounded-[3rem] border border-slate-800 backdrop-blur-xl flex flex-col items-center"
                >
                  <ShoppingBag size={40} className="text-slate-700 mb-6" />
                  <h3 className="text-xl font-serif text-slate-300">
                    Your vault is currently empty
                  </h3>
                  <button
                    onClick={() => (window.location.href = "/flowers")}
                    className="mt-8 px-10 py-4 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-500 transition-all"
                  >
                    Explore Blooms
                  </button>
                </motion.div>
              ) : (
                orders.map((order) => {
                  const config = getStatusConfig(order.status);
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={order._id}
                      className="group bg-slate-900/40 rounded-[2.5rem] border border-slate-800/60 backdrop-blur-md hover:border-emerald-500/30 transition-all duration-500 overflow-hidden"
                    >
                      {/* Status Header */}
                      <div
                        className={`px-8 py-5 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/50 ${config.bg}`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-2.5 rounded-xl bg-slate-950/50 ${config.text} border ${config.border}`}
                          >
                            {config.icon}
                          </div>
                          <div>
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">
                              Status
                            </span>
                            <span
                              className={`text-xs font-black uppercase tracking-widest ${config.text}`}
                            >
                              {config.label}
                            </span>
                          </div>
                        </div>

                        {/* Tracker Dots */}
                        <div className="hidden sm:flex items-center gap-3">
                          {["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"].map(
                            (s, i) => (
                              <div
                                key={s}
                                className={`h-1.5 w-1.5 rounded-full ${i <= ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"].indexOf(order.status) ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" : "bg-slate-700"}`}
                              />
                            ),
                          )}
                        </div>
                      </div>

                      {/* Items List */}
                      <div className="p-8 lg:p-10 flex flex-col lg:flex-row gap-12">
                        <div className="flex-1 space-y-6">
                          {order.items.map((item, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-6 group/item"
                            >
                              <div className="relative h-20 w-20 shrink-0">
                                <img
                                  src={item.flower?.image}
                                  className="w-full h-full rounded-3xl object-cover ring-1 ring-slate-700"
                                  alt=""
                                />
                                <div className="absolute -top-2 -right-2 bg-emerald-600 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-slate-900">
                                  {item.quantity}
                                </div>
                              </div>
                              <div>
                                <h4 className="text-2xl font-serif font-bold text-slate-100">
                                  {item.flower?.name}
                                </h4>
                                <p className="text-[14px] font-bold text-emerald-500/60 uppercase tracking-widest">
                                  Premium Bloom • ₹
                                  {item.priceAtPurchase.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Pricing & Actions */}
                        <div className="lg:w-1/4 flex flex-col justify-center items-end border-t lg:border-t-0 lg:border-l border-slate-800 pt-8 lg:pt-0 lg:pl-10">
                          <span className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1">
                            Grand Total
                          </span>
                          <div className="text-4xl font-black text-white tracking-tighter">
                            <span className="text-emerald-500 text-lg mr-1 font-serif italic">
                              ₹
                            </span>
                            {order.totalAmount.toLocaleString()}
                          </div>

                          {order.status === "PLACED" && (
                            <button
                              onClick={() => cancelOrder(order._id)}
                              className="mt-6 w-full py-3 px-6 rounded-xl border border-red-500/30 text-red-400 text-[9px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                            >
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Footer Meta */}
                      <div className="px-8 py-4 bg-slate-950/40 border-t border-slate-800/50 flex justify-between items-center">
                        <div className="flex gap-6 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                          <span className="flex items-center gap-1.5">
                            <Calendar size={12} />{" "}
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <User size={12} /> Fulfilled
                          </span>
                        </div>
                        <span className="text-[9px] font-mono text-slate-700 uppercase">
                          REF_{order._id.slice(-6)}
                        </span>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
