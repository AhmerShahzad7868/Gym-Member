import { useState } from "react";
import { useAuth } from "../context/authStore";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Dumbbell } from "lucide-react"; // Icons
import toast from "react-hot-toast";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      toast.success("Welcome back, Admin!");
      navigate("/dashboard"); // Redirect to Dashboard on success
    } else {
      // Error is already handled by interceptor, but we can double check here
      setIsLoading(false); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
        
        {/* Header */}
        <div className="bg-gray-900 p-8 text-center border-b border-gray-700">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 mb-4">
            <Dumbbell className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Admin Portal</h2>
          <p className="text-gray-400 mt-2 text-sm">Enter your credentials to manage the gym</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* Email Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="email"
              required
              className="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-10 p-2.5 placeholder-gray-400"
              placeholder="admin@gym.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="password"
              required
              className="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-10 p-2.5 placeholder-gray-400"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full text-white font-medium rounded-lg text-sm px-5 py-3 text-center transition-colors
              ${isLoading ? 'bg-blue-800 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-800'}
            `}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        
        {/* Footer */}
        <div className="bg-gray-900 p-4 text-center border-t border-gray-700">
          <p className="text-xs text-gray-500">Secure Access • Gym Management System</p>
        </div>
      </div>
    </div>
  );
};

export default Login;