import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_CONFIG from "../config";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama: "",
    alamat: "",
    no_hp: "",
    email: "",
    username: "",
    password: "",
    password_confirmation: "",
    role: "admin",
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Nama validation (required, string, max:255)
    if (!formData.nama) {
      newErrors.nama = "Full name is required";
    } else if (formData.nama.length > 255) {
      newErrors.nama = "Full name cannot exceed 255 characters";
    }

    // Alamat validation (required, string)
    if (!formData.alamat) {
      newErrors.alamat = "Address is required";
    }

    // No HP validation (required, string, max:255)
    if (!formData.no_hp) {
      newErrors.no_hp = "Phone number is required";
    } else if (!/^[0-9]{10,13}$/.test(formData.no_hp)) {
      newErrors.no_hp = "Please enter a valid phone number (10-13 digits)";
    }

    // Email validation (required, email, max:255)
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    } else if (formData.email.length > 255) {
      newErrors.email = "Email cannot exceed 255 characters";
    }

    // Username validation (required, string, max:255)
    if (!formData.username) {
      newErrors.username = "Username is required";
    } else if (formData.username.length > 255) {
      newErrors.username = "Username cannot exceed 255 characters";
    }

    // Password validation (required, min:8, confirmed)
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    // Password confirmation validation
    if (!formData.password_confirmation) {
      newErrors.password_confirmation = "Password confirmation is required";
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = "Passwords do not match";
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
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      console.log("Sending registration data:", formData); // Debug log
      const response = await axios.post(`${API_CONFIG.BASE_URL}${API_CONFIG.API_ENDPOINTS.REGISTER}`, formData);
      console.log("Registration response:", response.data); // Debug log
      
      setSuccess("Registration successful! Redirecting to login...");
      // Clear form after successful registration
      setFormData({
        nama: "",
        alamat: "",
        no_hp: "",
        email: "",
        username: "",
        password: "",
        password_confirmation: "",
        role: "pemesan",
      });
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Registration error details:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
      
      if (err.response?.status === 422) {
        // Validation errors from server
        const serverErrors = err.response.data;
        const newErrors = {};
        Object.keys(serverErrors).forEach((key) => {
          // Handle specific validation messages
          if (key === "email" && serverErrors[key].includes("already")) {
            newErrors[key] = "Email is already registered";
          } else if (key === "username" && serverErrors[key].includes("already")) {
            newErrors[key] = "Username is already taken";
          } else {
            newErrors[key] = serverErrors[key][0];
          }
        });
        setErrors(newErrors);
      } else if (err.response?.status === 500) {
        setError("Server error. Please try again later.");
      } else if (!err.response) {
        setError("Network error. Please check your internet connection.");
      } else {
        setError(err.response?.data?.message || "An error occurred during registration. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md mx-4 bg-white rounded-lg shadow-xl p-8 my-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-center text-indigo-800">Create Account</h2>
          <p className="text-center text-gray-600 mt-2">Please complete your information</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-center">{success}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Nama Input */}
          <div>
            <input
              type="text"
              name="nama"
              placeholder="Full Name"
              value={formData.nama}
              onChange={handleChange}
              className={`w-full p-3 border ${errors.nama ? "border-red-500" : "border-gray-300"} 
                                rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
            />
            {errors.nama && <p className="mt-1 text-sm text-red-500">{errors.nama}</p>}
          </div>

          {/* Alamat Input */}
          <div>
            <textarea
              name="alamat"
              placeholder="Full Address"
              value={formData.alamat}
              onChange={handleChange}
              rows="3"
              className={`w-full p-3 border ${errors.alamat ? "border-red-500" : "border-gray-300"} 
                                rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
            />
            {errors.alamat && <p className="mt-1 text-sm text-red-500">{errors.alamat}</p>}
          </div>

          {/* No HP Input */}
          <div>
            <input
              type="tel"
              name="no_hp"
              placeholder="Phone Number"
              value={formData.no_hp}
              onChange={handleChange}
              className={`w-full p-3 border ${errors.no_hp ? "border-red-500" : "border-gray-300"} 
                                rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
            />
            {errors.no_hp && <p className="mt-1 text-sm text-red-500">{errors.no_hp}</p>}
          </div>

          {/* Email Input */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-3 border ${errors.email ? "border-red-500" : "border-gray-300"} 
                                rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>

          {/* Username Input */}
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full p-3 border ${errors.username ? "border-red-500" : "border-gray-300"} 
                                rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
            />
            {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
          </div>

          {/* Password Input */}
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full p-3 border ${errors.password ? "border-red-500" : "border-gray-300"} 
                                rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
            />
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
          </div>

          {/* Password Confirmation Input */}
          <div>
            <input
              type="password"
              name="password_confirmation"
              placeholder="Confirm Password"
              value={formData.password_confirmation}
              onChange={handleChange}
              className={`w-full p-3 border ${errors.password_confirmation ? "border-red-500" : "border-gray-300"} 
                                rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
            />
            {errors.password_confirmation && <p className="mt-1 text-sm text-red-500">{errors.password_confirmation}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full p-3 bg-indigo-800 text-white rounded-lg transition duration-200 font-medium mt-6
                            ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-indigo-700"}`}
          >
            {isLoading ? "Processing..." : "Register"}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-600 hover:underline font-medium">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
