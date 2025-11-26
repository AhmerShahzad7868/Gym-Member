import { useState, useEffect } from "react";
import { Plus, Trash2, Check, X } from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    duration_days: "",
    features: ""
  });

  // 1. Fetch Plans on Load
  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data } = await api.get("/plans/all");
      setPlans(data.data); // Assuming backend sends { data: [...] }
    } catch (error) {
      toast.error("Failed to load plans");
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Create Plan
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/plans/create", formData);
      toast.success("Plan created successfully!");
      setShowModal(false);
      setFormData({ name: "", price: "", duration_days: "", features: "" }); // Reset form
      fetchPlans(); // Refresh list
    } catch (error) {
      console.error(error); // Log for debugging
    }
  };

  // 3. Handle Delete Plan
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;
    
    try {
      await api.delete(`/plans/${id}`);
      toast.success("Plan deleted");
      fetchPlans(); // Refresh list
    } catch (error) {
      toast.error("Failed to delete plan");
      console.log(error)
    }
  };

  if (loading) return <div className="text-center mt-20">Loading Plans...</div>;

  return (
    <div className="space-y-6">
      
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Membership Plans</h2>
          <p className="text-gray-500 text-sm">Manage your gym pricing tiers</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={20} />
          Add New Plan
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.length === 0 ? (
          <p className="col-span-3 text-center text-gray-400 py-10">No plans found. Create one!</p>
        ) : (
          plans.map((plan) => (
            <div key={plan.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col relative group">
              
              {/* Delete Button (Hidden until hover) */}
              <button 
                onClick={() => handleDelete(plan.id)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={18} />
              </button>

              <h3 className="text-lg font-bold text-gray-800">{plan.name}</h3>
              
              <div className="my-4">
                <span className="text-3xl font-bold text-blue-600">PKR {plan.price}</span>
                <span className="text-gray-400 text-sm"> / {plan.duration_days} days</span>
              </div>

              {/* Features List (Splits string by comma) */}
              <div className="flex-1 space-y-3 mb-6">
                {plan.features?.split(",").map((feature, index) => (
                  <div key={index} className="flex items-start text-sm text-gray-600">
                    <Check size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{feature.trim()}</span>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 -mx-6 -mb-6 p-4 text-center border-t border-gray-100">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Active Plan</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal for Creating Plan */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Add New Plan</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
                <input 
                  type="text" required placeholder="e.g. Gold Membership"
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input 
                    type="number" required placeholder="50.00"
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Days)</label>
                  <input 
                    type="number" required placeholder="30"
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.duration_days}
                    onChange={(e) => setFormData({...formData, duration_days: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Features (Comma separated)</label>
                <textarea 
                  required placeholder="Gym Access, Free Sauna, Personal Trainer"
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
                  value={formData.features}
                  onChange={(e) => setFormData({...formData, features: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Create Plan
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Plans;