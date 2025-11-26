// config/db.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Create the Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "", // Your MySQL password
  database: process.env.DB_NAME || "gym_db",
  waitForConnections: true,
  connectionLimit: 10, // Max 10 active connections at once
  queueLimit: 0,
});

// Helper function to test connection on startup (used in app.js)
export const connectDb = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ MySQL Database Connected Successfully via Pool");
    connection.release(); // Always release the connection back to the pool!
  } catch (error) {
    console.error("❌ Database Connection Failed:", error.message);
    process.exit(1); // Stop the app if DB is down
  }
};

// Export the pool to be used in controllers
export default pool;