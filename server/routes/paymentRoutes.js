// routes/paymentRoutes.js
import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { 
  addPayment, 
  getPaymentHistory, 
  getRevenueStats 
} from "../controllers/paymentController.js";

const router = express.Router();

// All payment routes should be protected
router.post("/add", verifyToken, addPayment);
router.get("/history", verifyToken, getPaymentHistory);
router.get("/revenue", verifyToken, getRevenueStats);

export default router;