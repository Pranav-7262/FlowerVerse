import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Loader2,
  Flower2,
  IndianRupee,
  Layers,
  Tag,
} from "lucide-react";
import api from "../api/axios.js";
import toast from "react-hot-toast";

const CATEGORIES = [
  "Roses",
  "Tulips",
  "Daisies",
  "Lilies",
  "Orchids",
  "Sunflowers",
  "Carnations",
  "Mixed Bouquets",
];

const EditFlower = () => {
  const { flowerId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    description: "",
    image: "",
  });

  // 1. Fetch current flower details to pre-fill the form
  useEffect(() => {
    const fetchFlower = async () => {
      try {
        const res = await api.get(`/flowers/${flowerId}`);
        const data = res.data.data;
        setFormData({
          name: data.name,
          price: data.price,
          stock: data.stock,
          category: data.category,
          description: data.description,
          image: data.image,
        });
      } catch (err) {
        toast.error("Could not load flower details");
        navigate("/orders");
      } finally {
        setLoading(false);
      }
    };
    fetchFlower();
  }, [flowerId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      // Using your PATCH route
      await api.patch(`/flowers/update-flower/${flowerId}`, formData);
      toast.success("Bloom updated successfully! 🌸");
      navigate(`/flowers/${flowerId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-emerald-700 font-bold mb-8 transition-colors"
      >
        <ArrowLeft size={18} /> Back to Details
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden"
      >
        <div className="bg-emerald-900 p-8 text-white">
          <h1 className="text-3xl font-serif font-bold">Edit Your Bloom</h1>
          <p className="text-emerald-200 text-sm mt-2">
            Adjust pricing, stock, or description for your listing.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">
                Flower Name
              </label>
              <div className="relative">
                <Flower2
                  className="absolute left-4 top-3.5 text-gray-300"
                  size={18}
                />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">
                Category
              </label>
              <div className="relative">
                <Tag
                  className="absolute left-4 top-3.5 text-gray-300"
                  size={18}
                />
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 appearance-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">
                Price (₹)
              </label>
              <div className="relative">
                <IndianRupee
                  className="absolute left-4 top-3.5 text-gray-300"
                  size={18}
                />
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Stock */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">
                Available Stock
              </label>
              <div className="relative">
                <Layers
                  className="absolute left-4 top-3.5 text-gray-300"
                  size={18}
                />
                <input
                  type="number"
                  required
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">
              Description
            </label>
            <textarea
              rows="4"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={updating}
            className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50"
          >
            {updating ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Save size={20} />
            )}
            {updating ? "Saving Changes..." : "Update Flower Listing"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default EditFlower;
