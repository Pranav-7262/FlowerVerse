import React from "react";
import { Link } from "react-router-dom";
import {
  Package,
  ShieldCheck,
  MapPin,
  CreditCard,
  Flower2,
  MessageSquare,
  Trash,
} from "lucide-react";

const Account = () => {
  const accountLinks = [
    {
      title: "Your Orders",
      desc: "Track, return, or buy things again",
      icon: Package,
      link: "/orders",
      color: "bg-blue-600/20 text-blue-400",
    },
    {
      title: "Login & Security",
      desc: "Edit login, name, and mobile number",
      icon: ShieldCheck,
      link: "/account/security",
      color: "bg-rose-100/50 text-rose-700",
    },

    {
      title: "Your Addresses",
      desc: "Edit addresses for orders and gifts",
      icon: MapPin,
      link: "/account/addresses",
      color: "bg-orange-600/20 text-orange-400",
    },

    {
      title: "Customer Service",
      desc: "Contact our flower care team",
      icon: MessageSquare,
      link: "/support",
      color: "bg-rose-100/50 text-rose-700",
    },
    {
      title: "Remove Account",
      desc: "Remoce youe account permenently",
      icon: Trash,
      link: "/remove-acc",
      color: "bg-red-600/20 text-pink-400",
    },
    {
      title: "Your Reviews",
      desc: "View and manage your flower reviews",
      icon: Flower2,
      link: "/account/reviews",
      color: "bg-green-600/20 text-green-400",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-pink-50">
      <div className="max-w-5xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-serif font-bold text-slate-900 mb-8">
          Your Account
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accountLinks.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className="flex p-6 border border-rose-200/50 rounded-xl hover:bg-white/70 bg-white/60 transition-all gap-4"
            >
              <div className={`p-3 rounded-lg h-fit ${item.color}`}>
                <item.icon size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{item.title}</h3>
                <p className="text-sm text-slate-600 mt-1 leading-snug">
                  {item.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Account;
