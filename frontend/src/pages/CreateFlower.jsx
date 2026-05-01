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
  "All",
  "Roses",
  "Tulips",
  "Daisies",
  "Lilies",
  "Orchids",
  "Sunflowers",
  "Lotus",
  "Hibiscus",
  "Jasmines",
  "Marigolds",
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
    description: "",
    category: "Roses",
    stock: 1,
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the first selected file
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Creates temporary local URL for preview
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) return toast.error("Please upload an image");
    setLoading(true);
    try {
      const data = new FormData(); // for multipart/form-data requests means we can send files
      data.append("name", formData.name);
      data.append("price", formData.price);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("stock", formData.stock);
      data.append("image", imageFile);

      await createFlower(data);

      navigate("/admin/dashboard");
    } catch (err) {
      // Error toast already shown by context
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <button
          onClick={() => navigate(-1)}
          className="group mb-8 flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-rose-600 transition-colors"
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 bg-white/70 rounded-[2.5rem] p-8 shadow-xl shadow-rose-200/30 border border-rose-200/50 min-h-screen backdrop-blur-sm"
          >
            <div className="mb-8">
              <h1 className="text-3xl font-serif font-bold text-slate-900 flex items-center gap-3">
                <PlusCircle className="text-rose-600" /> List a New Bloom
              </h1>
              <p className="text-slate-600 mt-2">
                Fill in the details to showcase your flower in the market.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Sparkles size={16} className="text-rose-600" /> Flower Name
                  </label>
                  <input
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Midnight Jasmine"
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-rose-200/50 focus:ring-2 focus:ring-rose-600/50 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                  />
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <IndianRupee size={16} className="text-rose-600" /> Price
                    (₹)
                  </label>
                  <input
                    required
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-rose-200/50 focus:ring-2 focus:ring-rose-600/50 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Tag size={16} className="text-rose-600" /> Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-rose-200/50 focus:ring-2 focus:ring-rose-600/50 outline-none transition-all text-slate-900"
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
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Box size={16} className="text-rose-600" /> Stock Quantity
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-rose-200/50 focus:ring-2 focus:ring-rose-600/50 outline-none transition-all text-slate-900"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <ImageIcon size={16} className="text-rose-600" /> Upload
                  Flower Photo
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    required
                    name="image"
                    onChange={handleFileChange}
                    className="hidden"
                    id="flower-image"
                  />
                  <label
                    htmlFor="flower-image"
                    className="flex items-center justify-center w-full px-4 py-3 rounded-xl bg-white/50 border-2 border-dashed border-rose-200/50 hover:border-rose-400 cursor-pointer transition-all text-slate-700"
                  >
                    {imageFile ? imageFile.name : "Click to select a photo"}
                  </label>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Info size={16} className="text-rose-600" /> Description
                </label>
                <textarea
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell buyers about the fragrance, freshness, or origin..."
                  className="w-full px-4 py-3 rounded-xl bg-white/50 border border-rose-200/50 focus:ring-2 focus:ring-rose-600/50 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                />
              </div>

              <button
                disabled={loading}
                className="w-full py-4 bg-rose-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-rose-200/30 hover:bg-rose-700 hover:-translate-y-1 transition-all disabled:opacity-50"
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
            {previewUrl ? (
              <img
                src={previewUrl}
                className="w-full h-full object-cover"
                alt="preview"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                <ImageIcon size={48} />
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CreateFlower;
