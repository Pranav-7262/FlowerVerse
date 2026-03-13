import React from "react";
import StatsCard from "./StatsCard";
import { Users, UserCheck, TrendingUp, Flower } from "lucide-react";

const StatsSection = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard
        icon={Users}
        label="Total Users"
        value={stats.totalUsers}
        description="All registered members"
        color="blue"
      />
      <StatsCard
        icon={UserCheck}
        label="Admin Users"
        value={stats.adminUsers}
        description="System administrators"
        color="purple"
      />
      <StatsCard
        icon={TrendingUp}
        label="Customers"
        value={stats.customerUsers}
        description="Active buyers"
        color="emerald"
      />
      <StatsCard
        icon={Flower}
        label="Listed Flowers"
        value={stats.totalFlowers}
        description="In catalog"
        color="pink"
      />
    </div>
  );
};

export default StatsSection;
