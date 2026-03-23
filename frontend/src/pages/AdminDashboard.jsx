import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import api from "../api/axios";
import DashboardHeader from "../components/AdminDashboard/DashboardHeader";
import StatsSection from "../components/AdminDashboard/StatsSection";
import TabNavigation from "../components/AdminDashboard/TabNavigation";
import UserManagement from "../components/AdminDashboard/UserManagement";
import FlowerManagement from "../components/AdminDashboard/FlowerManagement";
import PaginationControls from "../components/AdminDashboard/PaginationControls";
import OrderManagement from "../components/OrderManagement";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [flowers, setFlowers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    adminUsers: 0,
    customerUsers: 0,
    totalFlowers: 0,
    totalOrders: 0,
  });
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [changingRole, setChangingRole] = useState(null);

  const fetchUsers = async (page = 1, role = "all", searchTerm = "") => {
    setLoading(true);
    try {
      const params = new URLSearchParams(); //eg like ?page=1&limit=10&role=admin&search=john
      params.append("page", page);
      params.append("limit", 10);
      if (role !== "all") params.append("role", role);
      if (searchTerm) params.append("search", searchTerm);

      const res = await api.get(`/admin/users?${params.toString()}`); //params ,eg like ?page=1&limit=10&role=admin&search=john
      console.log("data :", res.data.data);
      const { users: fetchedUsers, pagination } = res.data.data; //

      setUsers(fetchedUsers);
      setCurrentPage(pagination.currentPage);
      setTotalPages(pagination.totalPages);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const [usersRes, flowersRes, ordersRes] = await Promise.all([
        api.get("/admin/stats/users"),
        api.get("/flowers"),
        api.get("/admin/orders"),
      ]); // fetch user stats and total flowers in parallel
      console.log("flower :", flowersRes.data.data.flowers.length);
      setStats({
        ...usersRes.data.data,
        totalFlowers: flowersRes.data.data.flowers.length,
        totalOrders: ordersRes.data.data.length,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchUsers(1, filter, search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search, filter]);

  const handleChangeRole = async (userId, newRole) => {
    setChangingRole(userId);
    try {
      await api.patch(`/admin/users/${userId}/role`, { role: newRole });
      toast.success(`User role updated to ${newRole}`);
      fetchUsers(currentPage, filter, search);
      fetchStats();
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to update user role";
      toast.error(errorMsg);
    } finally {
      setChangingRole(null);
    }
  };

  const fetchFlowers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/flowers");
      //   console.log("All fl :", res.data.data.flowers);
      setFlowers(res.data.data.flowers || []);
    } catch (error) {
      console.error("Error fetching flowers:", error);
      toast.error("Failed to fetch flowers");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFlower = async (flowerId) => {
    if (!window.confirm("Are you sure you want to delete this flower?")) return;
    try {
      await api.delete(`/flowers/delete-flower/${flowerId}`);
      toast.success("Flower deleted successfully");
      fetchFlowers();
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to delete flower";
      toast.error(errorMsg);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/orders");
      setOrders(res.data.data);
    } catch (error) {
      toast.error("Failed to load global orders");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/admin/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order marked as ${newStatus}`);
      fetchAllOrders(); // Refresh the list
    } catch (error) {
      toast.error("Status update failed");
    }
  };

  useEffect(() => {
    if (activeTab === "users") fetchUsers(currentPage, filter, search);
    if (activeTab === "flowers") fetchFlowers();
    if (activeTab === "orders") fetchAllOrders();
  }, [activeTab]);
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50/30">
      {/* Header */}
      <DashboardHeader />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Section */}
        <StatsSection stats={stats} />

        {/* Management Tabs */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-slate-100">
          {/* Tab Navigation */}
          <TabNavigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onAddFlower={() => setActiveTab("flowers")}
          />

          {/* User Management Tab */}
          {activeTab === "users" && (
            <>
              <UserManagement
                users={users}
                loading={loading}
                search={search}
                setSearch={setSearch}
                filter={filter}
                setFilter={setFilter}
                setCurrentPage={setCurrentPage}
                changingRole={changingRole}
                handleChangeRole={handleChangeRole}
                formatDate={formatDate}
              />
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPreviousClick={() => {
                  if (currentPage > 1) {
                    fetchUsers(currentPage - 1, filter, search);
                  }
                }}
                onNextClick={() => {
                  if (currentPage < totalPages) {
                    fetchUsers(currentPage + 1, filter, search);
                  }
                }}
              />
            </>
          )}

          {/* Flower Management Tab */}
          {activeTab === "flowers" && (
            <FlowerManagement
              flowers={flowers}
              loading={loading}
              formatDate={formatDate}
              handleDeleteFlower={handleDeleteFlower}
            />
          )}
          {activeTab === "orders" && (
            <OrderManagement
              orders={orders}
              loading={loading}
              onUpdateStatus={handleUpdateStatus}
              formatDate={formatDate}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
