import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/authStore";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  // 1. If we are still checking if the user is logged in, show a spinner
  if (loading) {
    return <div className="h-screen flex items-center justify-center text-gray-500">Loading...</div>;
  }

  // 2. If finished checking and NO user, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. If user exists, render the child routes (The Dashboard)
  return <Outlet />;
};

export default ProtectedRoute;