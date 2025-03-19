-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    verifyOtp TEXT DEFAULT '',
    verifyOtpExpireAt INTEGER DEFAULT 0,
    isAccountVerified BOOLEAN DEFAULT FALSE,
    resetOtp TEXT DEFAULT '',
    resetOtpExpireAt INTEGER DEFAULT 0
);

-- Members Table
CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    membershipExpiryDate TEXT NOT NULL,  -- Stored as ISO 8601 string
    membershipRenewal TEXT NOT NULL,     -- Stored as ISO 8601 string
    membershipType TEXT CHECK(membershipType IN ('Annual', 'Monthly', 'Walk-in')) NOT NULL,
    annualMembership TEXT DEFAULT 'No',
    notes1 TEXT DEFAULT '',
    notes2 TEXT DEFAULT '',
    notes3 TEXT DEFAULT '',
    length INTEGER NOT NULL CHECK(length > 0),
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,      -- Stored as ISO 8601 string
    memberId INTEGER NOT NULL,  -- Foreign key to members table
    amount REAL NOT NULL,
    type TEXT NOT NULL,
    expiry TEXT NOT NULL,    -- Stored as ISO 8601 string
    FOREIGN KEY (memberId) REFERENCES members(id) ON DELETE CASCADE
);

-- Sessions Table
CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    token TEXT NOT NULL UNIQUE,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    expiresAt TEXT NOT NULL,  -- Expiry timestamp
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

