import React, { useState, useEffect } from "react";
import { FaUsers, FaExclamationCircle, FaHourglass } from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const PAYMENT_TYPES = {
  ANNUAL: "annual",
  MONTHLY: "monthly",
  WALK_IN: "walk-in",
};

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

const Dashboard = () => {
  const [membershipData, setMembershipData] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStat, setSelectedStat] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [revenueData, setRevenueData] = useState(Array(12).fill({ month: "", revenue: 0 }));

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

const fetchRevenueData = async () => {
  try {
    const paymentsResponse = await window.paymentsAPI.getPayments(); // IPC call

    // Check if 'payments' is available in the response and it's an object
    if (!paymentsResponse.success || !paymentsResponse.payments || typeof paymentsResponse.payments !== 'object') {
      throw new Error("Payments data is not in the expected format");
    }

    const payments = Object.values(paymentsResponse.payments); // Extract payment values if it's an object

    const monthlyRevenue = Array(12).fill(0); // Initialize revenue array for 12 months

    // Process each payment and accumulate revenue per month
    payments.forEach((payment) => {
      const monthIndex = new Date(payment.date).getMonth(); // Get month index (0-11)
      monthlyRevenue[monthIndex] += payment.amount; // Accumulate the revenue for the month
    });

    // Update the revenue data state for the chart
    setRevenueData(
      monthlyRevenue.map((revenue, index) => ({
        month: new Date(2024, index).toLocaleString("default", { month: "short" }),
        revenue: revenue || 0,
      }))
    );
  } catch (error) {
    console.error("Error fetching revenue data:", error);
  }
};



  const fetchMembershipData = async () => {
    try {
      const response = await window.membersAPI.getMembers(); // IPC call
      if (response.success && response.members) {
        const member = response.members; // Assuming it's an object now

        // Convert object values to array if necessary
        const normalizedData = Object.values(member).map((memberData) => ({
          id: memberData.id,
          firstName: memberData.firstName || "N/A",
          lastName: memberData.lastName || "N/A",
          membershipExpiryDate: memberData.membershipExpiryDate || "",
          membershipRenewal: memberData.membershipRenewal || "",
          annualMembership: memberData.annualMembership || "No",
          notes1: memberData.notes1 || "None",
          notes2: memberData.notes2 || "None",
          notes3: memberData.notes3 || "None",
        }));

        setMembershipData(normalizedData);

        const today = new Date();
        const overdueMembers = normalizedData.filter((m) => new Date(m.membershipExpiryDate) < today).length;
        const expiringSoonMembers = normalizedData.filter((m) => {
          const expiryDate = new Date(m.membershipExpiryDate);
          return expiryDate >= today && expiryDate < new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        }).length;

        setDashboardStats({
          totalMembers: normalizedData.length,
          overdueMembers,
          expiringSoonMembers,
        });
      }
    } catch (error) {
      console.error("Error fetching membership info:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembershipData();
    fetchRevenueData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-center text-4xl font-bold mb-4 text-red-950">Dashboard Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Members" value={dashboardStats?.totalMembers || 0} icon={FaUsers} onClick={() => setShowPopup(true)} loading={loading} />
        <StatCard title="Overdue Members" value={dashboardStats?.overdueMembers || 0} icon={FaExclamationCircle} loading={loading} />
        <StatCard title="Expiring Soon" value={dashboardStats?.expiringSoonMembers || 0} icon={FaHourglass} loading={loading} />
      </div>
      <div className="mt-8 bg-white shadow-lg p-6 rounded-lg w-full">
        <h2 className="text-center text-xl font-semibold mb-4 text-red-950">Monthly Revenue</h2>
        <ResponsiveContainer width="100%" height={290}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#AA0000" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// StatCard component
const StatCard = ({ title, value, icon: Icon, loading }) => {
  return (
    <motion.div whileHover={{ scale: 1.05 }} className="p-6 rounded-lg shadow-md bg-white">
      <div className="flex items-center space-x-4">
        <Icon className="text-4xl text-red-900" />
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {loading ? <div className="w-6 h-6 border-4 border-gray-300 border-t-red-900 rounded-full animate-spin"></div> : <p className="text-2xl font-bold">{value}</p>}
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;

