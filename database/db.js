const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

const dbPromise = open({
  filename: "./database/kilo-culture.db",
  driver: sqlite3.Database,
});

// Initialize tables from schema.sql
async function initializeDB() {
  const db = await dbPromise;
  await db.exec(`PRAGMA foreign_keys = ON;`);
}

// Export using CommonJS
module.exports = { dbPromise, initializeDB };

