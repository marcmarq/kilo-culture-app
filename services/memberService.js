const { dbPromise } = require("../database/db.js");

// Add new member
const addMember = async (member) => {
  const db = await dbPromise;
  const { firstName, lastName, membershipExpiryDate, membershipRenewal, membershipType, annualMembership, notes1, notes2, notes3, length } = member;

  const createdAt = new Date().toISOString();
  const updatedAt = createdAt; // New members should have the same created & updated timestamp

  await db.run(
    "INSERT INTO members (firstName, lastName, membershipExpiryDate, membershipRenewal, membershipType, annualMembership, notes1, notes2, notes3, length, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [firstName, lastName, membershipExpiryDate, membershipRenewal, membershipType, annualMembership, notes1, notes2, notes3, length, createdAt, updatedAt]
  );

  return { success: true, message: "Member added successfully" };
};

// Update member
const updateMember = async (id, updatedData) => {
  const db = await dbPromise;
  updatedData.updatedAt = new Date().toISOString(); // Update timestamp

  const result = await db.run(
    "UPDATE members SET firstName = ?, lastName = ?, membershipExpiryDate = ?, membershipRenewal = ?, membershipType = ?, annualMembership = ?, notes1 = ?, notes2 = ?, notes3 = ?, length = ?, updatedAt = ? WHERE id = ?",
    [
      updatedData.firstName, updatedData.lastName, updatedData.membershipExpiryDate, updatedData.membershipRenewal,
      updatedData.membershipType, updatedData.annualMembership, updatedData.notes1, updatedData.notes2, updatedData.notes3,
      updatedData.length, updatedData.updatedAt, id
    ]
  );

  if (result.changes === 0) throw new Error("Member update failed");

  return { success: true, message: "Member updated successfully" };
};

// Get all members
const getAllMembers = async () => {
  const db = await dbPromise;
  const members = await db.all("SELECT * FROM members");
  return { success: true, members };
};

// Get a member by ID
const getMemberById = async (id) => {
  const db = await dbPromise;
  const member = await db.get("SELECT * FROM members WHERE id = ?", [id]);

  if (!member) throw new Error("Member not found");

  return { success: true, member };
};

// Delete a member
const deleteMember = async (id) => {
  const db = await dbPromise;
  const result = await db.run("DELETE FROM members WHERE id = ?", [id]);

  if (result.changes === 0) throw new Error("Member deletion failed");

  return { success: true, message: "Member deleted successfully" };
};

// ✅ Export functions in CommonJS format
module.exports = {
  addMember,
  updateMember,
  getAllMembers,
  getMemberById,
  deleteMember
};

