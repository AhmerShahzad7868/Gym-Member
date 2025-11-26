// controllers/paymentController.js
import db from "../config/db.js";

// @desc    Record a new payment & Extend Membership
// @route   POST /api/payments/add
// @access  Private (Admin)
export const addPayment = async (req, res, next) => {
  const { member_id, amount, payment_method, duration_days, remarks } = req.body;

  // We need a transaction here because we are updating TWO tables. 
  // If one fails, we want to roll back.
  const connection = await db.getConnection(); // Get specific connection from pool

  try {
    await connection.beginTransaction();

    // 1. Insert Payment Record
    const [paymentResult] = await connection.query(
      "INSERT INTO payments (member_id, amount, payment_method, duration_extension, remarks) VALUES (?, ?, ?, ?, ?)",
      [member_id, amount, payment_method || 'Cash', duration_days, remarks]
    );

    // 2. Calculate New End Date for the Member
    // First, get the current member details
    const [memberData] = await connection.query("SELECT end_date FROM members WHERE id = ?", [member_id]);
    
    if (memberData.length === 0) {
      throw new Error("Member not found");
    }

    const currentEndDate = memberData[0].end_date ? new Date(memberData[0].end_date) : new Date();
    const today = new Date();

    let newEndDate;

    // LOGIC: 
    // If expired (end_date < today), start counting from TODAY.
    // If active (end_date > today), add days to the EXISTING end_date.
    if (currentEndDate < today) {
        newEndDate = new Date(today);
    } else {
        newEndDate = new Date(currentEndDate);
    }

    // Add the days (e.g., +30 days)
    newEndDate.setDate(newEndDate.getDate() + parseInt(duration_days));

    // 3. Update Member Status and Date
    await connection.query(
      "UPDATE members SET end_date = ?, status = 'active' WHERE id = ?",
      [newEndDate, member_id]
    );

    await connection.commit(); // Save changes

    res.status(201).json({
      success: true,
      message: "Payment recorded and Membership extended",
      new_end_date: newEndDate,
      paymentId: paymentResult.insertId
    });

  } catch (error) {
    await connection.rollback(); // Undo changes if something failed
    next(error);
  } finally {
    connection.release(); // Put connection back in pool
  }
};

// @desc    Get Payment History (All or by Member)
// @route   GET /api/payments/history
// @access  Private
export const getPaymentHistory = async (req, res, next) => {
  const { member_id } = req.query; // Optional ?member_id=5

  try {
    let query = `
      SELECT p.*, m.full_name, m.email 
      FROM payments p 
      JOIN members m ON p.member_id = m.id
    `;
    let params = [];

    if (member_id) {
      query += " WHERE p.member_id = ?";
      params.push(member_id);
    }

    query += " ORDER BY p.payment_date DESC";

    const [history] = await db.query(query, params);

    res.status(200).json({
      success: true,
      count: history.length,
      data: history
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get Total Revenue (Stats)
// @route   GET /api/payments/revenue
// @access  Private
export const getRevenueStats = async (req, res, next) => {
  try {
    const [result] = await db.query("SELECT SUM(amount) as total_revenue FROM payments");
    
    res.status(200).json({
      success: true,
      total_revenue: result[0].total_revenue || 0
    });
  } catch (error) {
    next(error);
  }
};