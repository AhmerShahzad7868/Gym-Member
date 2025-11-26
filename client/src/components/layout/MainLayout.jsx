import { Outlet } from "react-router-dom";
import Sidebar from "./SideBar";
import { useAuth } from "../../context/authStore";

const MainLayout = () => {
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Side: Navigation */}
      <Sidebar />

      {/* Right Side: Content Area */}
      <div className="flex-1 ml-64 flex flex-col overflow-hidden">
        
        {/* Optional Header Bar */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
           <h2 className="text-xl font-semibold text-gray-800">
             Overview
           </h2>
           <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
           </div>
        </header>

        {/* The Page Content goes here (Scrollable) */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-8">
           <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default MainLayout;