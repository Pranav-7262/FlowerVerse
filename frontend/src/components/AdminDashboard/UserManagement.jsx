import React from "react";
import { Search } from "lucide-react";

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
    <div className="p-6 border-b border-slate-200">
      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Search Bar */}
        <div className="relative col-span-1 md:col-span-2">
          <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by username or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 hover:bg-white transition-colors shadow-sm"
          />
        </div>

        {/* Role Filter */}
        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 hover:bg-white transition-colors font-medium text-gray-700 shadow-sm"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin Only</option>
          <option value="customer">Customers Only</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full">
          <thead className="bg-linear-to-r from-slate-50 to-slate-100 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-gray-700">
                Username
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-gray-700">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-gray-700">
                Role
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-gray-700">
                Joined
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-gray-700">
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
                  className="text-center py-8 text-gray-500 font-medium"
                >
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-slate-100 hover:bg-linear-to-r hover:from-blue-50/50 to-transparent transition-colors duration-150"
                >
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {user.userName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-flex px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {user.role === "admin" ? "👑 Admin" : "🛍️ Customer"}
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
                      className="px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 bg-white hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
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
  );
};

export default UserManagement;
