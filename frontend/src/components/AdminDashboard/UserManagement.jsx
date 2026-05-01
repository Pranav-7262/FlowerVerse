import React from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

const UserManagement = ({
  users,
  loading,
  search,
  setSearch,
  filter,
  setFilter,
  setCurrentPage,
  changingRole,
  handleChangeRole,
  formatDate,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5, ease: [0, 0.71, 0.2, 1.01] }}
      className="p-6 border-b border-rose-200/50"
    >
      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Search Bar */}
        <div className="relative col-span-1 md:col-span-2">
          <Search className="absolute left-4 top-3 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by username or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 border border-rose-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-600 focus:border-transparent bg-white/50 hover:bg-white/70 transition-colors shadow-sm text-slate-900 placeholder-slate-400"
          />
        </div>

        {/* Role Filter */}
        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2.5 border border-rose-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-600 focus:border-transparent bg-white/50 hover:bg-white/70 transition-colors font-medium text-slate-900 shadow-sm"
        >
          <option value="all" className="bg-amber-50 text-slate-900">
            All Roles
          </option>
          <option value="admin" className="bg-amber-50 text-slate-900">
            Admin Only
          </option>
          <option value="customer" className="bg-amber-50 text-slate-900">
            Customers Only
          </option>
        </select>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto rounded-xl border border-rose-200/50 bg-white/70 shadow-lg">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-white/50 to-white/30 border-b border-rose-200/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-slate-900">
                Username
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-slate-900">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-slate-900">
                Role
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-slate-900">
                Joined
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-slate-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-8">
                  <div className="inline-block">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                  </div>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-8 text-slate-600 font-medium"
                >
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-rose-200/50 hover:bg-white/50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                    {user.userName}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-flex px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                        user.role === "admin"
                          ? "bg-purple-100/50 text-purple-700"
                          : "bg-rose-100/50 text-rose-700"
                      }`}
                    >
                      {user.role === "admin" ? "👑 Admin" : "🛍️ Customer"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleChangeRole(user._id, e.target.value)
                      }
                      disabled={changingRole === user._id}
                      className="px-3 py-2 border border-rose-200/50 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-600 disabled:opacity-50 bg-white/50 hover:bg-white/70 transition-colors shadow-sm cursor-pointer text-slate-900"
                    >
                      <option
                        value="customer"
                        className="bg-amber-50 text-slate-900"
                      >
                        Customer
                      </option>
                      <option
                        value="admin"
                        className="bg-amber-50 text-slate-900"
                      >
                        Admin
                      </option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default UserManagement;
