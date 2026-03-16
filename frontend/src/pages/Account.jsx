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
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Login & Security",
      desc: "Edit login, name, and mobile number",
      icon: ShieldCheck,
      link: "/account/security",
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Seller Studio",
      desc: "Manage your listings and sales revenue",
      icon: Flower2,
      link: "/my-flowers",
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Your Addresses",
      desc: "Edit addresses for orders and gifts",
      icon: MapPin,
      link: "/account/addresses",
      color: "bg-orange-50 text-orange-600",
    },
    {
      title: "Payment Options",
      desc: "Edit or add payment methods",
      icon: CreditCard,
      link: "/account/payments",
      color: "bg-rose-50 text-rose-600",
    },
    {
      title: "Customer Service",
      desc: "Contact our flower care team",
      icon: MessageSquare,
      link: "/support",
      color: "bg-teal-50 text-teal-600",
    },
    {
      title: "Remove Account",
      desc: "Remoce youe account permenently",
      icon: Trash,
      link: "/remove-acc",
      color: "bg-red-100 text-teal-600",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">
        Your Account
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accountLinks.map((item, index) => (
          <Link
            key={index}
            to={item.link}
            className="flex p-6 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all gap-4"
          >
            <div className={`p-3 rounded-lg h-fit ${item.color}`}>
              <item.icon size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-500 mt-1 leading-snug">
                {item.desc}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Account;
