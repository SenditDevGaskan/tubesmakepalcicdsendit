import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, MailCheck, Loader2 } from "lucide-react";
import API_CONFIG from "../config";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${API_CONFIG.BASE_URL}${API_CONFIG.API_ENDPOINTS.FORGOT_PASSWORD}`, {
        email: email,
      });
      setSuccess("Reset link has been sent to your email address. Please check your inbox!");
      setEmail("");
    } catch (err) {
      if (err.response?.status === 404) {
        setError("No account found with this email address.");
      } else if (err.response?.status === 429) {
        setError("Too many requests. Please try again later.");
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
                <Mail size={32} className="text-white" />
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center text-indigo-900 mt-6">Forgot Your Password?</h2>
          <p className="text-center text-gray-600 max-w-sm mx-auto leading-relaxed">Don't worry! It happens. Please enter your email address and we'll send you instructions to reset your password.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-center animate-fade-in">
            <p className="flex items-center justify-center font-medium">
              <span className="bg-red-100 p-1 rounded-lg mr-2">!</span>
              {error}
            </p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-6 bg-green-50 border border-green-200 text-green-700 rounded-2xl animate-fade-in">
            <div className="flex items-center justify-center mb-3">
              <div className="bg-green-100 p-2 rounded-xl mr-3">
                <MailCheck size={24} className="text-green-600" />
              </div>
              <span className="font-semibold text-green-800">Email Sent Successfully!</span>
            </div>
            <p className="text-center text-sm text-green-600">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                className="w-full p-4 pl-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
              />
              <Mail size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
                Sending Instructions...
              </span>
            ) : (
              "Send Reset Instructions"
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-gray-600">
            Remember your password?{" "}
            <button onClick={handleBackToLogin} className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200 hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded">
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
