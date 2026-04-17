import React from "react";

const StatsCard = ({
  icon: Icon,
  label,
  value,
  description,
  color,
  bgColor,
}) => {
  const colorStyles = {
    blue: {
      bg: "bg-blue-600/20",
      text: "text-blue-400",
      hover: "hover:border-blue-500/50",
      gradient: "from-blue-600/10 to-transparent",
    },
    purple: {
      bg: "bg-purple-600/20",
      text: "text-purple-400",
      hover: "hover:border-purple-500/50",
      gradient: "from-purple-600/10 to-transparent",
    },
    emerald: {
      bg: "bg-rose-600/20",
      text: "text-rose-600",
      hover: "hover:border-rose-500/50",
      gradient: "from-rose-600/10 to-transparent",
    },
    pink: {
      bg: "bg-pink-600/20",
      text: "text-pink-400",
      hover: "hover:border-pink-500/50",
      gradient: "from-pink-600/10 to-transparent",
    },
  };

  const style = colorStyles[color] || colorStyles.blue;

  return (
    <div
      className={`group bg-white/70 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-rose-200/50 ${style.hover} overflow-hidden relative hover:border-rose-300/50`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-r ${style.gradient} opacity-0 group-hover:opacity-100 transition-opacity`}
      />
      <div className="relative flex justify-between items-start">
        <div>
          <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">
            {label}
          </p>
          <p className="text-4xl font-black text-slate-900 mt-4">{value}</p>
          <p className={`text-xs ${style.text}/70 mt-3 font-medium`}>
            {description}
          </p>
        </div>
        <div
          className={`p-3 ${style.bg} rounded-xl group-hover:scale-110 transition-transform`}
        >
          <Icon className={`w-6 h-6 ${style.text}`} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
