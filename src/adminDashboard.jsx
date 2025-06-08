import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Users, ShoppingCart, DollarSign, Activity, TrendingUp, ChevronUp } from "lucide-react";
import axios from "axios";
import API_CONFIG from "./config";

const AdminDashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [users, setUsers] = useState([]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.API_ENDPOINTS.ORDERS}`);
      const revenue = response.data.reduce((acc, order) => acc + order.total_harga, 0);

      setTotalOrders(response.data.length);
      setLoading(false);
      setTotalRevenue(revenue);
    } catch (err) {
      setError("Failed to fetch orders");
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.API_ENDPOINTS.PAYMENTS}`);
      const processedData = response.data.map((payment) => ({
        name: payment.month,
        sales: payment.sales,
      }));
      setData(processedData);

      const total = response.data.reduce((acc, payment) => acc + payment.harga, 0);
      setTotalRevenue(total);

      setLoading(false);
    } catch (err) {
      setError("Failed to fetch payments");
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.API_ENDPOINTS.USERS}`);
      setUsers(response.data);
      const totalUsersCount = response.data.filter((user) => user.role === "pemesan").length;
      setTotalUsers(totalUsersCount);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch users");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
    fetchUsers();
    fetchOrders();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800">{label}</p>
          <p className="text-blue-600">Sales: {formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded animate-fade-in">
          <div className="flex">
            <div className="py-1">
              <svg className="w-6 h-6 mr-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>{error}</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={Users} title="Total  Users" value={totalUsers} trend="+5%" color="blue" />
        <StatCard icon={ShoppingCart} title="Total Orders" value={totalOrders} trend="+8.2%" color="purple" />
        <StatCard icon={DollarSign} title="Total Revenue" value={formatCurrency(totalRevenue)} trend="+15.3%" color="green" />
        <StatCard icon={Activity} title="Active Users" value="789" trend="+4.7%" color="orange" />
      </div>

      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <div className="bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Sales Overview</h2>
            <TrendingUp className="w-6 h-6 text-green-500" />
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="sales" fill="url(#colorSales)" radius={[4, 4, 0, 0]} className="animate-grow" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex items-center p-4 bg-gray-50 rounded-lg transform transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">New user registered</p>
                  <p className="text-sm text-gray-500">2 minutes ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, title, value, trend, color }) => {
  const colorClasses = {
    blue: "bg-blue-500",
    purple: "bg-purple-500",
    green: "bg-green-500",
    orange: "bg-orange-500",
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl animate-fade-in">
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-full ${colorClasses[color]} bg-opacity-10`}>
          <Icon className={`w-6 h-6 text-${color}-500`} />
        </div>
        <div className="flex items-center space-x-1">
          <ChevronUp className="w-4 h-4 text-green-500" />
          <span className="text-sm text-green-500">{trend}</span>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="mt-2 text-2xl font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

export default AdminDashboard;

{
  /* Add these styles to your global CSS or Tailwind config */
}
<style jsx global>{`
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes grow {
    from {
      transform: scaleY(0);
    }
    to {
      transform: scaleY(1);
    }
  }

  .animate-fade-in {
    animation: fade-in 0.5s ease-out forwards;
  }

  .animate-grow {
    animation: grow 1s ease-out forwards;
  }
`}</style>;
