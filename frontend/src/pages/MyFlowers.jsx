import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  Flower as FlowerIcon,
  AlertCircle,
  MoreVertical,
  Layers,
} from "lucide-react";
import api from "../api/axios.js";
import { useFlower } from "../contexts/FlowerContext";

const MyFlowers = () => {
  const navigate = useNavigate();
  const { deleteFlower } = useFlower();
  const [flowers, setFlowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchMyFlowers = async () => {
      try {
        const res = await api.get("/flowers/my");
        // Accessing the structure from your controller: res.data.data.MyFlowers
        setFlowers(res.data.data.MyFlowers || []);
      } catch (err) {
        console.error("Failed to fetch inventory", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyFlowers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?"))
      return;
    try {
      await deleteFlower(id);
      setFlowers(flowers.filter((f) => f._id !== id));
    } catch (err) {
      // Error toast already shown by context
    }
  };

  const filteredFlowers = flowers.filter((f) =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">
            My Inventory
          </h1>
          <p className="text-gray-500">
            Manage your floral listings and stock levels.
          </p>
        </div>
        <Link
          to="/flowers/create-flower"
          className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all hover:-translate-y-1"
        >
          <Plus size={20} /> Add New Flower
        </Link>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Total Listings
          </p>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {flowers.length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Active Stock
          </p>
          <p className="text-3xl font-bold text-emerald-600 mt-1">
            {flowers.reduce((acc, curr) => acc + (curr.stock || 0), 0)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="relative">
            <input
              type="text"
              placeholder="Filter inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={16}
            />
          </div>
        </div>
      </div>

      {/* Inventory Table/Grid */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-20 text-center text-emerald-600 animate-pulse font-medium">
            Loading Inventory...
          </div>
        ) : filteredFlowers.length === 0 ? (
          <div className="p-20 text-center space-y-4">
            <div className="bg-emerald-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <FlowerIcon size={32} />
            </div>
            <p className="text-gray-500">No flowers found in your nursery.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <th className="px-8 py-5">Product</th>
                  <th className="px-6 py-5">Category</th>
                  <th className="px-6 py-5">Price</th>
                  <th className="px-6 py-5">Stock</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <AnimatePresence>
                  {filteredFlowers.map((flower) => (
                    <motion.tr
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={flower._id}
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={flower.image}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover shadow-sm"
                          />
                          <span className="font-bold text-gray-900">
                            {flower.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                          {flower.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-700">
                        ₹{flower.price}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${flower.stock > 0 ? "bg-emerald-500" : "bg-red-500"}`}
                          />
                          <span
                            className={`text-sm font-bold ${flower.stock <= 5 ? "text-orange-600" : "text-gray-600"}`}
                          >
                            {flower.stock}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => navigate(`/flowers/${flower._id}`)}
                            className="p-2 text-gray-400 hover:text-emerald-600 transition-colors"
                            title="View Public Page"
                          >
                            <ExternalLink size={18} />
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/flowers/edit/${flower._id}`)
                            }
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Edit Listing"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(flower._id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        {/* Mobile dots (visible when buttons hidden) */}
                        <div className="md:hidden opacity-100 group-hover:opacity-0">
                          <MoreVertical
                            size={18}
                            className="text-gray-300 ml-auto"
                          />
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyFlowers;
