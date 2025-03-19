import React, { useState, useEffect, useRef } from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import MemberForm from "./MemberForm";

const MemberList = () => {
  const [membershipData, setMembershipData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    membershipExpiryDate: "",
    membershipRenewal: "",
    membershipType: "",
    notes1: "",
    length: "",
  });

  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const formRef = useRef(null);

  // ✅ Fetch members on component mount
  useEffect(() => {
    window.membersAPI.getMembers()
      .then((data) => setMembershipData(data))
      .catch((error) => {
        console.error("Failed to fetch members:", error);
        setMembershipData([]);
      });
  }, []);

  // ✅ Edit member
  const handleEdit = (member) => {
    setIsEditMode(true);
    setShowForm(true);
    setFormData(member);
  };

  // ✅ Delete member
  const handleDelete = (member) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;
    
    window.membersAPI.deleteMember(member.id)
      .then(() => {
        setMembershipData(membershipData.filter(m => m.id !== member.id));
      })
      .catch((error) => console.error("Failed to delete member:", error));
  };

  // ✅ Handle form submission (Add / Update)
  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (isEditMode) {
      window.membersAPI.updateMember(formData.id, formData)
        .then((updatedMember) => {
          setMembershipData(membershipData.map(m => (m.id === updatedMember.id ? updatedMember : m)));
          setShowForm(false);
        })
        .catch((error) => console.error("Failed to update member:", error));
    } else {
      window.membersAPI.addMember(formData)
        .then((newMember) => {
          setMembershipData([...membershipData, newMember]);
          setShowForm(false);
        })
        .catch((error) => console.error("Failed to add member:", error));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-full mx-auto mt-6">
      <h1 className="text-3xl font-bold text-maroon text-center mb-6">
        Member Dashboard
      </h1>

      {/* 🔍 Search & Register Button */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => { setIsEditMode(false); setShowForm(true); }}
          className="bg-maroon text-white rounded-md px-4 py-2"
        >
          Register
        </button>
        <input
          type="text"
          placeholder="Search Members"
          className="p-2 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* 📝 Member Form Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
          <div ref={formRef} className="bg-[#2C3E50] p-4 rounded-lg shadow-md max-w-md w-full mx-auto">
            <MemberForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleFormSubmit}
              isEditMode={isEditMode}
            />
          </div>
        </div>
      )}

      {/* 📋 Members Table */}
      <div className="relative overflow-x-auto shadow-lg border border-gray-200 rounded-lg max-h-[510px] overflow-y-auto">
        <table className="w-full border-collapse text-sm table-fixed">
          <thead className="sticky top-0 bg-white z-10">
            <tr className="text-center">
              <th className="p-2">Name</th>
              <th className="p-2">Membership Expiry</th>
              <th className="p-2">Membership Renewal</th>
              <th className="p-2">Membership Type</th>
              <th className="p-2">Notes</th>
              <th className="p-2">Length</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {membershipData.filter(member =>
              `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
            ).map((member, index) => (
              <tr key={index} className="border-b last:border-b-0 text-center">
                <td className="p-2 text-left">{member.firstName} {member.lastName}</td>
                <td className="p-2">{new Date(member.membershipExpiryDate).toLocaleDateString()}</td>
                <td className="p-2">{new Date(member.membershipRenewal).toLocaleDateString()}</td>
                <td className="p-2">{member.membershipType}</td>
                <td className="p-2">{member.notes1}</td>
                <td className="p-2">{member.length}</td>
                <td className="p-2 flex justify-center items-center">
                  <button onClick={() => handleEdit(member)} className="text-yellow-500 text-sm mr-2">
                    <MdEdit size="1.5em" />
                  </button>
                  <button onClick={() => handleDelete(member)} className="text-red-500 text-sm">
                    <MdDelete size="1.5em" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MemberList;

