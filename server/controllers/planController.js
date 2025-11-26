// controllers/planController.js
import db from "../config/db.js";

// @desc    Create a new pricing plan
// @route   POST /api/plans/create
// @access  Private (Admin)
export const createPlan = async (req, res, next) => {
  const { name, price, duration_days, features } = req.body;

  try {
    // 1. Validation (Optional: Check if plan name already exists)
    const [existing] = await db.query("SELECT * FROM plans WHERE name = ?", [name]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: "Plan name already exists" });
    }

    // 2. Create Plan
    const [result] = await db.query(
      "INSERT INTO plans (name, price, duration_days, features) VALUES (?, ?, ?, ?)",
      [name, price, duration_days, features]
    );

    res.status(201).json({
      success: true,
      message: "Plan created successfully",
      planId: result.insertId
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get all plans
// @route   GET /api/plans/all
// @access  Public (or Private depending on your needs)
export const getAllPlans = async (req, res, next) => {
  try {
    const [plans] = await db.query("SELECT * FROM plans ORDER BY price ASC");
    
    res.status(200).json({
      success: true,
      data: plans
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a plan
// @route   PUT /api/plans/:id
// @access  Private (Admin)
export const updatePlan = async (req, res, next) => {
  const { id } = req.params;
  const { name, price, duration_days, features } = req.body;

  try {
    // Check if plan exists
    const [check] = await db.query("SELECT * FROM plans WHERE id = ?", [id]);
    if (check.length === 0) {
      return res.status(404).json({ success: false, message: "Plan not found" });
    }

    // Update
    await db.query(
      "UPDATE plans SET name = ?, price = ?, duration_days = ?, features = ? WHERE id = ?",
      [
        name || check[0].name,
        price || check[0].price,
        duration_days || check[0].duration_days,
        features || check[0].features,
        id
      ]
    );

    res.status(200).json({ success: true, message: "Plan updated successfully" });

  } catch (error) {
    next(error);
  }
};

// @desc    Delete a plan
// @route   DELETE /api/plans/:id
// @access  Private (Admin)
export const deletePlan = async (req, res, next) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM plans WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Plan not found" });
    }

    res.status(200).json({ success: true, message: "Plan deleted successfully" });
  } catch (error) {
    next(error);
  }
};