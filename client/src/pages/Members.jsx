import { useState, useEffect } from "react";
import { Plus, Search, Trash2, Mail, Phone } from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    start_date: "",
    end_date: "", // Note: In real app, this is usually calculated via Payment, but we allow manual override here
    status: "active"
  });

  // 1. Fetch Members
  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data } = await api.get("/members/all");
      setMembers(data.data);
    } catch (error) {
      toast.error("Failed to load members");
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Add Member
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/members/add", formData);
      toast.success("Member added successfully!");
      setShowModal(false);
      setFormData({ full_name: "", email: "", phone: "", start_date: "", end_date: "", status: "active" });
      fetchMembers();
    } catch (error) {
      console.error(error);
    }
  };

  // 3. Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure? This cannot be undone.")) return;
    try {
      await api.delete(`/members/${id}`);
      toast.success("Member deleted");
      fetchMembers();
    } catch (error) {
      toast.error("Failed to delete member");
      console.log(error)
    }
  };

  // 4. Search Filter Logic
  const filteredMembers = members.filter(member => 
    member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone.includes(searchTerm)
  );

  // Helper: Status Badge Color
  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-700";
      case "expired": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) return <div className="text-center mt-20">Loading Members...</div>;

  return (
    <div className="space-y-6">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gym Members</h2>
          <p className="text-gray-500 text-sm">Total Members: {members.length}</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by name or phone..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={20} />
            Add Member
          </button>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Full Name</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Membership Dates</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredMembers.length === 0 ? (
               <tr><td colSpan="5" className="text-center py-10 text-gray-400">No members found.</td></tr>
            ) : (
              filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{member.full_name}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col text-sm text-gray-500 space-y-1">
                      <div className="flex items-center gap-2"><Mail size={14}/> {member.email}</div>
                      <div className="flex items-center gap-2"><Phone size={14}/> {member.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(member.status)}`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div>Start: {member.start_date ? new Date(member.start_date).toLocaleDateString() : '-'}</div>
                    <div className="font-medium text-gray-800">
                      Ends: {member.end_date ? new Date(member.end_date).toLocaleDateString() : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(member.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete Member"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Member Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Register New Member</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input required type="text" className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input required type="email" className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input required type="text" className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input required type="date" className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} />
                </div>
                {/* Note: End Date is usually auto-calculated by payments, but we allow manual entry here for flexibility */}
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date (Initial)</label>
                  <input type="date" className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200">
                  Cancel
                </button>
                <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700">
                  Register Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;