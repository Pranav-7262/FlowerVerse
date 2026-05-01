import React from "react";
import { Package, Truck, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
const OrderManagement = ({ orders, loading, onUpdateStatus, formatDate }) => {
  if (loading)
    return (
      <div className="p-20 text-center animate-pulse">Loading Logistics...</div>
    );

  const getStatusStyle = (status) => {
    switch (status) {
      case "PLACED":
        return "bg-amber-600/20 text-amber-400 border-amber-600/40";
      case "CONFIRMED":
        return "bg-blue-100/50 text-blue-700 border-blue-200/50";
      case "SHIPPED":
        return "bg-purple-100/50 text-purple-700 border-purple-200/50";
      case "DELIVERED":
        return "bg-rose-100/50 text-rose-700 border-rose-200/50";
      case "CANCELLED":
        return "bg-red-100/50 text-red-700 border-red-200/50";
      default:
        return "bg-white/50 text-slate-600";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5, ease: [0, 0.71, 0.2, 1.01] }}
      className="overflow-x-auto"
    >
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-white/50 border-b border-rose-200/20">
            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-600">
              Order & Date
            </th>
            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-600">
              Customer
            </th>
            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-600">
              Amount
            </th>
            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-600">
              Stage Control
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-rose-200/20">
          {orders.map((order) => (
            <tr key={order._id} className="hover:bg-white/50 transition-colors">
              <td className="p-6">
                <div className="font-bold text-slate-900">
                  #{order._id.slice(-6)}
                </div>
                <div className="text-xs text-slate-600">
                  {formatDate(order.createdAt)}
                </div>
              </td>
              <td className="p-6 text-sm font-medium text-slate-700">
                {order.buyer?.userName || "Unknown User"}
              </td>
              <td className="p-6 font-bold text-slate-900">
                ₹{order.totalAmount}
              </td>
              <td className="p-6">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black border ${getStatusStyle(order.status)}`}
                  >
                    {order.status}
                  </span>

                  <select
                    onChange={(e) => onUpdateStatus(order._id, e.target.value)}
                    className="text-xs bg-white/50 border border-rose-200/50 rounded-lg p-1 focus:ring-2 focus:ring-rose-600 outline-none text-slate-900"
                    value={order.status}
                  >
                    <option value="PLACED">Placed</option>
                    <option value="CONFIRMED">Confirm</option>
                    <option value="SHIPPED">Ship</option>
                    <option value="DELIVERED">Deliver</option>
                    <option value="CANCELLED">Cancel</option>
                  </select>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default OrderManagement;
