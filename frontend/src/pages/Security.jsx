import React, { useState } from "react";
import { ChevronRight, ShieldCheck, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

const Security = () => {
  const { user, updateUsername, updateEmail, updatePassword } = useAuth();
  const [editMode, setEditMode] = useState(null); // 'name', 'email', 'password'

  const [formData, setFormData] = useState({
    userName: user?.userName || "",
    email: user?.email || "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode === "name") {
        await updateUsername(formData.userName);
        toast.success("Name updated!");
      } else if (editMode === "email") {
        await updateEmail(formData.email);
        toast.success("Email updated!");
      } else if (editMode === "password") {
        if (formData.newPassword !== formData.confirmPassword) {
          return toast.error("New passwords do not match!");
        }
        await updatePassword(
          formData.oldPassword,
          formData.newPassword,
          formData.confirmPassword,
        );
        toast.success("Password changed successfully!");
      }
      setEditMode(null); // Return to list view
    } catch (err) {
      console.error("FULL ERROR OBJECT:", err.response);
      const serverMessage =
        err.response?.data?.message || err.response?.data?.error;
      toast.error(serverMessage || "Something went wrong");
    }
  };

  if (editMode) {
    return (
      <div className="max-w-md mx-auto py-12 px-4">
        <h1 className="text-2xl font-bold mb-6">
          Change {editMode === "name" ? "your name" : editMode}
        </h1>
        <form
          onSubmit={handleSubmit}
          className="border border-gray-200 p-6 rounded-xl bg-white shadow-sm space-y-4"
        >
          {editMode === "name" && (
            <div>
              <label className="block text-sm font-bold mb-1">New Name</label>
              <input
                type="text"
                required
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
                value={formData.userName}
                onChange={(e) =>
                  setFormData({ ...formData, userName: e.target.value })
                }
              />
            </div>
          )}

          {editMode === "email" && (
            <div>
              <label className="block text-sm font-bold mb-1">New Email</label>
              <input
                type="email"
                required
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
          )}

          {editMode === "password" && (
            <>
              <div>
                <label className="block text-sm font-bold mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  className="w-full p-2 border border-gray-300 rounded outline-none"
                  value={formData.oldPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, oldPassword: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  className="w-full p-2 border border-gray-300 rounded outline-none"
                  value={formData.newPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, newPassword: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  className="w-full p-2 border border-gray-300 rounded outline-none"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              </div>
            </>
          )}

          <div className="pt-4 space-y-3">
            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors shadow-md"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setEditMode(null)}
              className="w-full py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <nav className="flex items-center gap-2 text-xs mb-6 text-gray-400 uppercase tracking-widest font-bold">
        <Link to="/account" className="hover:text-emerald-600">
          Account
        </Link>
        <ChevronRight size={12} />
        <span className="text-gray-900">Login & Security</span>
      </nav>

      <h1 className="text-3xl font-serif font-black text-gray-900 mb-8">
        Login & Security
      </h1>

      <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden shadow-sm divide-y divide-gray-100">
        <SecurityRow
          label="Name"
          value={user?.userName}
          onEdit={() => setEditMode("name")}
        />
        <SecurityRow
          label="Email"
          value={user?.email}
          onEdit={() => setEditMode("email")}
        />
        <SecurityRow
          label="Password"
          value="********"
          onEdit={() => setEditMode("password")}
        />
      </div>

      <div className="mt-8 flex items-start gap-4 p-6 bg-amber-50 rounded-2xl border border-amber-100">
        <ShieldCheck className="text-amber-600 shrink-0" size={24} />
        <p className="text-xs text-amber-800 leading-relaxed">
          <strong>Security Note:</strong> If you change your email, you may need
          to re-verify your identity. FlowerMart employees will never ask for
          your password over email or phone.
        </p>
      </div>
    </div>
  );
};

// Simple reusable row component
const SecurityRow = ({ label, value, onEdit }) => (
  <div className="flex items-center justify-between p-6 hover:bg-gray-50/50 transition-colors">
    <div>
      <p className="text-sm font-black text-gray-900">{label}:</p>
      <p className="text-sm text-gray-500 mt-1">{value}</p>
    </div>
    <button
      onClick={onEdit}
      className="px-6 py-1.5 border border-gray-300 rounded-xl text-sm font-bold text-gray-700 hover:border-emerald-600 hover:text-emerald-600 transition-all bg-white"
    >
      Edit
    </button>
  </div>
);

export default Security;
