import { useState, useEffect } from "react";
import { Users, DollarSign, TrendingUp, UserPlus, CreditCard } from "lucide-react";
import api from "../services/api";

// Reusable Stat Card (No changes needed here, it's perfect)
const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
      </div>
      <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Payments</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="text-gray-500 border-b border-gray-100 text-sm">
              <tr>
                <th className="py-3 font-medium">Member</th>
                <th className="py-3 font-medium">Amount</th>
                <th className="py-3 font-medium">Date</th>
                <th className="py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {stats.recentPayments.length === 0 ? (
                 <tr><td colSpan="4" className="text-center py-6 text-gray-400">No activity yet.</td></tr>
              ) : (
                stats.recentPayments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-gray-50">
                    <td className="py-3 font-medium text-gray-800">{pay.full_name}</td>
                    <td className="py-3 text-green-600 font-bold">+PKR {pay.amount}</td>
                    <td className="py-3 text-gray-500">
                        {new Date(pay.payment_date).toLocaleDateString()}
                    </td>
                    <td className="py-3">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
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