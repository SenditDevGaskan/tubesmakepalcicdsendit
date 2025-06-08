import React, { useState, useEffect } from "react";
import { Package, Search, Truck, MapPin, Calendar, User, CheckCircle } from "lucide-react";
import axios from "axios";
import API_CONFIG from "../config";

const CheckResiPage = () => {
  const [resi, setResi] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users from API
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.API_ENDPOINTS.USERS}`);
        setUsers(response.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError("Failed to fetch users data");
      }
    };

    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    setResi(e.target.value);
  };

  const checkResi = async () => {
    if (!resi.trim()) return;

    setLoading(true);
    try {
      const response = await axios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.API_ENDPOINTS.ORDERS}/${resi}`);
      setResult(response.data);
      setError(null);
    } catch (err) {
      setError("Nomor resi tidak ditemukan. Silakan periksa kembali.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const getSenderName = (id_user) => {
    const user = users.find((user) => user.id_user === id_user);
    return user ? user.nama : "Tidak diketahui";
  };

  return (
    <div className="min-h-screen h-screen overflow-hidden relative bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6 ">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 -top-48 -left-48 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute w-96 h-96 -top-48 -right-48 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute w-96 h-96 -bottom-48 -left-48 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto relative h-full flex flex-col justify-center">
        <div className="backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl p-8 border border-white/20 transform transition-all duration-500 hover:shadow-blue-500/20">
          {/* Header with Animation */}
          <div className="text-center space-y-4 mb-8">
            <div className="animate-bounce-slow">
              <Package className="w-16 h-16 mx-auto text-white" />
            </div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 animate-gradient">Sendit Package Tracker</h1>
            <p className="text-gray-300 animate-fade-in">Masukkan nomor resi untuk melacak paket Anda</p>
          </div>

          {/* Search Input with Glow Effect */}
          <div className="relative mb-8 transform transition-all duration-300 hover:scale-[1.01]">
            <input
              type="text"
              value={resi}
              onChange={handleInputChange}
              placeholder="Masukkan nomor resi"
              className="w-full px-4 py-4 pl-12 rounded-xl bg-white/10 border border-white/20 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 transition-all duration-300 text-white placeholder-gray-400 backdrop-blur-sm"
            />
            <Search className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
            <button
              onClick={checkResi}
              disabled={loading}
              className="absolute right-2 top-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition-all duration-300 disabled:opacity-50 transform hover:scale-105 focus:ring-2 focus:ring-purple-400"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mencari...
                </span>
              ) : (
                "Lacak"
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-center mb-6 animate-fade-in">{error}</div>}

          {/* Results with Fade In Animation */}
          {result && (
            <div className="space-y-6 animate-fade-in">
              {/* Status Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StatusCard icon={<CheckCircle className="w-6 h-6 text-emerald-400" />} title="Status" value={result.status} />
                <StatusCard
                  icon={<Calendar className="w-6 h-6 text-blue-400" />}
                  title="Tanggal Pengiriman"
                  value={new Date(result.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                />
              </div>

              {/* Shipping Details */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 space-y-4 border border-white/20">
                <InfoRow icon={<User className="w-6 h-6 text-purple-400" />} title="Pengirim" value={getSenderName(result.id_user)} />
                <InfoRow icon={<Truck className="w-6 h-6 text-pink-400" />} title="Penerima" value={result.nama_penerima} />
                <InfoRow icon={<MapPin className="w-6 h-6 text-blue-400" />} title="Alamat Pengiriman" value={result.lokasi_tujuan} />
                <InfoRow icon={<MapPin className="w-6 h-6 text-blue-400" />} title="Up to Date Alamat" value={result.updated_lokasi} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CSS for Animations */}
      <style jsx>{`
        html,
        body {
          margin: 0;
          overflow: hidden;
          height: 100%;
        }
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 15s ease infinite;
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

const StatusCard = ({ icon, title, value }) => (
  <div className="p-4 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 transform transition-all duration-300 hover:scale-[1.02]">
    <div className="flex items-center space-x-3">
      {icon}
      <div>
        <p className="text-sm text-gray-300">{title}</p>
        <p className="font-semibold text-white">{value}</p>
      </div>
    </div>
  </div>
);

const InfoRow = ({ icon, title, value }) => (
  <div className="flex items-start space-x-4 transform transition-all duration-300 hover:translate-x-2">
    {icon}
    <div>
      <p className="text-sm text-gray-300">{title}</p>
      <p className="font-medium text-white">{value}</p>
    </div>
  </div>
);

export default CheckResiPage;
