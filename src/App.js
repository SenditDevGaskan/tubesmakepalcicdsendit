// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Menu } from "lucide-react";
import Sidebar from "./sidebar";
import AdminDashboard from "./adminDashboard";
import UsersPage from "./Users/UsersPage";
import OrderPage from "./Orders/OrderPage";
import Login from "./auth/login";
import Register from "./auth/register";
import PaymentPage from "./Payment/PaymentPage";
import CheckResiPage from "./Resi/CheckResiPage";
import ForgotPassword from "./auth/forgotPassword";
import ResetPassword from "./auth/resetPassword";
const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Hapus token dari localStorage
    setIsAuthenticated(false); // Set status autentikasi ke false
  };

  return (
    <Router>
      <Routes>
        <Route path="/check-resi" element={<CheckResiPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <div className="bg-gray-100 min-h-screen">
        {isAuthenticated && <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} handleLogout={handleLogout} />}

        <div className={`lg:ml-64 transition-all duration-300 ease-in-out ${isAuthenticated ? "" : "ml-0"}`}>
          {isAuthenticated && (
            <header className="bg-white shadow-md p-4 flex justify-between items-center">
              <button onClick={toggleSidebar} className="lg:hidden">
                <Menu size={24} />
              </button>
              <h1 className="text-xl font-semibold">Admin Dashboard</h1>
            </header>
          )}

          <main>
            <Routes>
              <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
              <Route path="/dashboard" element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />} />
              <Route path="/users" element={isAuthenticated ? <UsersPage /> : <Navigate to="/login" />} />
              <Route path="/orders" element={isAuthenticated ? <OrderPage /> : <Navigate to="/login" />} />
              <Route path="/payment" element={isAuthenticated ? <PaymentPage /> : <Navigate to="/login" />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
