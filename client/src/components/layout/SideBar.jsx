import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Ticket, 
  CreditCard, 
  LogOut 
} from "lucide-react";
import { useAuth } from "../../context/authStore.jsx";
import Logo from "./Logo.jsx";

const Sidebar = () => {
  const { logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Members", path: "/members", icon: Users },
    { name: "Plans", path: "/plans", icon: Ticket },
    { name: "Payments", path: "/payments", icon: CreditCard },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    // CONTAINER: 
    // - bg-black/50: Semi-transparent black so the gym background shows through
    // - backdrop-blur-xl: Blurs the image behind the sidebar for readability
    // - border-white/10: Subtle glass border instead of solid gray
    <div className="h-screen w-64 bg-black/50 backdrop-blur-xl text-white flex flex-col fixed left-0 top-0 border-r border-white/10 z-20 transition-all duration-300">
      
      {/* 1. Logo Section */}
      {/* Added bg-white/5 to slightly distinguish the header area */}
      <div className="h-20 flex items-center px-8 border-b border-white/10 bg-white/5">
        <Logo />
        <h1 className="text-xl font-bold tracking-wider ml-2 text-white drop-shadow-md">GYM ADMIN</h1>
      </div>

      {/* 2. Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden
              ${isActive(item.path) 
                // ACTIVE STATE: Gradient blue with glow, no solid bg
                ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30 border border-blue-400/20" 
                // INACTIVE STATE: Transparent, hovers to faint white
                : "text-gray-400 hover:bg-white/10 hover:text-white hover:shadow-sm"
              }
            `}
          >
            <item.icon 
              className={`w-5 h-5 mr-3 transition-colors 
                ${isActive(item.path) ? "text-white" : "text-gray-500 group-hover:text-white"}
              `} 
            />
            <span className="font-medium tracking-wide">{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* 3. Logout Section (Bottom) */}
      {/* Added bg-black/20 for a darker footer area */}
      <div className="p-4 border-t border-white/10 bg-black/20">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-3 text-gray-400 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-all border border-transparent hover:border-red-500/30"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;