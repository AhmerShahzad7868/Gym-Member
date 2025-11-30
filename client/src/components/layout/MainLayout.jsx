import { Outlet } from "react-router-dom";
import Sidebar from "./SideBar";
import { useAuth } from "../../context/authStore";
// 1. Import the image (Make sure the path matches your folder structure)
import gymBg from "../../assets/gym-bg.jpeg"; 

const MainLayout = () => {
  const { user } = useAuth();

  return (
    // ROOT: Relative container with the Background Image
    <div 
      className="relative h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${gymBg})` }}
    >
      
      {/* 2. OVERLAY: Darkens the background so text is readable */}
      <div className="absolute inset-0 bg-black/80" />

      {/* 3. LAYOUT WRAPPER: Sits ON TOP of the overlay (z-10) */}
      <div className="relative z-10 flex h-screen text-gray-100">
        
        {/* Left Side: Navigation */}
        {/* Note: Ensure your Sidebar component handles dark mode or has a transparent background! */}
        <Sidebar />

        {/* Right Side: Content Area */}
        <div className="flex-1 ml-64 flex flex-col overflow-hidden">
          
          {/* Header Bar: Updated to "Glassmorphism" (Dark & Transparent) */}
          <header className="h-20 bg-black/40 backdrop-blur-md border-b border-gray-700 flex items-center justify-between px-8 shadow-sm">
             <h2 className="text-xl font-semibold text-white tracking-wide">
               Overview
             </h2>
             
             <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-200">{user?.name}</p>
                  <p className="text-xs text-gray-400">Administrator</p>
                </div>
                {/* Avatar: Adjusted colors for dark theme */}
                <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-lg">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
             </div>
          </header>

          {/* The Page Content: Removed 'bg-gray-50' so we can see the background image */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-8">
             <Outlet /> 
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;