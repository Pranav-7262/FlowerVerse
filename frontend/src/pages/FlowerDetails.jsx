import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  ShoppingBag,
  Pencil,
  Trash2,
  ArrowLeft,
  User,
  Tag,
  ShieldCheck,
  Layers, // Icon for Stock
  AlertCircle,
} from "lucide-react";
import api from "../api/axios.js";
import { useAuth } from "../contexts/AuthContext";

const FlowerDetails = () => {
  const { flowerId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [flower, setFlower] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlower = async () => {
      try {
        const res = await api.get(`/flowers/${flowerId}`);
        setFlower(res.data.data);
      } catch (err) {
        console.error("Error fetching flower:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFlower();
  }, [flowerId]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to remove this flower?")) return;
    try {
      await api.delete(`/flowers/delete-flower/${flowerId}`);
      toast.success("Flower Deleted !");
      navigate("/");
    } catch (err) {
      toast.error("Delete failed.");
    }
  };
  const handleAddToCart = async (flowerId) => {
    if (!user) return navigate("/login");
    try {
      await api.post("/cart/add", { flowerId, quantity: 1 });
      toast.success("Added to cart 🌸");
    } catch (err) {
      toast.error("Failed to add to cart");
    }
  };

  if (loading)
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (!flower)
    return <div className="text-center py-20">Flower not found.</div>;

  const isOwner = user && user._id === flower.owner?._id;

  // Stock Logic
  const isOutOfStock = flower.stock <= 0;
  const isLowStock = flower.stock > 0 && flower.stock <= 5;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <button
        onClick={() => navigate(-1)}
        className="group mb-8 flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-emerald-700 transition-colors"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <div className="flex flex-col lg:flex-row gap-12 bg-white rounded-[2.5rem] p-6 lg:p-10 shadow-xl border border-gray-100">
        {/* Left: Image */}
        <div className="w-full lg:w-1/2">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-4/5 rounded-4xl overflow-hidden shadow-inner bg-gray-50"
          >
            <img
              src={flower.image}
              alt={flower.name}
              className="w-full h-full object-cover"
            />

            {/* Status Overlay */}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                <span className="bg-white text-gray-900 px-6 py-2 rounded-full font-bold uppercase tracking-widest shadow-xl">
                  Sold Out
                </span>
              </div>
            )}
          </motion.div>
        </div>

        {/* Right: Content */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold uppercase tracking-tighter mb-3">
                  <Tag size={14} /> {flower?.category}
                </span>
                <h1 className="text-4xl lg:text-5xl font-serif font-bold text-gray-900">
                  {flower?.name}
                </h1>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-emerald-600">
                  ₹{flower.price}
                </p>
                <p className="text-xs text-gray-400 font-medium">
                  Inc. all taxes
                </p>
              </div>
            </div>

            <div
              className={`flex items-center gap-3 p-4 rounded-2xl border ${
                isOutOfStock
                  ? "bg-red-50 border-red-100"
                  : isLowStock
                    ? "bg-orange-50 border-orange-100"
                    : "bg-emerald-50 border-emerald-100"
              }`}
            >
              {isOutOfStock ? (
                <AlertCircle className="text-red-500" />
              ) : (
                <Layers
                  className={
                    isLowStock ? "text-orange-500" : "text-emerald-500"
                  }
                />
              )}
              <div>
                <p
                  className={`text-sm font-bold ${
                    isOutOfStock
                      ? "text-red-600"
                      : isLowStock
                        ? "text-orange-600"
                        : "text-emerald-700"
                  }`}
                >
                  {isOutOfStock
                    ? "Currently Unavailable"
                    : isLowStock
                      ? "Limited Stock Available"
                      : "In Stock & Ready to Ship"}
                </p>
                <p className="text-xs text-gray-500">
                  {isOutOfStock
                    ? "Check back later"
                    : `${flower.stock} items currently in the nursery`}
                </p>
              </div>
            </div>

            <p className="text-gray-600 text-lg leading-relaxed">
              {flower.description}
            </p>

            <div className="flex items-center gap-4 py-4">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-gray-500 shadow-sm">
                  <User size={18} />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-700">
                Listed by{" "}
                <span className="text-emerald-600 font-bold">
                  {flower.owner?.userName}
                </span>
              </p>
            </div>
          </div>

          {/* Actions */}
          {/* Actions */}
          <div className="mt-10 pt-8 border-t border-gray-100">
            {isOwner ? (
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => navigate(`/flowers/edit/${flowerId}`)}
                  className="flex items-center justify-center gap-2 bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-gray-200"
                >
                  <Pencil size={18} /> Update Bloom
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center justify-center gap-2 bg-red-50 text-red-600 py-4 rounded-2xl font-bold hover:bg-red-600 hover:text-white transition-all"
                >
                  <Trash2 size={18} /> Delete
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Add to Cart Button */}
                  <button
                    disabled={isOutOfStock}
                    onClick={() => handleAddToCart(flower._id)}
                    className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-2xl font-bold text-lg transition-all border-2 ${
                      isOutOfStock
                        ? "bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white border-emerald-600 text-emerald-600 hover:bg-emerald-50 shadow-sm"
                    }`}
                  >
                    <ShoppingBag size={20} />
                    Cart
                  </button>

                  {/* Buy Now Button */}
                  <button
                    disabled={isOutOfStock}
                    onClick={() =>
                      navigate("/checkout", {
                        state: {
                          items: [
                            {
                              flowerId: flower,
                              quantity: 1,
                              price: flower.price,
                              name: flower.name,
                              image: flower.image,
                            },
                          ],
                          totalAmount: flower.price,
                        },
                      })
                    }
                    className={`flex-2 flex items-center justify-center gap-3 py-5 rounded-2xl font-bold text-lg shadow-xl transition-all ${
                      isOutOfStock
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200/50 hover:-translate-y-1"
                    }`}
                  >
                    {isOutOfStock ? "Sold Out" : "Buy it Now"}
                  </button>
                </div>

                {/* Trust Badge */}
                <div className="flex items-center justify-center gap-6 py-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <ShieldCheck size={14} className="text-emerald-500" />{" "}
                    Secure Checkout
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <AlertCircle size={14} className="text-emerald-500" />{" "}
                    Freshness Guaranteed
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowerDetails;
