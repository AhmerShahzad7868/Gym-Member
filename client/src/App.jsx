// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout"; // Import Layout
import Plans from "./pages/Plans";
import Members from "./pages/Members";
import Payments from "./pages/Payments";

// Placeholders for now (We will build these next)
// const Members = () => <div className="text-2xl font-bold">Members Page</div>;
// const Plans = () => <div className="text-2xl font-bold">Plans Page</div>;
// const Payments = () => <div className="text-2xl font-bold">Payments Page</div>;

function App() {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        <Route path="/login" element={<Login />} />

        {/* NESTED ROUTES: Protected -> MainLayout -> Pages */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/members" element={<Members />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/payments" element={<Payments />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;