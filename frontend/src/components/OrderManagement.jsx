import React from "react";
import { Package, Truck, CheckCircle, Clock, AlertCircle } from "lucide-react";

const OrderManagement = ({ orders, loading, onUpdateStatus, formatDate }) => {
  if (loading)
    return (
      <div className="p-20 text-center animate-pulse">Loading Logistics...</div>
    );

  const getStatusStyle = (status) => {
    switch (status) {
      case "PLACED":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "CONFIRMED":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "SHIPPED":
        return "bg-purple-50 text-purple-700 border-purple-100";
      case "DELIVERED":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "CANCELLED":
        return "bg-red-50 text-red-700 border-red-100";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/50 border-b border-gray-100">
            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
              Order & Date
            </th>
            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
              Customer
            </th>
            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
              Amount
            </th>
            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
              Stage Control
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {orders.map((order) => (
            <tr
              key={order._id}
              className="hover:bg-slate-50/50 transition-colors"
            >
              <td className="p-6">
                <div className="font-bold text-gray-900">
                  #{order._id.slice(-6)}
                </div>
                <div className="text-xs text-gray-400">
                  {formatDate(order.createdAt)}
                </div>
              </td>
              <td className="p-6 text-sm font-medium text-gray-600">
                {order.buyer?.userName || "Unknown User"}
              </td>
              <td className="p-6 font-bold text-gray-900">
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
                    className="text-xs bg-white border border-gray-200 rounded-lg p-1 focus:ring-2 focus:ring-emerald-500 outline-none"
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
    </div>
  );
};

export default OrderManagement;
