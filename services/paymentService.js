const { dbPromise } = require("../database/db.js");

// Add a new payment
const addPayment = async (payment) => {
  const db = await dbPromise;
  const { memberId, amount, date, type, expiry } = payment; // Match DB schema

  await db.run(
    "INSERT INTO payments (memberId, amount, date, type, expiry) VALUES (?, ?, ?, ?, ?)",
    [memberId, amount, date, type, expiry]
  );

  return { success: true, message: "Payment recorded successfully" };
};

// Get all payments
const getAllPayments = async () => {
  const db = await dbPromise;
  const payments = await db.all("SELECT * FROM payments");
  return { success: true, payments };
};

// Get a payment by ID
const getPaymentById = async (id) => {
  const db = await dbPromise;
  const payment = await db.get("SELECT * FROM payments WHERE id = ?", [id]);

  if (!payment) throw new Error("Payment not found");

  return { success: true, payment };
};

// Update a payment
const updatePayment = async (id, updatedData) => {
  const db = await dbPromise;
  const { amount, date, type, expiry } = updatedData; // Match DB columns

  const result = await db.run(
    "UPDATE payments SET amount = ?, date = ?, type = ?, expiry = ? WHERE id = ?",
    [amount, date, type, expiry, id]
  );

  if (result.changes === 0) throw new Error("Payment update failed");

  return { success: true, message: "Payment updated successfully" };
};

// Delete a payment
const deletePayment = async (id) => {
  const db = await dbPromise;
  const result = await db.run("DELETE FROM payments WHERE id = ?", [id]);

  if (result.changes === 0) throw new Error("Payment deletion failed");

  return { success: true, message: "Payment deleted successfully" };
};

// ✅ Export functions in CommonJS format
module.exports = {
  addPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
};

