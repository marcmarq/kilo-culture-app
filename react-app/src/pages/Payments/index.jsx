import React, { useState, useEffect } from "react";
import { FaMoneyBillWave, FaTrash } from "react-icons/fa";

const Payments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc"); // Default: most recent first
  const [filterType, setFilterType] = useState("all"); // Filter by payment type
  const [filterMonth, setFilterMonth] = useState("all"); // Filter by month
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Items per page

  // Fetch payments from IPC API
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await window.paymentsAPI.getPayments();
        
        if (response && response.success && Array.isArray(response.payments)) {
          setPayments(response.payments); // Set the payments array
        } else {
          throw new Error("Invalid response format from the API");
        }
      } catch (error) {
        setError("Failed to fetch payments");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  // Delete a payment using IPC API
  const handleDeletePayment = async (paymentId) => {
    try {
      const response = await window.paymentsAPI.deletePayment(paymentId);
      if (response.success) {
        setPayments((prevPayments) =>
          prevPayments.filter((payment) => payment._id !== paymentId)
        );
        alert("Payment deleted successfully!");
      } else {
        throw new Error(response.message || "Failed to delete payment");
      }
    } catch (error) {
      console.error("Error deleting payment:", error);
      alert("Failed to delete payment. Please try again.");
    }
  };

  // Filter and sort payments
  const filteredPayments = payments
    .filter((payment) => {
      const matchesSearchTerm = payment.member
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesType =
        filterType === "all" ||
        payment.type.toLowerCase() === filterType.toLowerCase();

      const paymentMonth = new Date(payment.date).toLocaleString("default", {
        month: "short",
      });
      const matchesMonth =
        filterMonth === "all" ||
        paymentMonth.toLowerCase() === filterMonth.toLowerCase();

      return matchesSearchTerm && matchesType && matchesMonth;
    })
    .sort((a, b) =>
      sortOrder === "desc"
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date)
    );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPayments = filteredPayments.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-maroon rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center py-10">
      <div className="w-full max-w-7xl px-10">
        <h1 className="text-5xl font-extrabold text-maroon text-center mb-6">
          Payments
        </h1>
        <div className="flex justify-between items-center mb-6 p-4 bg-white shadow-lg rounded-lg">
          <StatCard
            title="Total Payments"
            value={filteredPayments.length}
            icon={FaMoneyBillWave}
            color="bg-blue-100 text-white"
          />
          <div className="flex gap-4">
            <select
              className="p-3 border rounded-lg shadow-sm text-lg"
              onChange={(e) => setSortOrder(e.target.value)}
              value={sortOrder}
            >
              <option value="desc">Most Recent</option>
              <option value="asc">Oldest First</option>
            </select>
            <select
              className="p-3 border rounded-lg shadow-sm text-lg"
              onChange={(e) => setFilterType(e.target.value)}
              value={filterType}
            >
              <option value="all">All Types</option>
              <option value="annual">Annual</option>
              <option value="monthly">Monthly</option>
              <option value="walk-in">Walk-in</option>
            </select>
            <input
              type="text"
              placeholder="Search by member name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-3 border rounded-lg shadow-sm text-lg"
            />
          </div>
        </div>

        <div className="bg-white p-8 w-full rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-maroon text-center mb-6">
            Recent Payments
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-lg shadow-md text-gray-700">
              <thead>
                <tr className="bg-maroon text-white">
                  <th className="px-6 py-4 text-left">Date</th>
                  <th className="px-6 py-4 text-left">Member</th>
                  <th className="px-6 py-4 text-left">Amount (₦)</th>
                  <th className="px-6 py-4 text-left">Payment Type</th>
                  <th className="px-6 py-4 text-left">Expiry Date</th>
                  <th className="px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentPayments.map((payment, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-100 transition"
                  >
                    <td className="px-6 py-4">{payment.date}</td>
                    <td className="px-6 py-4">{payment.member}</td>
                    <td className="px-6 py-4">₦{payment.amount.toFixed(2)}</td>
                    <td className="px-6 py-4">{payment.type}</td>
                    <td className="px-6 py-4">{payment.expiry}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDeletePayment(payment._id)}
                        className="text-red-600 hover:text-red-800 transition"
                      >
                        <FaTrash className="text-xl" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center mt-6">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-maroon text-white rounded-lg disabled:bg-gray-300"
            >
              Previous
            </button>
            <span className="mx-4 text-lg font-semibold">
              Page {currentPage} of{" "}
              {Math.ceil(filteredPayments.length / itemsPerPage)}
            </span>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={
                currentPage === Math.ceil(filteredPayments.length / itemsPerPage)
              }
              className="px-4 py-2 bg-maroon text-white rounded-lg disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className={`flex items-center p-4 rounded-lg shadow-md w-60 ${color}`}>
    <Icon className="text-4xl mr-4 text-maroon" />
    <div>
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  </div>
);

export default Payments;

