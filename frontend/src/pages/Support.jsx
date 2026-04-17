import React from "react";
import {
  MessageCircle,
  Droplets,
  Truck,
  RefreshCcw,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

const Support = () => {
  const supportOptions = [
    {
      title: "Track Delivery",
      desc: "Live status of your active floral arrangements",
      icon: Truck,
      color: "bg-rose-600/20 text-rose-600",
      action: "Track Now",
    },
    {
      title: "Flower Care Guide",
      desc: "Learn how to keep your blooms fresh for 10+ days",
      icon: Droplets,
      color: "bg-blue-600/20 text-blue-600",
      action: "Read Guide",
    },
    {
      title: "Refunds & Returns",
      desc: "Our 100% freshness guarantee policy",
      icon: RefreshCcw,
      color: "bg-orange-600/20 text-orange-600",
      action: "View Policy",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-pink-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-serif font-black text-slate-900 mb-4">
            How can we <span className="text-rose-600 italic">help?</span>
          </h1>
          <p className="text-slate-600 max-w-lg leading-relaxed">
            From tracking a surprise delivery to learning how to care for your
            lilies, our concierge team is here for you.
          </p>
        </header>

        {/* Quick Help Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {supportOptions.map((opt, i) => (
            <div
              key={i}
              className="bg-white/70 p-8 rounded-[2.5rem] border border-rose-200/50 shadow-lg hover:shadow-xl hover:border-rose-300/50 transition-all"
            >
              <div
                className={`${opt.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-6`}
              >
                <opt.icon size={24} />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">{opt.title}</h3>
              <p className="text-xs text-slate-700 leading-relaxed mb-6">
                {opt.desc}
              </p>
              <button className="text-[10px] font-black uppercase tracking-widest text-slate-700 flex items-center gap-2 group hover:text-rose-600 transition-colors">
                {opt.action}{" "}
                <ChevronRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Support;
