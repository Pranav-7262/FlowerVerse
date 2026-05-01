import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Edit3,
  Trash2,
  Plus,
  Check,
  ChevronLeft,
  Truck,
  ShieldCheck,
  Home,
  Building2,
  Map,
  Phone,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAdress } from "../contexts/AddressContext";

const Address = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const { loading, address, fetchAddress, updateAddress, deleteAddress } =
    useAdress();

  const [formData, setFormData] = useState({
    street: "",
    city: "",
    state: "",
    mobile: "",
  });

  useEffect(() => {
    fetchAddress();
  }, []);

  useEffect(() => {
    if (address && address.length > 0) {
      const current = address[0];
      setFormData({
        street: current.street || "",
        city: current.city || "",
        state: current.state || "",
        mobile: current.mobile || "",
      });
    }
  }, [address, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await updateAddress(formData);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!window.confirm("Permanently remove this address?")) return;
    await deleteAddress();
  };

  const hasAddress = address && address.length > 0;

  if (loading && !hasAddress) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-pink-50 pb-20">
      <div className="max-w-4xl mx-auto px-6 pt-12">
        {/* Header Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-slate-600 hover:text-rose-700 transition-colors mb-8"
        >
          <ChevronLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="text-xs font-black uppercase tracking-widest">
            Back to Profile
          </span>
        </button>

        <header className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-3 text-rose-700 font-bold text-sm mb-3 tracking-widest uppercase"
          >
            <MapPin size={16} /> Logistics & Delivery
          </motion.div>
          <h1 className="text-5xl font-serif font-black text-slate-900 tracking-tight">
            Shipping <span className="text-rose-700 italic">Address</span>
          </h1>
        </header>

        <div className="grid gap-8">
          <AnimatePresence mode="wait">
            {!isEditing && hasAddress ? (
              <motion.div
                key="view"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="group bg-white/70 rounded-[2.5rem] border border-rose-200/50 p-10 shadow-lg shadow-rose-200/20 flex flex-col md:flex-row items-start justify-between gap-8"
              >
                <div className="flex gap-6">
                  <div className="w-16 h-16 bg-rose-100 rounded-[1.5rem] flex items-center justify-center text-rose-600 shrink-0">
                    <Truck size={28} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">
                      Primary Residence
                    </p>
                    <div className="space-y-1">
                      <h2 className="text-2xl font-bold text-slate-900 leading-tight">
                        {address[0].street}
                      </h2>
                      <p className="text-slate-700 font-medium">
                        {address[0].city}, {address[0].state}
                      </p>
                      <p className="text-rose-700 font-bold flex items-center gap-2 mt-2">
                        <Phone size={14} /> {address[0].mobile}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 shrink-0">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-4 bg-white/70 text-slate-700 rounded-2xl hover:bg-rose-600 hover:text-white transition-all shadow-sm border border-rose-200/50"
                  >
                    <Edit3 size={20} />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-4 bg-white/70 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm border border-rose-200/50"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </motion.div>
            ) : isEditing ? (
              <motion.div
                key="edit"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white/70 rounded-[2.5rem] border-2 border-rose-200/50 p-10 shadow-2xl shadow-rose-200/20"
              >
                <form
                  onSubmit={handleUpdate}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {/* Street */}
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-rose-600 uppercase tracking-widest px-1">
                      Street Address
                    </label>
                    <div className="relative">
                      <Home
                        className="absolute left-4 top-4 text-slate-400"
                        size={18}
                      />
                      <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleChange}
                        required
                        className="w-full bg-white/70 border border-rose-200/50 rounded-2xl pl-12 pr-6 py-4 text-lg font-bold text-slate-900 placeholder-slate-400"
                      />
                    </div>
                  </div>

                  {/* City */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-rose-600 uppercase tracking-widest px-1">
                      City
                    </label>
                    <div className="relative">
                      <Building2
                        className="absolute left-4 top-4 text-slate-400"
                        size={18}
                      />
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="w-full bg-white/70 border border-rose-200/50 rounded-2xl pl-12 pr-6 py-4 font-bold text-slate-900"
                      />
                    </div>
                  </div>

                  {/* State */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-rose-600 uppercase px-1">
                      State
                    </label>
                    <div className="relative">
                      <Map
                        className="absolute left-4 top-4 text-slate-400"
                        size={18}
                      />
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        className="w-full bg-white/70 border border-rose-200/50 rounded-2xl pl-12 pr-6 py-4 font-bold text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Mobile */}
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-rose-600 uppercase tracking-widest px-1">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <Phone
                        className="absolute left-4 top-4 text-slate-400"
                        size={18}
                      />
                      <input
                        type="text"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        required
                        className="w-full bg-white/70 border border-rose-200/50 rounded-2xl pl-12 pr-6 py-4 font-bold text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-rose-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-rose-700 transition-all flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Check size={18} /> Save Address
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-8 bg-white/70 text-slate-700 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white transition-all border border-rose-200/50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* Empty State Action */}
          {!hasAddress && !isEditing && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setIsEditing(true)}
              className="group border-2 border-dashed border-rose-200 rounded-[2.5rem] p-12 flex flex-col items-center justify-center gap-4 hover:border-rose-400 hover:bg-rose-600/5 transition-all"
            >
              <div className="p-4 bg-rose-100/50 text-rose-600 rounded-full group-hover:bg-rose-200 group-hover:text-rose-700 transition-colors">
                <Plus size={32} />
              </div>
              <span className="text-sm font-black text-rose-600 uppercase tracking-widest group-hover:text-rose-700">
                Add New Shipping Profile
              </span>
            </motion.button>
          )}}
        </div>
      </div>
    </div>
  );
};

export default Address;
