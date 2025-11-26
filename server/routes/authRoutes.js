// routes/authRoutes.js
import express from "express";
import { registerAdmin, loginAdmin, logoutAdmin } from "../controllers/authController.js";

const router = express.Router();

// Route: POST /api/auth/register
router.post("/register", registerAdmin);

// Route: POST /api/auth/login
router.post("/login", loginAdmin);

// Route: POST /api/auth/logout
router.post("/logout", logoutAdmin);

export default router;