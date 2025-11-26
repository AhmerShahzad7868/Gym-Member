import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Ticket, 
  LogOut, 
  Dumbbell 
} from "lucide-react";
import { useAuth } from "../../context/authStore.jsx";

const Sidebar = () => {
  const { logout } = useAuth();
  const location = useLocation();

  // Define menu items in an array so it's easy to add more later
  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Members", path: "/members", icon: Users },
    { name: "Plans", path: "/plans", icon: Ticket },
    { name: "Payments", path: "/payments", icon: CreditCard },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="h-screen w-64 bg-gray-900 text-white flex flex-col fixed left-0 top-0 border-r border-gray-800">
      
      {/* 1. Logo Section */}
      <div className="h-20 flex items-center px-8 border-b border-gray-800">
        <Dumbbell className="w-8 h-8 text-blue-500 mr-3" />
        <h1 className="text-xl font-bold tracking-wider">GYM ADMIN</h1>
      </div>

      {/* 2. Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 group
              ${isActive(item.path) 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50" 
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }
            `}
          >
            <item.icon className={`w-5 h-5 mr-3 ${isActive(item.path) ? "text-white" : "text-gray-500 group-hover:text-white"}`} />
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* 3. Logout Section (Bottom) */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-3 text-gray-400 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;