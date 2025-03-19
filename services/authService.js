const { dbPromise } = require("../database/db.js");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const SESSION_EXPIRY_HOURS = 24; // 24 hours

const registerUser = async (name, email, password) => {
  const db = await dbPromise;

  // Check if user already exists
  const existingUser = await db.get("SELECT * FROM users WHERE email = ?", [email]);
  if (existingUser) throw new Error("User already exists");

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert new user
  await db.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]);

  return { success: true, message: "User registered successfully" };
};

const loginUser = async (email, password) => {
  const db = await dbPromise;
  const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);

  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid password");

  // Generate session token
  const token = crypto.randomBytes(64).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_EXPIRY_HOURS * 60 * 60 * 1000).toISOString();

  // Store session in DB
  await db.run("INSERT INTO sessions (userId, token, expiresAt) VALUES (?, ?, ?)", [user.id, token, expiresAt]);

  return { success: true, token, user: { id: user.id, name: user.name, email: user.email } };
};

// Verify session
const authenticateUser = async (token) => {
  if (!token) throw new Error("No session token provided");

  const db = await dbPromise;
  const session = await db.get("SELECT * FROM sessions WHERE token = ?", [token]);

  if (!session) throw new Error("Invalid session");
  if (new Date(session.expiresAt) < new Date()) throw new Error("Session expired");

  // Get user details
  const user = await db.get("SELECT id, name, email FROM users WHERE id = ?", [session.userId]);
  if (!user) throw new Error("User not found");

  return { success: true, user };
};

// Logout (delete session)
const logoutUser = async (token) => {
  const db = await dbPromise;
  await db.run("DELETE FROM sessions WHERE token = ?", [token]);
  return { success: true, message: "Logged out successfully" };
};

// ✅ Export functions in CommonJS format
module.exports = {
  registerUser,
  loginUser,
  authenticateUser,
  logoutUser
};

