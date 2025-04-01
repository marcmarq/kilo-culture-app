import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaExclamationCircle,
  FaHourglass,
  FaTimes,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";

const dummyMembers = [
  { name: "John Doe", membershipExpiryDate: "2024-03-25" },
  { name: "Jane Smith", membershipExpiryDate: "2024-04-02" },
  { name: "Alice Johnson", membershipExpiryDate: "2024-03-20" },
  { name: "Bob Brown", membershipExpiryDate: "2024-04-05" },
  { name: "Charlie Davis", membershipExpiryDate: "2024-03-28" },
];

const Dashboard = () => {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState(
    Array(12).fill({ month: "", revenue: 0 })
  );
  const [selectedStat, setSelectedStat] = useState(null);
  const [membersList, setMembersList] = useState([]);

  useEffect(() => {
    const today = new Date();
    const overdue = dummyMembers.filter(
      (m) => new Date(m.membershipExpiryDate) < today
    );
    const expiringSoon = dummyMembers.filter((m) => {
      const expiryDate = new Date(m.membershipExpiryDate);
      return (
        expiryDate >= today &&
        expiryDate < new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
      );
    });

    setDashboardStats({
      totalMembers: dummyMembers.length,
      overdueMembers: overdue.length,
      expiringSoonMembers: expiringSoon.length,
    });
    setLoading(false);

    setRevenueData(
      Array.from({ length: 12 }, (_, index) => ({
        month: new Date(2024, index).toLocaleString("default", {
          month: "short",
        }),
        revenue: Math.floor(Math.random() * 5000) + 1000,
      }))
    );
  }, []);

  const handleStatClick = (statType, members) => {
    setSelectedStat(statType);
    setMembersList(members);
  };

  return (
    <div className="p-4 md:p-6 w-full min-h-screen flex flex-col relative">
      <h1 className="text-center text-2xl md:text-4xl font-bold mb-4 text-red-950">
        Dashboard Overview
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        <StatCard
          title="Total Members"
          value={dashboardStats?.totalMembers || 0}
          icon={FaUsers}
          loading={loading}
        />
        <StatCard
          title="Overdue Members"
          value={dashboardStats?.overdueMembers || 0}
          icon={FaExclamationCircle}
          loading={loading}
          onClick={() =>
            handleStatClick(
              "Overdue Members",
              dummyMembers.filter(
                (m) => new Date(m.membershipExpiryDate) < new Date()
              )
            )
          }
        />
        <StatCard
          title="Expiring Soon"
          value={dashboardStats?.expiringSoonMembers || 0}
          icon={FaHourglass}
          loading={loading}
          onClick={() =>
            handleStatClick(
              "Expiring Soon",
              dummyMembers.filter((m) => {
                const expiryDate = new Date(m.membershipExpiryDate);
                return (
                  expiryDate >= new Date() &&
                  expiryDate <
                    new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
                );
              })
            )
          }
        />
      </div>

      <div className="mt-8 bg-white shadow-lg p-6 rounded-lg w-full">
        <h2 className="text-center text-lg md:text-xl font-semibold mb-4 text-red-950">
          Monthly Revenue
        </h2>
        <ResponsiveContainer
          width="100%"
          height={300}
          minWidth={300}
          minHeight={200}
        >
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#AA0000"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <AnimatePresence>
        {selectedStat && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-white p-4 shadow-lg rounded-lg w-80 max-h-96 overflow-auto"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">{selectedStat}</h3>
              <FaTimes
                className="cursor-pointer"
                onClick={() => setSelectedStat(null)}
              />
            </div>
            {membersList.length === 0 ? (
              <p className="text-gray-500">No members found</p>
            ) : (
              <ul className="space-y-2">
                {membersList.map((member, index) => (
                  <li key={index} className="p-2 border-b">
                    <strong>{member.name}</strong> - Expiry:{" "}
                    {new Date(member.membershipExpiryDate).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, loading, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="p-4 md:p-6 rounded-lg shadow-md bg-white w-full cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center space-x-4">
        <Icon className="text-3xl md:text-4xl text-red-900" />
        <div>
          <h2 className="text-sm md:text-lg font-semibold">{title}</h2>
          {loading ? (
            <div className="w-6 h-6 border-4 border-gray-300 border-t-red-900 rounded-full animate-spin"></div>
          ) : (
            <p className="text-xl md:text-2xl font-bold">{value}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
