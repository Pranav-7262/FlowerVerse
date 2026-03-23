import React from "react";
import StatsCard from "./StatsCard";
import { Users, ShoppingBag, CreditCard, Flower } from "lucide-react";

const StatsSection = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      <StatsCard
        icon={Users}
        label="Total Users"
        value={stats.totalUsers}
        description={`${stats.adminUsers} Admins / ${stats.customerUsers} Buyers`}
        color="blue"
      />

      <StatsCard
        icon={ShoppingBag}
        label="Total Orders"
        value={stats.totalOrders || 0}
        description="Global checkout volume"
        color="purple"
      />

      <StatsCard
        icon={Flower}
        label="Catalog Size"
        value={stats.totalFlowers}
        description="Active floral listings"
        color="pink"
      />

      <StatsCard
        icon={CreditCard}
        label="Total Revenue"
        value={new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        }).format(stats.totalRevenue || 0)}
        description="Gross marketplace sales"
        color="emerald"
      />
    </div>
  );
};

export default StatsSection;
