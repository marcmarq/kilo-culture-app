import React, { useState, useEffect } from "react";
import { FaMoneyBillWave, FaTrash } from "react-icons/fa";

const Members = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc"); // Default: most recent first
  const [filterType, setFilterType] = useState("all"); // Filter by membership type
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Items per page

  // Fetch members from IPC API
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await window.membersAPI.getMembers();
        
        if (response && response.success && Array.isArray(response.members)) {
          setMembers(response.members); // Correctly access the 'members' array
        } else {
          throw new Error("Invalid response format from the API");
        }
      } catch (error) {
        setError("Failed to fetch members");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // Delete a member using IPC API
  const handleDeleteMember = async (memberId) => {
    try {
      const response = await window.membersAPI.deleteMember(memberId);
      if (response.success) {
        setMembers((prevMembers) =>
          prevMembers.filter((member) => member.id !== memberId)
        );
        alert("Member deleted successfully!");
      } else {
        throw new Error(response.message || "Failed to delete member");
      }
    } catch (error) {
      console.error("Error deleting member:", error);
      alert("Failed to delete member. Please try again.");
    }
  };

  // Filter and sort members
  const filteredMembers = members
    .filter((member) => {
      const matchesSearchTerm =
        member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.lastName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType =
        filterType === "all" || member.membershipType.toLowerCase() === filterType.toLowerCase();

      return matchesSearchTerm && matchesType;
    })
    .sort((a, b) =>
      sortOrder === "desc"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMembers = filteredMembers.slice(indexOfFirstItem, indexOfLastItem);

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
          Members
        </h1>
        <div className="flex justify-between items-center mb-6 p-4 bg-white shadow-lg rounded-lg">
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
            Member List
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-lg shadow-md text-gray-700">
              <thead>
                <tr className="bg-maroon text-white">
                  <th className="px-6 py-4 text-left">Name</th>
                  <th className="px-6 py-4 text-left">Membership Type</th>
                  <th className="px-6 py-4 text-left">Expiry Date</th>
                  <th className="px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentMembers.map((member, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-100 transition"
                  >
                    <td className="px-6 py-4">{`${member.firstName} ${member.lastName}`}</td>
                    <td className="px-6 py-4">{member.membershipType}</td>
                    <td className="px-6 py-4">{member.membershipExpiryDate}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDeleteMember(member.id)}
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
              {Math.ceil(filteredMembers.length / itemsPerPage)}
            </span>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={
                currentPage === Math.ceil(filteredMembers.length / itemsPerPage)
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

export default Members;

