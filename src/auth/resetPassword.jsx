import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Lock, ArrowLeft, Eye, EyeOff, CheckCircle, Loader2 } from "lucide-react";
import API_CONFIG from "../config";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    email: searchParams.get("email") || "",
    password: "",
    password_confirmation: "",
    token: searchParams.get("token") || "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!formData.token || !formData.email) {
      navigate("/forgot-password");
    }
  }, [formData.token, formData.email, navigate]);

  const validateForm = () => {
    if (!formData.password || !formData.password_confirmation) {
      setError("All fields are required");
      return false;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    if (formData.password !== formData.password_confirmation) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await axios.post(`${API_CONFIG.BASE_URL}${API_CONFIG.API_ENDPOINTS.RESET_PASSWORD}`, {
        token: formData.token,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      if (err.response?.status === 400) {
        setError("Invalid or expired reset token. Please request a new password reset link.");
      } else {
        setError(err.response?.data?.error || "Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 p-4">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle size={48} className="text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Password Reset Successful!</h2>
          <p className="text-gray-600 mb-6">Your password has been successfully reset. Redirecting to login...</p>
          <div className="flex justify-center">
            <Loader2 size={24} className="animate-spin text-indigo-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 transform transition-all duration-300 hover:shadow-3xl">
        <button onClick={handleBackToLogin} className="group mb-8 flex items-center text-gray-600 hover:text-indigo-800 transition-all duration-200">
          <ArrowLeft size={20} className="mr-2 transition-transform group-hover:-translate-x-1" />
          <span className="font-medium">Back to Login</span>
        </button>

        <div className="mb-10 space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-2xl shadow-lg">
              <div className="bg-indigo-800 rounded-xl p-3 transform transition-transform hover:rotate-12">
                <Lock size={32} className="text-white" />
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center text-indigo-900 mt-6">Reset Your Password</h2>
          <p className="text-center text-gray-600 max-w-sm mx-auto">Please enter your new password below.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-center animate-fade-in">
            <p className="flex items-center justify-center font-medium">
              <span className="bg-red-100 p-1 rounded-lg mr-2">!</span>
              {error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input id="token" type="hidden" value={formData.token} name="token" />
            <input id="email" type="hidden" value={formData.email} name="email" />
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full p-4 pl-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your new password"
              />
              <Lock size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <button type="button" onClick={() => togglePasswordVisibility("password")} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="password_confirmation"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.password_confirmation}
                onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                className="w-full p-4 pl-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="Confirm your new password"
              />
              <Lock size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <button type="button" onClick={() => togglePasswordVisibility("confirm")} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full p-4 bg-gradient-to-r from-indigo-800 to-indigo-700 text-white rounded-xl transition-all duration-300 font-medium
              ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:from-indigo-700 hover:to-indigo-600 hover:shadow-lg hover:shadow-indigo-200 transform hover:-translate-y-0.5"}
            `}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <Loader2 size={20} className="animate-spin mr-2" />
                Resetting Password...
              </span>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
