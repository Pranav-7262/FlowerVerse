import React, { useState } from "react";
import {
  Trash2,
  AlertTriangle,
  ShieldAlert,
  ChevronLeft,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const RemoveAccount = () => {
  const navigate = useNavigate();
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();
    if (confirmText !== "DELETE") {
      return toast.error("Please type DELETE to confirm");
    }

    setLoading(true);
    const toastId = toast.loading("Closing your floral vault...");

    try {
      await api.delete("/auth/reset-account");
      toast.success("Account removed. We'll miss you. ", { id: toastId });
      navigate("/login");
    } catch (err) {
      toast.error("Process failed. Contact support.", { id: toastId });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-900 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-gray-200 uppercase tracking-[0.2em] mb-12 transition-all"
        >
          <ChevronLeft size={14} /> Safety Exit
        </button>

        <div className="bg-slate-800/50 rounded-[3rem] p-10 border border-slate-700/50 shadow-2xl shadow-black/60 relative overflow-hidden">
          <ShieldAlert className="absolute -top-6 -right-6 text-red-600/10 w-40 h-40" />

          <div className="relative z-10 text-center">
            <div className="w-20 h-20 bg-red-900/20 rounded-[2rem] flex items-center justify-center text-red-500 mx-auto mb-8 shadow-sm">
              <Trash2 size={32} />
            </div>

            <h1 className="text-3xl font-serif font-black text-gray-100 mb-4">
              Permanent <span className="text-red-500 italic">Removal</span>
            </h1>

            <p className="text-sm text-gray-300 leading-relaxed mb-8">
              This action is{" "}
              <span className="font-bold text-gray-100 underline">
                irreversible
              </span>
              . All your floral order history, saved addresses, and vault
              credits will be purged from our logistics pipeline.
            </p>

            <form onSubmit={handleDelete} className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-red-500 uppercase tracking-widest block">
                  Type "DELETE" to authorize
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Confirm Action"
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-2xl px-6 py-4 text-center font-bold text-gray-100 focus:ring-2 focus:ring-red-500 outline-none transition-all placeholder:text-gray-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading || confirmText !== "DELETE"}
                className="w-full bg-red-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-red-700 transition-all flex items-center justify-center gap-3 disabled:opacity-20 disabled:grayscale shadow-xl shadow-red-900/40"
              >
                {loading ? "Purging Data..." : "Destroy Account"}
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>

            <div className="mt-10 flex items-center justify-center gap-2 text-gray-400">
              <AlertTriangle size={14} />
              <span className="text-[9px] font-black uppercase tracking-widest">
                Security Protocol 7.1
              </span>
            </div>
          </div>
        </div>

        <p className="text-center mt-8 text-[10px] font-black text-gray-500 uppercase tracking-widest leading-loose">
          FlowerMart Data Protection Agency
          <br />
          Compliance &copy; 2026
        </p>
      </div>
    </div>
  );
};

export default RemoveAccount;
