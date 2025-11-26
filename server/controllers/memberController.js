// controllers/memberController.js
import db from "../config/db.js";

// @desc    Add a new member
// @route   POST /api/members/add
// @access  Private (Admin only)
export const addMember = async (req, res, next) => {
  const { full_name, email, phone, start_date, end_date, status } = req.body;

  try {
    // 1. Check if member already exists (by email or phone)
    const [existing] = await db.query(
      "SELECT * FROM members WHERE email = ? OR phone = ?", 
      [email, phone]
    );

    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: "Member with this email or phone already exists." });
    }

    // 2. Insert new member
    // Note: status, start_date, end_date can be optional or required depending on your UI
    const [result] = await db.query(
      "INSERT INTO members (full_name, email, phone, start_date, end_date, status) VALUES (?, ?, ?, ?, ?, ?)",
      [full_name, email, phone, start_date, end_date, status || 'active']
    );

    res.status(201).json({
      success: true,
      message: "Member added successfully",
      memberId: result.insertId,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all members
// @route   GET /api/members/all
// @access  Private
export const getAllMembers = async (req, res, next) => {
  try {
    // Select all members, ordered by most recently added
    const [members] = await db.query("SELECT * FROM members ORDER BY created_at DESC");
    
    res.status(200).json({
      success: true,
      count: members.length,
      data: members,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single member by ID
// @route   GET /api/members/:id
// @access  Private
export const getMemberById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const [member] = await db.query("SELECT * FROM members WHERE id = ?", [id]);

    if (member.length === 0) {
      return res.status(404).json({ success: false, message: "Member not found" });
    }

    res.status(200).json({ success: true, data: member[0] });
  } catch (error) {
    next(error);
  }
};

// @desc    Update member details
// @route   PUT /api/members/:id
// @access  Private
export const updateMember = async (req, res, next) => {
  const { id } = req.params;
  const { full_name, email, phone, status, end_date } = req.body;

  try {
    // 1. Check if member exists
    const [check] = await db.query("SELECT * FROM members WHERE id = ?", [id]);
    if (check.length === 0) {
      return res.status(404).json({ success: false, message: "Member not found" });
    }

    // 2. Update logic
    // We use COALESCE in SQL or Javascript logic to keep old values if new ones aren't provided
    await db.query(
      `UPDATE members 
       SET full_name = ?, email = ?, phone = ?, status = ?, end_date = ? 
       WHERE id = ?`,
      [
        full_name || check[0].full_name,
        email || check[0].email,
        phone || check[0].phone,
        status || check[0].status,
        end_date || check[0].end_date,
        id
      ]
    );

    res.status(200).json({ success: true, message: "Member updated successfully" });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a member
// @route   DELETE /api/members/:id
// @access  Private
export const deleteMember = async (req, res, next) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM members WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Member not found" });
    }

    res.status(200).json({ success: true, message: "Member deleted successfully" });
  } catch (error) {
    next(error);
  }
};