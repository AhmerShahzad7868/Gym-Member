import { useState, useEffect } from "react";
import { Users, DollarSign, TrendingUp, UserPlus, CreditCard } from "lucide-react";
import api from "../services/api";

// Reusable Stat Card (No changes needed here, it's perfect)
const StatCard = ({ title, value, icon: Icon, color }) => (
  <div
    // 1. CONTAINER: Added bg-black/50 (semi-transparent black), backdrop-blur-md, and dark border
    className="bg-black/50 backdrop-blur-md p-6 rounded-xl shadow-lg border border-gray-700 transition-all hover:bg-black/60"
  >
    <div className="flex items-center justify-between">
      <div>
        {/* 2. TITLE: Changed text-gray-500 to text-gray-400 (light gray) */}
        <p className="text-sm text-gray-400 font-medium">{title}</p>

        {/* 3. VALUE: Changed text-gray-900 to text-white */}
        <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
      </div>

      {/* Icon Container: Ensure text color is adjusted based on 'color' prop */}
      <div className={`p-3 rounded-full ${color} bg-opacity-20`}>
        {/* We increase opacity to 20% for better visibility on the dark card background */}
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalRevenue: 0,
    activePlans: 0,
    recentPayments: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // We use Promise.all to fetch everything at the same time (Faster)
      const [membersRes, plansRes, revenueRes, historyRes] = await Promise.all([
        api.get("/members/all"),
        api.get("/plans/all"),
        api.get("/payments/revenue"),
        api.get("/payments/history")
      ]);

      // Calculate the stats
      setStats({
        totalMembers: membersRes.data.data.length,
        activePlans: plansRes.data.data.length,
        totalRevenue: revenueRes.data.total_revenue || 0,
        // Take only the first 5 payments for the "Recent Activity" list
        recentPayments: historyRes.data.data.slice(0, 5)
      });

    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="mt-10 text-center text-gray-500">Loading Dashboard...</div>;

  return (
    <div className="space-y-6">
      {/* 1. Real Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Members"
          value={stats.totalMembers}
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Revenue"
          value={`${stats.totalRevenue}`}
          icon={DollarSign}
          color="bg-green-500"
        />
        <StatCard
          title="Active Plans"
          value={stats.activePlans}
          icon={TrendingUp}
          color="bg-purple-500"
        />
        <StatCard
          title="Recent Transactions"
          value={stats.recentPayments.length}
          icon={CreditCard}
          color="bg-orange-500"
        />
      </div>

      {/* 2. Recent Activity Section (Real Data) */}
      {/* CONTAINER: 
    - bg-transparent: No background color at all.
    - No backdrop-blur: The background image is seen perfectly clearly.
    - border-white/20: A faint outline to define the box area.
*/}
      <div className="bg-transparent border border-white/20 rounded-xl p-6">

        {/* Title: Added drop-shadow-md so it pops off the background */}
        <h3 className="text-lg font-bold text-white mb-4 drop-shadow-md">Recent Payments</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">

            {/* Table Head: White text with shadow */}
            <thead className="text-gray-200 border-b border-white/20 text-sm">
              <tr>
                <th className="py-3 font-medium drop-shadow-sm">Member</th>
                <th className="py-3 font-medium drop-shadow-sm">Amount</th>
                <th className="py-3 font-medium drop-shadow-sm">Date</th>
                <th className="py-3 font-medium drop-shadow-sm">Status</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-white/20 text-sm">
              {stats.recentPayments.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-300 drop-shadow-sm">
                    No activity yet.
                  </td>
                </tr>
              ) : (
                stats.recentPayments.map((pay) => (
                  // Row Hover: Still nice to have a faint highlight when mouse is over
                  <tr key={pay.id} className="hover:bg-white/10 transition-colors duration-200">

                    <td className="py-3 font-medium text-white drop-shadow-sm">{pay.full_name}</td>

                    <td className="py-3 text-emerald-400 font-bold drop-shadow-md">
                      +PKR {pay.amount}
                    </td>

                    <td className="py-3 text-gray-300 drop-shadow-sm">
                      {new Date(pay.payment_date).toLocaleDateString()}
                    </td>

                    <td className="py-3">
                      {/* Badge: Kept semi-transparent so the status is readable */}
                      <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs border border-emerald-500/30 shadow-sm backdrop-blur-none">
                        Completed
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;