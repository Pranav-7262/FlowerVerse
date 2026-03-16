import { createContext, useContext, useState } from "react";
import api from "../api/axios.js";
import toast from "react-hot-toast";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("buying"); // "buying" or "selling"
  const [stats, setStats] = useState({ revenue: 0, ordersCount: 0 });

  const fetchOrders = async (orderView = "buying") => {
    setLoading(true);
    try {
      const endpoint = orderView === "buying" ? "/orders/my" : "/orders/seller";
      const res = await api.get(endpoint);
      const fetchedOrders = res.data.data || [];
      setOrders(fetchedOrders);
      setView(orderView);

      if (orderView === "selling") {
        const totalRev = fetchedOrders
          .filter((o) => o.status === "PLACED")
          .reduce((acc, curr) => acc + curr.totalAmount, 0);
        setStats({ revenue: totalRev, ordersCount: fetchedOrders.length });
      } else {
        setStats({ revenue: 0, ordersCount: fetchedOrders.length });
      }

      return fetchedOrders;
    } catch (err) {
      console.error("Error fetching orders:", err);
      toast.error("Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getMyOrders = async () => {
    return await fetchOrders("buying");
  };

  const getSellerOrders = async () => {
    return await fetchOrders("selling");
  };

  const cancelOrder = async (orderId) => {
    try {
      const res = await api.patch(`/orders/cancel-order/${orderId}`);
      toast.success("Order cancelled and restocked");
      await fetchOrders(view);
      return res.data;
    } catch (err) {
      console.error("Error cancelling order:", err);
      toast.error(err.response?.data?.message || "Cancellation failed");
      throw err;
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const res = await api.patch(`/orders/update-status/${orderId}`, {
        status,
      });
      toast.success(`Order status updated to ${status}`);
      await fetchOrders(view);
      return res.data;
    } catch (err) {
      console.error("Error updating order status:", err);
      toast.error("Failed to update order status");
      throw err;
    }
  };

  const createOrder = async (orderData) => {
    try {
      const res = await api.post("/orders/checkout", orderData);
      toast.success("Order placed successfully!");

      try {
        await api.delete("/cart/clear-cart");
      } catch (clearErr) {
        console.warn("Cart clear failed after order", clearErr);
      }

      // refresh orders and notify cart context listeners
      await fetchOrders("buying");
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("cartUpdated"));
      }

      return res.data;
    } catch (err) {
      console.error("Error creating order:", err);
      toast.error(err.response?.data?.message || "Failed to place order");
      throw err;
    }
  };

  const getOrderStats = () => {
    return stats;
  };

  const getFilteredOrders = (status) => {
    return orders.filter((order) => order.status === status);
  };

  const getOrderById = (orderId) => {
    return orders.find((order) => order._id === orderId);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        view,
        stats,
        fetchOrders,
        getMyOrders,
        getSellerOrders,
        cancelOrder,
        updateOrderStatus,
        createOrder,
        getOrderStats,
        getFilteredOrders,
        getOrderById,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within OrderProvider");
  }
  return context;
};
