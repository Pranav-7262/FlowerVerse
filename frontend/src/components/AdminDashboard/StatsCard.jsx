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
      bg: "bg-blue-100/60",
      text: "text-blue-600",
      hover: "hover:border-blue-200/50",
      gradient: "from-blue-50/50 to-transparent",
    },
    purple: {
      bg: "bg-purple-100/60",
      text: "text-purple-600",
      hover: "hover:border-purple-200/50",
      gradient: "from-purple-50/50 to-transparent",
    },
    emerald: {
      bg: "bg-emerald-100/60",
      text: "text-emerald-600",
      hover: "hover:border-emerald-200/50",
      gradient: "from-emerald-50/50 to-transparent",
    },
    pink: {
      bg: "bg-pink-100/60",
      text: "text-pink-600",
      hover: "hover:border-pink-200/50",
      gradient: "from-pink-50/50 to-transparent",
    },
  };

  const style = colorStyles[color] || colorStyles.blue;

  return (
    <div
      className={`group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-slate-100 ${style.hover} overflow-hidden relative`}
    >
      <div
        className={`absolute inset-0 bg-linear-to-r ${style.gradient} opacity-0 group-hover:opacity-100 transition-opacity`}
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
