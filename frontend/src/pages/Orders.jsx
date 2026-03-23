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
        color: "amber",
        icon: <Clock size={16} />,
        label: "Order Received",
        bg: "bg-amber-50/50",
        text: "text-amber-700",
        border: "border-amber-100",
      },
      CONFIRMED: {
        color: "blue",
        icon: <Package size={16} />,
        label: "Preparing Blooms",
        bg: "bg-blue-50/50",
        text: "text-blue-700",
        border: "border-blue-100",
      },
      SHIPPED: {
        color: "purple",
        icon: <Truck size={16} />,
        label: "In Transit",
        bg: "bg-purple-50/50",
        text: "text-purple-700",
        border: "border-purple-100",
      },
      DELIVERED: {
        color: "emerald",
        icon: <CheckCircle2 size={16} />,
        label: "Hand Delivered",
        bg: "bg-emerald-50/50",
        text: "text-emerald-700",
        border: "border-emerald-100",
      },
      CANCELLED: {
        color: "red",
        icon: <XCircle size={16} />,
        label: "Voided",
        bg: "bg-red-50/50",
        text: "text-red-700",
        border: "border-red-100",
      },
    };
    return configs[status] || configs.PLACED;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-32">
      <div className="max-w-5xl mx-auto py-16 px-6">
        {/* Header Section */}
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-10">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-emerald-600 font-black text-[10px] mb-3 tracking-[0.3em] uppercase"
            >
              <ShoppingBag size={14} /> My Private Collection
            </motion.div>
            <h1 className="text-6xl font-serif font-black text-gray-900 tracking-tighter">
              Orders
            </h1>
          </div>
          <p className="text-gray-400 max-w-60 md:text-right text-xs leading-relaxed font-medium">
            Review your floral acquisitions and track the journey of your blooms
            from our garden to your doorstep.
          </p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 space-y-6">
            <div className="w-10 h-10 border-2 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 animate-pulse">
              Syncing Ledger...
            </p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-12"
          >
            <AnimatePresence mode="popLayout">
              {orders.length === 0 ? (
                <motion.div className="text-center py-32 bg-white rounded-[3.5rem] border border-gray-100 shadow-sm flex flex-col items-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-200">
                    <ShoppingBag size={32} />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-gray-800 tracking-tight">
                    Your vault is empty
                  </h3>
                  <button
                    onClick={() => (window.location.href = "/flowers")}
                    className="mt-6 px-8 py-3 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-emerald-600 transition-all"
                  >
                    Explore Blooms
                  </button>
                </motion.div>
              ) : (
                orders.map((order) => {
                  const config = getStatusConfig(order.status);
                  return (
                    <motion.div
                      variants={itemVariants}
                      key={order._id}
                      className="group bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-200/30 hover:shadow-emerald-900/5 transition-all duration-700 overflow-hidden"
                    >
                      {/* 4-Stage Progress Header */}
                      <div
                        className={`px-10 py-6 flex flex-col md:flex-row justify-between items-center gap-6 ${config.bg} border-b ${config.border}`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-2 rounded-2xl bg-white shadow-sm ${config.text}`}
                          >
                            {config.icon}
                          </div>
                          <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                              Current Stage
                            </p>
                            <h4
                              className={`text-sm font-black uppercase tracking-widest ${config.text}`}
                            >
                              {config.label}
                            </h4>
                          </div>
                        </div>

                        {/* Visual Tracker */}
                        <div className="flex items-center gap-2 min-w-70">
                          {["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"].map(
                            (step, idx, arr) => {
                              const isPast = arr.indexOf(order.status) >= idx;
                              const isCurrent = order.status === step;
                              return (
                                <React.Fragment key={step}>
                                  <div
                                    className={`flex flex-col items-center gap-1.5 ${isPast ? "opacity-100" : "opacity-20"}`}
                                  >
                                    <div
                                      className={`h-2 w-2 rounded-full transition-all duration-1000 ${isPast ? (isCurrent ? "bg-emerald-500 ring-4 ring-emerald-100" : "bg-gray-900") : "bg-gray-300"}`}
                                    />
                                  </div>
                                  {idx < arr.length - 1 && (
                                    <div
                                      className={`h-px w-12 rounded-full ${isPast ? "bg-gray-900" : "bg-gray-100"}`}
                                    />
                                  )}
                                </React.Fragment>
                              );
                            },
                          )}
                        </div>
                      </div>

                      <div className="p-10 flex flex-col lg:flex-row gap-12">
                        <div className="flex-1 space-y-8">
                          {order.items.map((item, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-6 group/item"
                            >
                              <div className="relative h-24 w-24 shrink-0">
                                <img
                                  src={item.flower?.image}
                                  alt=""
                                  className="w-full h-full rounded-4xl object-cover shadow-lg group-hover/item:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute -top-2 -right-2 bg-gray-900 text-white text-[10px] font-black w-7 h-7 rounded-full flex items-center justify-center border-4 border-white">
                                  {item.quantity}
                                </div>
                              </div>
                              <div>
                                <h4 className="text-xl font-serif font-black text-gray-900">
                                  {item.flower?.name}
                                </h4>
                                <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest italic">
                                  Premium Bloom{" "}
                                  <span className="mx-2 text-gray-200">|</span>{" "}
                                  ₹{item.priceAtPurchase}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="lg:w-1/3 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-gray-50 pt-10 lg:pt-0 lg:pl-12">
                          <div className="lg:text-right">
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">
                              Total Investment
                            </p>
                            <div className="text-5xl font-black text-gray-900 tracking-tighter">
                              <span className="text-xl align-top mr-1 text-emerald-500 italic">
                                ₹
                              </span>
                              {order.totalAmount.toLocaleString()}
                            </div>
                          </div>

                          <div className="flex flex-col gap-3 mt-10">
                            {order.status === "PLACED" ? (
                              <button
                                onClick={() => cancelOrder(order._id)}
                                className="w-full py-4 bg-white border border-red-100 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-xl shadow-red-100/20"
                              >
                                Revoke Order
                              </button>
                            ) : (
                              <div className="w-full py-4 bg-gray-50 text-gray-400 rounded-2xl text-[9px] font-black uppercase tracking-widest text-center border border-gray-100">
                                Order Processing • Fixed
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Footer Meta */}
                      <div className="px-10 py-5 bg-gray-50/50 border-t border-gray-50 flex justify-between items-center text-[9px] font-black text-gray-400 uppercase tracking-widest">
                        <div className="flex gap-8">
                          <span className="flex items-center gap-2">
                            <Calendar size={12} className="text-emerald-500" />{" "}
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-2">
                            <User size={12} className="text-emerald-500" />{" "}
                            Artisan Fulfilled
                          </span>
                        </div>
                        <span className="text-gray-300 font-mono">
                          ID_{order._id.slice(-8).toUpperCase()}
                        </span>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Orders;
