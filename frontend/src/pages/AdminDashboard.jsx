import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import {
  Users,
  UserCheck,
  UserX,
  Search,
  ChevronLeft,
  ChevronRight,
  Flower,
  Plus,
  Edit2,
  Trash2,
  BarChart3,
  TrendingUp,
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users"); // users, flowers
  const [users, setUsers] = useState([]);
  const [flowers, setFlowers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    adminUsers: 0,
    customerUsers: 0,
    totalFlowers: 0,
  });
  const [filter, setFilter] = useState("all"); // all, admin, customer
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
      const [usersRes, flowersRes] = await Promise.all([
        api.get("/admin/stats/users"),
        api.get("/flowers"),
      ]); // fetch user stats and total flowers in parallel
      console.log("flower :", flowersRes.data.data.flowers.length);
      setStats({
        ...usersRes.data.data,
        totalFlowers: flowersRes.data.data.flowers.length,
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

  useEffect(() => {
    if (activeTab === "flowers") {
      fetchFlowers();
    }
  }, [activeTab]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50/30">
      {/* Header */}
      <div className="bg-linear-to-r from-slate-900 via-blue-900 to-emerald-900 shadow-lg border-b border-emerald-700/20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-emerald-500/20 rounded-xl">
              <BarChart3 className="w-8 h-8 text-emerald-300" />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-emerald-100/80 mt-2 font-medium">
            System Management & Analytics
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users Card */}
          <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-slate-100 hover:border-blue-200/50 overflow-hidden relative">
            <div className="absolute inset-0 bg-linear-to-r from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex justify-between items-start">
              <div>
                <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">
                  Total Users
                </p>
                <p className="text-4xl font-black text-slate-900 mt-4">
                  {stats.totalUsers}
                </p>
                <p className="text-xs text-blue-600/70 mt-3 font-medium">
                  All registered members
                </p>
              </div>
              <div className="p-3 bg-blue-100/60 rounded-xl group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Admin Users Card */}
          <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-slate-100 hover:border-purple-200/50 overflow-hidden relative">
            <div className="absolute inset-0 bg-linear-to-r from-purple-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex justify-between items-start">
              <div>
                <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">
                  Admin Users
                </p>
                <p className="text-4xl font-black text-slate-900 mt-4">
                  {stats.adminUsers}
                </p>
                <p className="text-xs text-purple-600/70 mt-3 font-medium">
                  System administrators
                </p>
              </div>
              <div className="p-3 bg-purple-100/60 rounded-xl group-hover:scale-110 transition-transform">
                <UserCheck className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Customer Users Card */}
          <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-slate-100 hover:border-emerald-200/50 overflow-hidden relative">
            <div className="absolute inset-0 bg-linear-to-r from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex justify-between items-start">
              <div>
                <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">
                  Customers
                </p>
                <p className="text-4xl font-black text-slate-900 mt-4">
                  {stats.customerUsers}
                </p>
                <p className="text-xs text-emerald-600/70 mt-3 font-medium">
                  Active buyers
                </p>
              </div>
              <div className="p-3 bg-emerald-100/60 rounded-xl group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          {/* Total Flowers Card */}
          <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-slate-100 hover:border-pink-200/50 overflow-hidden relative">
            <div className="absolute inset-0 bg-linear-to-r from-pink-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex justify-between items-start">
              <div>
                <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">
                  Listed Flowers
                </p>
                <p className="text-4xl font-black text-slate-900 mt-4">
                  {stats?.totalFlowers}
                </p>
                <p className="text-xs text-pink-600/70 mt-3 font-medium">
                  In catalog
                </p>
              </div>
              <div className="p-3 bg-pink-100/60 rounded-xl group-hover:scale-110 transition-transform">
                <Flower className="w-6 h-6 text-pink-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 bg-white rounded-2xl shadow-md overflow-hidden border border-slate-100">
          <div className="flex border-b border-slate-200 bg-slate-50/50">
            <button
              onClick={() => {
                setActiveTab("users");
                setCurrentPage(1);
                setSearch("");
                fetchUsers(1, filter, "");
              }}
              className={`flex-1 px-6 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all relative group ${
                activeTab === "users"
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <Users size={18} />
              User Management
              {activeTab === "users" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-blue-500 to-blue-600" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("flowers")}
              className={`flex-1 px-6 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all relative group ${
                activeTab === "flowers"
                  ? "text-pink-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <Flower size={18} />
              Flower Management
              {activeTab === "flowers" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-pink-500 to-pink-600" />
              )}
            </button>
            <button
              onClick={() => navigate("/flowers/create-flower")}
              className="px-6 py-4 text-sm font-bold flex items-center gap-2 text-emerald-600 hover:bg-emerald-50 transition-all border-l border-slate-200 hover:text-emerald-700"
            >
              <Plus size={18} />
              Add New Flower
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "users" && (
            <div className="p-6 border-b border-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div className="relative col-span-1 md:col-span-2">
                  <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by username or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 hover:bg-white transition-colors"
                  />
                </div>

                {/* Filter by Role */}
                <select
                  value={filter}
                  onChange={(e) => {
                    setFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 hover:bg-white transition-colors font-medium text-gray-700"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin Only</option>
                  <option value="customer">Customers Only</option>
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-gray-600">
                        Username
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-gray-600">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-gray-600">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-gray-600">
                        Joined
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="text-center py-8">
                          <div className="inline-block">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          </div>
                        </td>
                      </tr>
                    ) : users.length === 0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="text-center py-8 text-gray-500"
                        >
                          No users found
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr
                          key={user._id}
                          className="border-b border-slate-100 hover:bg-slate-50 transition-colors duration-150"
                        >
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {user.userName}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className={`inline-flex px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                                user.role === "admin"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-emerald-100 text-emerald-700"
                              }`}
                            >
                              {user.role === "admin"
                                ? "👑 Admin"
                                : "🛍️ Customer"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {formatDate(user.createdAt)}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <select
                              value={user.role}
                              onChange={(e) =>
                                handleChangeRole(user._id, e.target.value)
                              }
                              disabled={changingRole === user._id}
                              className="px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 bg-white hover:bg-slate-50 transition-colors"
                            >
                              <option value="customer">Customer</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-5 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
              <div className="text-sm font-medium text-gray-700">
                Page{" "}
                <span className="font-bold text-slate-900">{currentPage}</span>{" "}
                of{" "}
                <span className="font-bold text-slate-900">{totalPages}</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (currentPage > 1) {
                      fetchUsers(currentPage - 1, filter, search);
                    }
                  }}
                  disabled={currentPage === 1}
                  className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-bold hover:bg-white hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 transition-all bg-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <button
                  onClick={() => {
                    if (currentPage < totalPages) {
                      fetchUsers(currentPage + 1, filter, search);
                    }
                  }}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-bold hover:bg-white hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 transition-all bg-white"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Flowers Management Tab */}
          {activeTab === "flowers" && (
            <div className="p-6">
              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table className="w-full">
                  <thead className="bg-linear-to-r from-slate-50 to-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-gray-600">
                        Flower Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-gray-600">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-gray-600">
                        Price
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-gray-600">
                        Stock
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-gray-600">
                        Created
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="text-center py-8">
                          <div className="inline-block">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
                          </div>
                        </td>
                      </tr>
                    ) : flowers.length === 0 ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="text-center py-8 text-gray-500"
                        >
                          No flowers listed yet
                        </td>
                      </tr>
                    ) : (
                      flowers.map((flower) => (
                        <tr
                          key={flower._id}
                          className="border-b border-slate-100 hover:bg-slate-50 transition-colors duration-150"
                        >
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {flower.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {flower.category}
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-emerald-600">
                            ₹{flower.price.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className={`inline-flex px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                                flower.stock > 0
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {flower.stock} items
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {formatDate(flower.createdAt)}
                          </td>
                          <td className="px-6 py-4 text-sm flex gap-3">
                            <button
                              onClick={() =>
                                navigate(`/flowers/edit/${flower._id}`)
                              }
                              className="p-2.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-all font-medium hover:scale-110"
                              title="Edit flower"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteFlower(flower._id)}
                              className="p-2.5 text-red-600 hover:bg-red-100 rounded-lg transition-all font-medium hover:scale-110"
                              title="Delete flower"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
