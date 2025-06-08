import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  CreditCardIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import API_CONFIG from "../config";

const PaymentPage = () => {
  const [payments, setPayments] = useState([]);
  const [newPayment, setNewPayment] = useState({
    metode_pembayaran: "",
  });
  const [editingPayment, setEditingPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch payments from API
  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.API_ENDPOINTS.PAYMENTS}`);
      setPayments(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch payments");
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchPayments();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPayment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add new payment
  const addPayment = async () => {
    try {
      const response = await axios.post(`${API_CONFIG.BASE_URL}${API_CONFIG.API_ENDPOINTS.PAYMENTS}`, newPayment);
      setPayments([...payments, response.data]);
      setNewPayment({ metode_pembayaran: "" });
      setError(null);
    } catch (err) {
      setError("Failed to add payment");
    }
  };

  // Edit payment
  const editPayment = (payment) => {
    setEditingPayment(payment);
    setNewPayment({ metode_pembayaran: payment.metode_pembayaran });
  };

  // Save edited payment
  const savePayment = async () => {
    try {
      const response = await axios.put(
        `${API_CONFIG.BASE_URL}${API_CONFIG.API_ENDPOINTS.PAYMENTS}/${editingPayment.id_payment}`,
        newPayment
      );
      setPayments(
        payments.map((payment) =>
          payment.id_payment === editingPayment.id_payment
            ? response.data
            : payment
        )
      );
      setEditingPayment(null);
      setNewPayment({ metode_pembayaran: "" });
      setError(null);
    } catch (err) {
      setError("Failed to update payment");
    }
  };

  // Delete payment
  const deletePayment = async (id) => {
    try {
      await axios.delete(`${API_CONFIG.BASE_URL}${API_CONFIG.API_ENDPOINTS.PAYMENTS}/${id}`);
      setPayments(payments.filter((payment) => payment.id_payment !== id));
      setError(null);
    } catch (err) {
      setError("Failed to delete payment");
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingPayment(null);
    setNewPayment({ metode_pembayaran: "" });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Page Header */}
        <div className="bg-gray-100 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <CreditCardIcon className="h-8 w-8 mr-3 text-blue-600" />
            Payment Methods
          </h1>
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
            <button
              onClick={() => setError(null)}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Payment Input Form */}
        <div className="p-6">
          <div className="flex gap-4">
            <input
              type="text"
              name="metode_pembayaran"
              placeholder="Payment Method"
              value={newPayment.metode_pembayaran}
              onChange={handleInputChange}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={editingPayment ? savePayment : addPayment}
              className={`px-4 py-2 rounded flex items-center ${
                editingPayment
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white transition-colors`}
            >
              {editingPayment ? (
                <>
                  <CheckIcon className="h-5 w-5 mr-2" />
                  Save Changes
                </>
              ) : (
                <>
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add Payment
                </>
              )}
            </button>
            {editingPayment && (
              <button
                onClick={cancelEditing}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded flex items-center transition-colors"
              >
                <XMarkIcon className="h-5 w-5 mr-2" />
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Payments Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan="3"
                    className="text-center py-4 text-gray-500"
                  >
                    Loading payments...
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    className="text-center py-4 text-gray-500"
                  >
                    No payments found
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr
                    key={payment.id_payment}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {payment.id_payment}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {payment.metode_pembayaran}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => editPayment(payment)}
                        className="text-yellow-500 hover:text-yellow-600 mr-3"
                        title="Edit"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => deletePayment(payment.id_payment)}
                        className="text-red-500 hover:text-red-600"
                        title="Delete"
                      >
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

export default PaymentPage;
