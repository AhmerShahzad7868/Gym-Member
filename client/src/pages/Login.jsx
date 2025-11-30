import { useState } from "react";
import { useAuth } from "../context/authStore";
import { useNavigate } from "react-router-dom";
import { Lock, Mail } from "lucide-react"; 
import toast from "react-hot-toast";
import Logo from "../assets/logo.png";

// 1. Import the background image
// Make sure this path is correct based on your folder structure!
import gymBg from "../assets/gym-bg.jpeg"; 

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
      navigate("/dashboard"); 
    } else {
      setIsLoading(false); 
    }
  };

  return (
    // MAIN CONTAINER: Uses the gym background image
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${gymBg})` }}
    >
      {/* OVERLAY: Darkens the background image so the form is readable */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      {/* LOGIN CARD WRAPPER: z-10 puts it above the overlay */}
      <div className="relative z-10 max-w-md w-full px-4">
        
        {/* GLASS CARD: Semi-transparent black with heavy blur */}
        <div className="bg-black/50 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/10">
          
          {/* Header */}
          <div className="p-8 text-center border-b border-white/10">
            {/* Logo Circle: Glassy style */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-600/20 ring-1 ring-blue-500/50 mb-6 shadow-[0_0_15px_rgba(37,99,235,0.3)]">
              <div className="scale-125">
                 <img src={Logo} alt="Gym Logo" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white tracking-wide drop-shadow-md">Admin Portal</h2>
            <p className="text-gray-300 mt-2 text-sm">Enter your credentials to manage the gym</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            
            {/* Email Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
              </div>
              <input
                type="email"
                required
                className="w-full bg-black/40 border border-white/10 text-white text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-black/60 block pl-10 p-3 placeholder-gray-500 transition-all duration-200"
                placeholder="admin@gym.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            {/* Password Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
              </div>
              <input
                type="password"
                required
                className="w-full bg-black/40 border border-white/10 text-white text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-black/60 block pl-10 p-3 placeholder-gray-500 transition-all duration-200"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full text-white font-bold rounded-lg text-sm px-5 py-3.5 text-center transition-all duration-200 shadow-lg
                ${isLoading 
                  ? 'bg-blue-900/50 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 hover:shadow-blue-500/25 hover:-translate-y-0.5'}
              `}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          
          {/* Footer */}
          <div className="bg-black/20 p-4 text-center border-t border-white/10">
            <p className="text-xs text-gray-400">Secure Access • Gym Management System</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;