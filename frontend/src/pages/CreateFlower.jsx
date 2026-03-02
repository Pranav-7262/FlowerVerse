import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  PlusCircle,
  Image as ImageIcon,
  Tag,
  IndianRupee,
  Info,
  Box,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useFlower } from "../contexts/FlowerContext";

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

const CreateFlower = () => {
  const navigate = useNavigate();
  const { createFlower } = useFlower();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
    category: "Roses",
    stock: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createFlower(formData);
      navigate("/my-flowers");
    } catch (err) {
      // Error toast already shown by context
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <button
        onClick={() => navigate(-1)}
        className="group mb-8 flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-emerald-600 transition-colors"
      >
        <ArrowLeft size={18} /> Back to Dashboard
      </button>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-gray-900 flex items-center gap-3">
              <PlusCircle className="text-emerald-600" /> List a New Bloom
            </h1>
            <p className="text-gray-500 mt-2">
              Fill in the details to showcase your flower in the market.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Sparkles size={16} className="text-emerald-500" /> Flower
                  Name
                </label>
                <input
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Midnight Jasmine"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <IndianRupee size={16} className="text-emerald-500" /> Price
                  (₹)
                </label>
                <input
                  required
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Tag size={16} className="text-emerald-500" /> Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stock */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Box size={16} className="text-emerald-500" /> Stock Quantity
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <ImageIcon size={16} className="text-emerald-500" /> Image URL
              </label>
              <input
                required
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Info size={16} className="text-emerald-500" /> Description
              </label>
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell buyers about the fragrance, freshness, or origin..."
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>

            <button
              disabled={loading}
              className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-emerald-100 hover:bg-emerald-700 hover:-translate-y-1 transition-all disabled:opacity-50"
            >
              {loading ? "Publishing..." : "Publish Listing"}
            </button>
          </form>
        </motion.div>

        {/* Live Preview Section */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-80 flex flex-col gap-6"
        >
          <div className="sticky top-28">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 ml-2">
              Live Preview
            </p>
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 group">
              <div className="h-64 bg-gray-100 relative overflow-hidden">
                {formData.image ? (
                  <img
                    src={formData.image}
                    className="w-full h-full object-cover"
                    alt="preview"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                    <ImageIcon size={48} />
                    <span className="text-xs mt-2 italic">
                      Image will appear here
                    </span>
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-emerald-700">
                  ₹{formData.price || "0"}
                </div>
              </div>
              <div className="p-5 space-y-3">
                <h3 className="font-bold text-gray-800 truncate text-lg">
                  {formData.name || "Flower Name"}
                </h3>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-emerald-600 font-bold">
                    {formData.category}
                  </span>
                  <span className="text-gray-400">Stock: {formData.stock}</span>
                </div>
                <div className="flex gap-2 pt-2 opacity-50">
                  <div className="h-8 flex-1 bg-gray-100 rounded-lg" />
                  <div className="h-8 w-10 bg-gray-100 rounded-lg" />
                </div>
              </div>
            </div>

            {/* Tips Card */}
            <div className="mt-8 bg-emerald-900 rounded-3xl p-6 text-white">
              <h4 className="font-bold flex items-center gap-2 mb-2 text-emerald-300">
                <CheckCircle2 size={18} /> Pro Tip
              </h4>
              <p className="text-xs text-emerald-100 leading-relaxed opacity-80">
                High-quality images of fresh flowers increase sales by up to
                40%. Ensure your price is competitive for your region.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateFlower;
