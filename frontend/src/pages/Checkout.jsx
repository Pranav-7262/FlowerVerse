import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Truck,
  CreditCard,
  ArrowRight,
  ChevronLeft,
  Lock,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { useOrder } from "../contexts/OrderContext";
import { useAdress } from "../contexts/AddressContext";

const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { createOrder } = useOrder();

  const { address, fetchAddress, loading: addressLoading } = useAdress();
  const [orderLoading, setOrderLoading] = useState(false);

  useEffect(() => {
    fetchAddress();
  }, []);

  const currentAddress = address && address.length > 0 ? address[0] : null;

  if (!state || !state.items) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-serif font-bold text-gray-400">
          Your bag is empty
        </h2>
        <Link
          to="/cart"
          className="text-emerald-600 font-black underline mt-4 inline-block uppercase text-xs tracking-widest"
        >
          Return to Cart
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (!currentAddress || !currentAddress.street) {
      return toast.error(
        "Please set a shipping address in your profile first.",
      );
    }

    setOrderLoading(true);
    const toastId = toast.loading("Processing your request...");

    try {
      for (const item of state.items) {
        const targetFlowerId = item?.flower?._id || item?._id;

        await createOrder({
          flowerId: targetFlowerId,
          quantity: item.quantity,
        });
      }

      toast.success("Order Placed Successfully! 🌸", { id: toastId });
      navigate("/orders");
    } catch (err) {
      toast.error("Transaction failed.", { id: toastId });
      setOrderLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-900">
      <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-emerald-300 uppercase tracking-[0.2em] mb-4 transition-all"
          >
            <ChevronLeft size={14} /> Back to Bag
          </button>
          <h1 className="text-5xl font-serif font-black text-gray-100 tracking-tighter">
            Checkout
          </h1>
        </div>

        {/* Verification Badge */}
        <div className="flex items-center gap-3 px-6 py-3 bg-emerald-600/20 border border-emerald-600/40 rounded-2xl">
          <Lock size={16} className="text-emerald-400" />
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300">
            Secure Database Transaction
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {/* Address Display (Read-Only from DB) */}
          <section className="bg-slate-800/50 rounded-[3rem] p-10 border border-slate-700 shadow-lg shadow-black/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <MapPin size={120} />
            </div>

            <div className="flex justify-between items-start mb-10">
              <div>
                <h2 className="text-2xl font-serif font-bold text-gray-100">
                  Your Shipping Address
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Details synced from your verified profile
                </p>
              </div>
              <Link
                to="/account/addresses"
                className="text-[10px] font-black uppercase text-emerald-600 hover:underline"
              >
                Edit in Profile
              </Link>
            </div>

            {addressLoading ? (
              <div className="animate-pulse flex gap-6">
                <div className="h-24 w-full bg-gray-50 rounded-3xl" />
              </div>
            ) : currentAddress ? (
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">
                    Destination
                  </span>
                  <div className="p-1">
                    <p className="text-xl font-bold text-gray-800 leading-tight mb-1">
                      {currentAddress.street}
                    </p>
                    <p className="text-gray-500 font-medium">
                      {currentAddress.city}, {currentAddress.state}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">
                    Contact
                  </span>
                  <div className="flex items-center gap-3 text-xl font-bold text-gray-100">
                    <Phone size={18} className="text-emerald-500" />
                    {currentAddress.mobile}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-10 rounded-[2.5rem] bg-red-50 border border-red-100 text-center">
                <AlertCircle className="mx-auto text-red-400 mb-4" size={40} />
                <h3 className="text-red-900 font-bold mb-2">
                  No Address Found
                </h3>
                <p className="text-red-600 text-sm mb-6">
                  We need a destination to deliver your flowers.
                </p>
                <Link
                  to="/address"
                  className="px-8 py-3 bg-red-500 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-200"
                >
                  Configure Now
                </Link>
              </div>
            )}
          </section>

          <section className="bg-slate-800/50 rounded-[3rem] p-10 border border-slate-700 shadow-lg shadow-black/40">
            <h2 className="text-xl font-bold text-gray-100 mb-8 flex items-center gap-3">
              <Truck size={20} className="text-emerald-500" /> Shipment Manifest
            </h2>
            <div className="divide-y divide-gray-50">
              {state.items.map((item, idx) => (
                <div
                  key={idx}
                  className="py-6 flex items-center justify-between first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <img
                        src={item.flower?.image}
                        className="w-16 h-16 rounded-[1.25rem] object-cover shadow-sm"
                        alt=""
                      />
                      <div className="absolute -top-2 -right-2 bg-gray-900 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
                        {item.quantity}
                      </div>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-800 font-serif">
                        {item.flower?.name}
                      </p>
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                        Premium Selection
                      </p>
                    </div>
                  </div>
                  <span className="text-xl font-black text-gray-100">
                    ₹{item.flower?.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Payment Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900 rounded-[3.5rem] p-10 text-white sticky top-28 shadow-2xl">
            <div className="text-center mb-10">
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-4">
                Total Investment
              </p>
              <div className="text-7xl font-black tracking-tighter italic">
                ₹{state.totalAmount}
              </div>
            </div>

            <div className="space-y-6 mb-10 bg-slate-700/20 p-6 rounded-[2rem] border border-slate-600/30">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-gray-500 uppercase">
                  Method
                </span>
                <span className="text-sm font-bold flex items-center gap-2 text-emerald-400">
                  <CreditCard size={14} /> Cash on Delivery
                </span>
              </div>
              <div className="h-px bg-slate-700" />
              <p className="text-[9px] text-gray-500 leading-relaxed text-center italic">
                The address shown on the left will be automatically pulled from
                the database for fulfillment.
              </p>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={orderLoading || addressLoading || !currentAddress}
              className="group w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-6 rounded-[2rem] font-black text-xl transition-all flex items-center justify-center gap-3 disabled:opacity-20 disabled:grayscale shadow-xl shadow-emerald-600/30 active:scale-95"
            >
              {orderLoading ? "Processing..." : "Finalize Order"}
              {!orderLoading && (
                <ArrowRight
                  size={22}
                  className="group-hover:translate-x-1 transition-transform"
                />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
