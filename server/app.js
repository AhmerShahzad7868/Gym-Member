// app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDb } from "./config/db.js"; // Adjusted path to match structure

// Import Routes
import authRoutes from "./routes/authRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";
import planRoutes from "./routes/planRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js"; // Uncomment when ready

// Configuration
dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies from requests

// CORS Configuration
// Allow credentials so we can send cookies/tokens to the frontend
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true, 
    methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
  })
);

// Database Connection
connectDb(); 
// Note: Ensure your db.js handles the connection logic cleanly. 
// If using MySQL pool, you might not need a .then() here depending on implementation.

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/payments", paymentRoutes);

// Global Error Handler (Professional Practice)
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({ success: false, message });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on PORT ${PORT}`);
});