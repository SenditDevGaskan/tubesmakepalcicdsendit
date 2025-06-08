import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Package } from "lucide-react";
import API_CONFIG from "../config";

const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${API_CONFIG.BASE_URL}${API_CONFIG.API_ENDPOINTS.LOGIN}`, {
        email: formData.email,
        password: formData.password,
      });
      setSuccess("Login successful! Redirecting...");
      localStorage.setItem("token", response.data.token);
      setIsAuthenticated(true);
    } catch (err) {
      if (err.response?.status === 422) {
        setError("Invalid credentials. Please check your email and password.");
      } else if (err.response?.status === 429) {
        setError("Too many login attempts. Please try again later.");
      } else {
        setError(err.response?.data?.error || "Network error. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckResi = () => {
    navigate("/check-resi");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-center text-indigo-800">Admin Panel Sendit</h2>
          <p className="text-center text-gray-600 mt-2">Welcome back! Please login to your account.</p>
        </div>

        {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-center animate-fade-in">{error}</div>}
        {success && <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-center animate-fade-in">{success}</div>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-3 border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200`}
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full p-3 border ${errors.password ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-10 transition duration-200`}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full p-3 bg-indigo-800 text-white rounded-lg transition duration-200 font-medium
              ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-indigo-700 transform hover:-translate-y-0.5"}`}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6">
          <button
            onClick={handleCheckResi}
            className="w-full p-3 bg-white border-2 border-indigo-800 text-indigo-800 rounded-lg transition duration-200 font-medium
              hover:bg-indigo-50 flex items-center justify-center space-x-2"
          >
            <Package size={20} />
            <span>Check Resi Status</span>
          </button>
        </div>

        <div className="mt-8 text-center space-y-4">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <a href="/register" className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium">
              Register
            </a>
          </p>
          <a href="/forgot-password" className="text-sm text-gray-500 hover:text-gray-700 hover:underline block">
            Forgot your password?
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
