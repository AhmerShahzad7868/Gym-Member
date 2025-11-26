// routes/planRoutes.js
import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { 
  createPlan, 
  getAllPlans, 
  updatePlan, 
  deletePlan 
} from "../controllers/planController.js";

const router = express.Router();

// Routes
router.post("/create", verifyToken, createPlan);
router.get("/all", getAllPlans); // Remove verifyToken if you want this public
router.put("/:id", verifyToken, updatePlan);
router.delete("/:id", verifyToken, deletePlan);

export default router;