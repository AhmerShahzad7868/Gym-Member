// routes/memberRoutes.js
import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js"; // Import the guard
import { 
  addMember, 
  getAllMembers, 
  getMemberById, 
  updateMember, 
  deleteMember 
} from "../controllers/memberController.js";

const router = express.Router();

// Apply verifyToken to ALL routes in this file automatically
// OR apply it individually (shown below for clarity)

router.post("/add", verifyToken, addMember);       // PROTECTED
router.get("/all", verifyToken, getAllMembers);    // PROTECTED
router.get("/:id", verifyToken, getMemberById);    // PROTECTED
router.put("/:id", verifyToken, updateMember);     // PROTECTED
router.delete("/:id", verifyToken, deleteMember);  // PROTECTED

export default router;