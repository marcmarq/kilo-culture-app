import React, { useState, useEffect } from "react";
import { FaMoneyBillWave, FaTrash } from "react-icons/fa";

const Payments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc"); // Default to "desc" for most recent first
  const [filterType, setFilterType] = useState("all"); // Filter by payment type
  const [filterMonth, setFilterMonth] = useState("all"); // Filter by month
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [itemsPerPage, setItemsPerPage] = useState(10); // Number of items per page
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  // Fetch payments from the backend
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/payments/payments`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setPayments(data);
        } else {
          throw new Error("Failed to fetch payments");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [backendUrl]);

  // Delete a payment
  const handleDeletePayment = async (paymentId) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/payments/payments/${paymentId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        // Remove the deleted payment from the state
        setPayments((prevPayments) =>
          prevPayments.filter((payment) => payment._id !== paymentId)
        );
        alert("Payment deleted successfully!");
      } else {
        throw new Error("Failed to delete payment");
      }
    } catch (error) {
      console.error("Error deleting payment:", error);
      alert("Failed to delete payment. Please try again.");
    }
  };

  // Filter and sort payments
  const filteredPayments = payments
    .filter((payment) => {
      // Filter by member name
      const matchesSearchTerm = payment.member
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // Filter by payment type
      const matchesType =
        filterType === "all" ||
        payment.type.toLowerCase() === filterType.toLowerCase();

      // Filter by month
      const paymentMonth = new Date(payment.date).toLocaleString("default", {
        month: "short",
      });
      const matchesMonth =
        filterMonth === "all" ||
        paymentMonth.toLowerCase() === filterMonth.toLowerCase();

      return matchesSearchTerm && matchesType && matchesMonth;
    })
    .sort(
      (a, b) =>
        sortOrder === "desc"
          ? new Date(b.date) - new Date(a.date) // Most recent first
          : new Date(a.date) - new Date(b.date) // Oldest first
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
      <div className="bg-gray-50 min-h-screen w-full flex flex-col items-center justify-center py-10">
        <div className="w-full max-w-7xl px-10">
          <div className="flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-maroon rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen w-full flex flex-col items-center justify-center py-10">
        <div className="w-full max-w-7xl px-10">
          <div className="text-center text-red-600 text-xl font-bold">
            Error: {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen w-full flex flex-col items-center py-10">
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
              className="p-3 border rounded-lg shadow-sm text-lg bg-white focus:outline-none focus:ring-2 focus:ring-maroon"
              onChange={(e) => setSortOrder(e.target.value)}
              value={sortOrder}
            >
              <option value="desc">Most Recent</option>
              <option value="asc">Oldest First</option>
            </select>
            <select
              className="p-3 border rounded-lg shadow-sm text-lg bg-white focus:outline-none focus:ring-2 focus:ring-maroon"
              onChange={(e) => setFilterType(e.target.value)}
              value={filterType}
            >
              <option value="all">All Types</option>
              <option value="annual">Annual</option>
              <option value="monthly">Monthly</option>
              <option value="walk-in">Walk-in</option>
            </select>
            <select
              className="p-3 border rounded-lg shadow-sm text-lg bg-white focus:outline-none focus:ring-2 focus:ring-maroon"
              onChange={(e) => setFilterMonth(e.target.value)}
              value={filterMonth}
            >
              <option value="all">All Months</option>
              <option value="Jan">January</option>
              <option value="Feb">February</option>
              <option value="Mar">March</option>
              <option value="Apr">April</option>
              <option value="May">May</option>
              <option value="Jun">June</option>
              <option value="Jul">July</option>
              <option value="Aug">August</option>
              <option value="Sep">September</option>
              <option value="Oct">October</option>
              <option value="Nov">November</option>
              <option value="Dec">December</option>
            </select>
            <input
              type="text"
              placeholder="Search by member name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-3 w-72 border rounded-lg shadow-sm text-lg bg-white focus:outline-none focus:ring-2 focus:ring-maroon"
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
                  <th className="px-6 py-4 text-left">Amount (₱)</th>
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
                    <td className="px-6 py-4 font-bold">{payment.date}</td>
                    <td className="px-6 py-4">{payment.member}</td>
                    <td className="px-6 py-4 font-semibold">
                      ₱{payment.amount.toFixed(2)}
                    </td>
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
              className="px-4 py-2 bg-maroon text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
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
                currentPage ===
                Math.ceil(filteredPayments.length / itemsPerPage)
              }
              className="px-4 py-2 bg-maroon text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
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
      <p className="text-sm font-medium text-black">{title}</p>
      <p className="text-xl font-bold text-black">{value}</p>
    </div>
  </div>
);

export default Payments;
