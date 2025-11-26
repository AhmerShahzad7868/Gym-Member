// controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db.js"; // Importing your MySQL pool

// @desc    Register a new Admin (Gym Owner)
// @route   POST /api/auth/register
// @access  Public (or Protected with a secret key in production)
export const registerAdmin = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    // 1. Check if admin already exists
    const [existingUser] = await db.query("SELECT * FROM admins WHERE email = ?", [email]);
    
    if (existingUser.length > 0) {
      return res.status(400).json({ success: false, message: "Admin already exists" });
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Insert into MySQL
    const [result] = await db.query(
      "INSERT INTO admins (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    res.status(201).json({ success: true, message: "Admin registered successfully" });

  } catch (error) {
    next(error); // Pass error to global handler in app.js
  }
};

// @desc    Login Admin
// @route   POST /api/auth/login
// @access  Public
export const loginAdmin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // 1. Check if user exists
    const [users] = await db.query("SELECT * FROM admins WHERE email = ?", [email]);
    
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const admin = users[0];

    // 2. Validate Password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // 3. Generate JWT Token
    const token = jwt.sign({ id: admin.id, role: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // 4. Send Token in HTTP-Only Cookie (More secure than localStorage)
    res.cookie("access_token", token, {
      httpOnly: true, // Client JS cannot read this (prevents XSS)
      secure: process.env.NODE_ENV === "production", // Only use HTTPS in production
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // 5. Respond to client (excluding password)
    const { password: _, ...adminData } = admin; // Remove password from response
    
    res.status(200).json({ 
        success: true, 
        message: "Login successful", 
        user: adminData 
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Logout Admin
// @route   POST /api/auth/logout
// @access  Private
export const logoutAdmin = (req, res) => {
  res.clearCookie("access_token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};