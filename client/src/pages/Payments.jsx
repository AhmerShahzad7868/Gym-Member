import { useState, useEffect } from "react";
import { Plus, DollarSign, Calendar, CreditCard, Search } from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [members, setMembers] = useState([]); // Needed for the dropdown
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    member_id: "",
    amount: "",
    payment_method: "Cash",
    duration_days: "30", // Default to 1 month
    remarks: ""
  });

  // 1. Fetch Data on Load
  useEffect(() => {
    fetchPayments();
    fetchMembers();
  }, []);

  const fetchPayments = async () => {
    try {
      const { data } = await api.get("/payments/history");
      setPayments(data.data);
    } catch (error) {
      toast.error("Failed to load history");
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const { data } = await api.get("/members/all");
      setMembers(data.data);
    } catch (error) {
      console.error("Could not load members for dropdown");
      console.log(error)
    }
  };

  // 2. Handle New Payment
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.member_id) return toast.error("Please select a member");

    try {
      // This call records money AND extends the member's expiry date
      const { data } = await api.post("/payments/add", formData);
      
      toast.success(data.message); // "Payment recorded & Membership extended"
      setShowModal(false);
      
      // Reset form
      setFormData({ member_id: "", amount: "", payment_method: "Cash", duration_days: "30", remarks: "" });
      
      fetchPayments(); // Refresh list
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="text-center mt-20">Loading Financials...</div>;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Payments & Revenue</h2>
          <p className="text-gray-500 text-sm">Track income and renew memberships</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 shadow-sm"
        >
          <Plus size={20} />
          Record Payment
        </button>
      </div>

      {/* Payment History Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Member</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Method</th>
              <th className="px-6 py-4">Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {payments.length === 0 ? (
               <tr><td colSpan="5" className="text-center py-10 text-gray-400">No payment records found.</td></tr>
            ) : (
              payments.map((pay) => (
                <tr key={pay.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {pay.full_name}
                    <div className="text-xs text-gray-400 font-normal">{pay.email}</div>
                  </td>
                  <td className="px-6 py-4 text-green-600 font-bold">
                    {pay.amount} PKR
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-400"/>
                      {new Date(pay.payment_date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                      <CreditCard size={12} />
                      {pay.payment_method}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 italic">
                    {pay.remarks || "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal: Record Payment */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Record New Payment</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* 1. Select Member */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Member</label>
                <select 
                  required
                  className="w-full border border-gray-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-green-500 outline-none"
                  value={formData.member_id}
                  onChange={(e) => setFormData({...formData, member_id: e.target.value})}
                >
                  <option value="">-- Choose Member --</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.full_name} ({m.phone})</option>
                  ))}
                </select>
              </div>

              {/* 2. Amount & Method */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (PKR)</label>
                  <input 
                    type="number" required placeholder="50.00"
                    className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
                  <select 
                    className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-green-500 bg-white"
                    value={formData.payment_method} onChange={e => setFormData({...formData, payment_method: e.target.value})}
                  >
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="Online">Online Transfer</option>
                  </select>
                </div>
              </div>

              {/* 3. Extension Logic */}
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <label className="block text-sm font-bold text-blue-800 mb-1">Extension (Days)</label>
                <input 
                  type="number" required placeholder="30"
                  className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.duration_days} onChange={e => setFormData({...formData, duration_days: e.target.value})} 
                />
                <p className="text-xs text-blue-600 mt-1">
                  This will automatically add days to the member's current expiry date.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                <textarea 
                  placeholder="e.g. October Fee"
                  className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-green-500 resize-none h-20"
                  value={formData.remarks} onChange={e => setFormData({...formData, remarks: e.target.value})}
                />
              </div>

              <div className="flex gap-3 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200">
                  Cancel
                </button>
                <button type="submit" className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700">
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;