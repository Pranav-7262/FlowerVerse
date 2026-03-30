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
      color: "bg-emerald-600/20 text-emerald-400",
      action: "Track Now",
    },
    {
      title: "Flower Care Guide",
      desc: "Learn how to keep your blooms fresh for 10+ days",
      icon: Droplets,
      color: "bg-blue-600/20 text-blue-400",
      action: "Read Guide",
    },
    {
      title: "Refunds & Returns",
      desc: "Our 100% freshness guarantee policy",
      icon: RefreshCcw,
      color: "bg-orange-600/20 text-orange-400",
      action: "View Policy",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-900 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-serif font-black text-gray-100 mb-4">
            How can we <span className="text-teal-400 italic">help?</span>
          </h1>
          <p className="text-gray-400 max-w-lg leading-relaxed">
            From tracking a surprise delivery to learning how to care for your
            lilies, our concierge team is here for you.
          </p>
        </header>

        {/* Quick Help Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {supportOptions.map((opt, i) => (
            <div
              key={i}
              className="bg-slate-800/50 p-8 rounded-[2.5rem] border border-slate-700 shadow-lg hover:shadow-xl hover:border-emerald-500/50 transition-all"
            >
              <div
                className={`${opt.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-6`}
              >
                <opt.icon size={24} />
              </div>
              <h3 className="font-bold text-gray-100 mb-2">{opt.title}</h3>
              <p className="text-xs text-gray-300 leading-relaxed mb-6">
                {opt.desc}
              </p>
              <button className="text-[10px] font-black uppercase tracking-widest text-gray-300 flex items-center gap-2 group hover:text-emerald-400 transition-colors">
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
