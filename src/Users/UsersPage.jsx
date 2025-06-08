import React, { useState, useEffect } from "react";
import axios from "axios";
import { UserIcon, PencilIcon, TrashIcon, PlusIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import API_CONFIG from "../config";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    nama: "",
    alamat: "",
    no_hp: "",
    email: "",
    username: "",
    role: "",
    password: "",
  });
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.API_ENDPOINTS.USERS}`);
      setUsers(response.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add new user
  const addUser = async () => {
    try {
      const response = await axios.post(`${API_CONFIG.BASE_URL}${API_CONFIG.API_ENDPOINTS.USERS}`, newUser);
      setUsers([...users, response.data]);
      setNewUser({
        nama: "",
        alamat: "",
        no_hp: "",
        email: "",
        username: "",
        role: "",
        password: "",
      });
      setError(null);
    } catch (err) {
      console.error("Failed to add user:", err);
      setError(err.response?.data?.message || "Failed to add user");
    }
  };

  // Edit user
  const editUser = (user) => {
    setEditingUser(user);
    setNewUser({
      nama: user.nama,
      alamat: user.alamat,
      no_hp: user.no_hp,
      email: user.email,
      username: user.username,
      role: user.role,
      password: "",
    });
  };

  // Save edited user
  const saveUser = async () => {
    try {
      const response = await axios.put(
        `${API_CONFIG.BASE_URL}${API_CONFIG.API_ENDPOINTS.USERS}/${editingUser.id_user}`,
        newUser
      );
      setUsers(
        users.map((user) =>
          user.id_user === editingUser.id_user ? response.data : user
        )
      );
      setEditingUser(null);
      setNewUser({
        nama: "",
        alamat: "",
        no_hp: "",
        email: "",
        username: "",
        role: "",
        password: "",
      });
      setError(null);
    } catch (err) {
      console.error("Failed to update user:", err);
      setError(err.response?.data?.message || "Failed to update user");
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    try {
      await axios.delete(`${API_CONFIG.BASE_URL}${API_CONFIG.API_ENDPOINTS.USERS}/${id}`);
      setUsers(users.filter((user) => user.id_user !== id));
      setError(null);
    } catch (err) {
      console.error("Failed to delete user:", err);
      setError(err.response?.data?.message || "Failed to delete user");
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingUser(null);
    setNewUser({
      nama: "",
      alamat: "",
      no_hp: "",
      email: "",
      username: "",
      role: "",
      password: "",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Page Header */}
        <div className="bg-gray-100 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <UserIcon className="h-8 w-8 mr-3 text-blue-600" />
            User Management
          </h1>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* User Input Form */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input type="text" name="nama" placeholder="Full Name" value={newUser.nama} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={newUser.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={newUser.username}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input type="text" name="alamat" placeholder="Address" value={newUser.alamat} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="tel" name="no_hp" placeholder="Phone Number" value={newUser.no_hp} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <select name="role" value={newUser.role} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select Role</option>
              <option value="pemesan">Pemesan</option>
              <option value="kurir">Kurir</option>
              <option value="admin">Admin</option>
            </select>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={newUser.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mt-4 flex space-x-2">
            <button onClick={editingUser ? saveUser : addUser} className={`px-4 py-2 rounded flex items-center ${editingUser ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"} text-white transition-colors`}>
              {editingUser ? (
                <>
                  <CheckIcon className="h-5 w-5 mr-2" />
                  Save Changes
                </>
              ) : (
                <>
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add User
                </>
              )}
            </button>
            {editingUser && (
              <button onClick={cancelEditing} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded flex items-center transition-colors">
                <XMarkIcon className="h-5 w-5 mr-2" />
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID USER</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id_user} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{user.id_user}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.nama}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.alamat}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.no_hp}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs ${user.role === "admin" ? "bg-green-100 text-green-800" : user.role === "kurir" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}>{user.role}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button onClick={() => editUser(user)} className="text-yellow-500 hover:text-yellow-600 mr-3" title="Edit">
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button onClick={() => deleteUser(user.id_user)} className="text-red-500 hover:text-red-600" title="Delete">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
