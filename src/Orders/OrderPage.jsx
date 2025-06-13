import React, { useState, useEffect } from "react";
import axios from "axios";
import { PencilIcon, TrashIcon, PlusIcon, CheckIcon, XMarkIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import API_CONFIG from "../config";

const statusColors = {
  "On Progress": "bg-yellow-100 text-yellow-800",
  "Completed": "bg-green-100 text-green-800",
  "Cancelled": "bg-red-100 text-red-800",
};

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState({
    id_user: "",
    jarak: "",
    lokasi_jemput: "",
    lokasi_tujuan: "",
    status: "On Progress",
    nama_penerima: "",
    id_kurir: "",
    no_hp_penerima: "",
    jenis_paket: "",
    keterangan: "",
    nama_pengirim: "",
    no_hp_pengirim: "",
    total_harga: "",
    metode_pembayaran: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.API_ENDPOINTS.ORDERS}`);
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch orders");
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle input changes for new order
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOrder((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add new order
  const addOrder = async () => {
    try {
      const response = await axios.post(`${API_CONFIG.BASE_URL}${API_CONFIG.API_ENDPOINTS.ORDERS}`, newOrder);
      setOrders([...orders, response.data]);
      setNewOrder({
        id_user: "",
        jarak: "",
        lokasi_jemput: "",
        lokasi_tujuan: "",
        status: "On Progress",
        nama_penerima: "",
        id_kurir: "",
        no_hp_penerima: "",
        jenis_paket: "",
        keterangan: "",
        nama_pengirim: "",
        no_hp_pengirim: "",
        total_harga: "",
        metode_pembayaran: "",
      });
      setSuccess("Order berhasil ditambahkan");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Gagal menambahkan order");
      setTimeout(() => setError(null), 3000);
    }
  };

  // Clear form
  const clearForm = () => {
    setNewOrder({
      id_user: "",
      jarak: "",
      lokasi_jemput: "",
      lokasi_tujuan: "",
      status: "On Progress",
      nama_penerima: "",
      id_kurir: "",
      no_hp_penerima: "",
      jenis_paket: "",
      keterangan: "",
      nama_pengirim: "",
      no_hp_pengirim: "",
      total_harga: "",
      metode_pembayaran: "",
    });
  };

  const openEditModal = (order) => {
    setEditForm({
      id_pemesanan: order.id_pemesanan,
      id_user: order.id_user,
      jarak: order.jarak.toString(),
      lokasi_jemput: order.lokasi_jemput,
      lokasi_tujuan: order.lokasi_tujuan,
      status: order.status,
      nama_penerima: order.nama_penerima,
      id_kurir: order.id_kurir.toString(),
      no_hp_penerima: order.no_hp_penerima,
      jenis_paket: order.jenis_paket,
      keterangan: order.keterangan,
      nama_pengirim: order.nama_pengirim,
      no_hp_pengirim: order.no_hp_pengirim,
      total_harga: order.total_harga,
      metode_pembayaran: order.metode_pembayaran,
    });
    setShowEditModal(true);
    setError(null);
    setSuccess(null);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditForm({});
    setError(null);
    setSuccess(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveEditOrder = async () => {
    try {
      const response = await axios.put(
        `${API_CONFIG.BASE_URL}${API_CONFIG.API_ENDPOINTS.ORDERS}/${editForm.id_pemesanan}`,
        editForm
      );
      setOrders(orders.map((order) => (order.id_pemesanan === editForm.id_pemesanan ? response.data : order)));
      setSuccess("Order berhasil diperbarui");
      setTimeout(() => {
        setSuccess(null);
        setShowEditModal(false);
        setEditForm({});
      }, 2000);
    } catch (err) {
      setError("Gagal memperbarui order");
      setTimeout(() => setError(null), 3000);
    }
  };

  // Delete order
  const deleteOrder = async (id) => {
    try {
      await axios.delete(`${API_CONFIG.BASE_URL}${API_CONFIG.API_ENDPOINTS.ORDERS}/${id}`);
      setOrders(orders.filter((order) => order.id_pemesanan !== id));
      setSuccess("Order berhasil dihapus");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Gagal menghapus order");
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <PlusIcon className="h-8 w-8 text-blue-600 mr-2" />
          <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>
        </div>
        <p className="mb-6 text-gray-500">Kelola data pemesanan dengan mudah dan cepat.</p>

        {/* Success & Error Notifications */}
        {!showEditModal && success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
            <span className="block sm:inline">{success}</span>
          </div>
        )}
        {!showEditModal && error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Order Form */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
              <input type="text" name="id_user" value={newOrder.id_user} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jarak (km)</label>
              <input type="number" name="jarak" value={newOrder.jarak} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi Jemput</label>
              <input type="text" name="lokasi_jemput" value={newOrder.lokasi_jemput} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi Tujuan</label>
              <input type="text" name="lokasi_tujuan" value={newOrder.lokasi_tujuan} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select name="status" value={newOrder.status} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="On Progress">On Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Penerima</label>
              <input type="text" name="nama_penerima" value={newOrder.nama_penerima} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID Kurir</label>
              <input type="text" name="id_kurir" value={newOrder.id_kurir} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">No HP Penerima</label>
              <input type="text" name="no_hp_penerima" value={newOrder.no_hp_penerima} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Paket</label>
              <select name="jenis_paket" value={newOrder.jenis_paket} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Pilih Jenis</option>
                <option value="Dokumen">Dokumen</option>
                <option value="Paket">Paket</option>
                <option value="Makanan">Makanan</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
              <input type="text" name="keterangan" value={newOrder.keterangan} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pengirim</label>
              <input type="text" name="nama_pengirim" value={newOrder.nama_pengirim} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">No HP Pengirim</label>
              <input type="text" name="no_hp_pengirim" value={newOrder.no_hp_pengirim} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Harga</label>
              <input type="number" name="total_harga" value={newOrder.total_harga} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Metode Pembayaran</label>
              <select name="metode_pembayaran" value={newOrder.metode_pembayaran} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Pilih Metode</option>
                <option value="Cash">Cash</option>
                <option value="Transfer">Transfer</option>
                <option value="QRIS">QRIS</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <button onClick={addOrder} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold flex items-center gap-2 disabled:opacity-60">
              <PlusIcon className="h-5 w-5" /> Tambah
            </button>
            <button onClick={clearForm} type="button" className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md font-semibold flex items-center gap-2">
              <ArrowPathIcon className="h-5 w-5" /> Reset
            </button>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
          </div>
        )}

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pengirim</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penerima</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Paket</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jarak</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi Jemput</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi Tujuan</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Harga</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pembayaran</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id_pemesanan} className="hover:bg-blue-50 transition">
                  <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-900">{order.id_pemesanan}</td>
                  <td className="px-4 py-2">
                    <div className="text-sm font-medium text-gray-900">{order.nama_pengirim}</div>
                    <div className="text-sm text-gray-500">{order.no_hp_pengirim}</div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="text-sm font-medium text-gray-900">{order.nama_penerima}</div>
                    <div className="text-sm text-gray-500">{order.no_hp_penerima}</div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {order.jenis_paket || 'Tidak Diketahui'}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{order.jarak} km</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{order.lokasi_jemput}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{order.lokasi_tujuan}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                    Rp {order.total_harga ? Number(order.total_harga).toLocaleString('id-ID') : '0'}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {order.metode_pembayaran || 'Belum Dipilih'}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] || "bg-gray-100 text-gray-800"}`}>{order.status}</span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap flex gap-2">
                    <button onClick={() => openEditModal(order)} className="text-blue-600 hover:text-blue-900"><PencilIcon className="h-5 w-5" /></button>
                    <button onClick={() => window.confirm('Yakin hapus order ini?') && deleteOrder(order.id_pemesanan)} className="text-red-600 hover:text-red-900"><TrashIcon className="h-5 w-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
              <button onClick={closeEditModal} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700">
                <XMarkIcon className="h-6 w-6" />
              </button>
              <h2 className="text-2xl font-bold mb-4">Edit Order</h2>

              {/* Modal Success & Error Notifications */}
              {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
                  <span className="block sm:inline">{success}</span>
                </div>
              )}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                  <input type="text" name="id_user" value={editForm.id_user} onChange={handleEditChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jarak (km)</label>
                  <input type="number" name="jarak" value={editForm.jarak} onChange={handleEditChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi Jemput</label>
                  <input type="text" name="lokasi_jemput" value={editForm.lokasi_jemput} onChange={handleEditChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi Tujuan</label>
                  <input type="text" name="lokasi_tujuan" value={editForm.lokasi_tujuan} onChange={handleEditChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select name="status" value={editForm.status} onChange={handleEditChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="On Progress">On Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Penerima</label>
                  <input type="text" name="nama_penerima" value={editForm.nama_penerima} onChange={handleEditChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID Kurir</label>
                  <input type="text" name="id_kurir" value={editForm.id_kurir} onChange={handleEditChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">No HP Penerima</label>
                  <input type="text" name="no_hp_penerima" value={editForm.no_hp_penerima} onChange={handleEditChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Paket</label>
                  <select name="jenis_paket" value={editForm.jenis_paket} onChange={handleEditChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Pilih Jenis</option>
                    <option value="Dokumen">Dokumen</option>
                    <option value="Paket">Paket</option>
                    <option value="Makanan">Makanan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                  <input type="text" name="keterangan" value={editForm.keterangan} onChange={handleEditChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pengirim</label>
                  <input type="text" name="nama_pengirim" value={editForm.nama_pengirim} onChange={handleEditChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">No HP Pengirim</label>
                  <input type="text" name="no_hp_pengirim" value={editForm.no_hp_pengirim} onChange={handleEditChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Harga</label>
                  <input type="number" name="total_harga" value={editForm.total_harga} readOnly className="w-full px-3 py-2 border border-gray-200 bg-gray-100 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Metode Pembayaran</label>
                  <select name="metode_pembayaran" value={editForm.metode_pembayaran} onChange={handleEditChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Pilih Metode</option>
                    <option value="Cash">Cash</option>
                    <option value="Transfer">Transfer</option>
                    <option value="QRIS">QRIS</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button onClick={saveEditOrder} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold flex items-center gap-2">
                  <CheckIcon className="h-5 w-5" /> Simpan
                </button>
                <button onClick={closeEditModal} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md font-semibold flex items-center gap-2">
                  <XMarkIcon className="h-5 w-5" /> Batal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;
