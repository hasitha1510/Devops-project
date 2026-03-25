const express = require("express");
const db      = require("../db");
const auth    = require("../Middleware/auth");

const router = express.Router();

// Middleware to check admin role
function adminOnly(req, res, next) {
  if (req.role !== "admin")
    return res.status(403).json({ error: "Admin access only" });
  next();
}

// GET STATS
router.get("/stats", auth, adminOnly, async (req, res) => {
  try {
    const [[{ totalOrders }]]  = await db.query("SELECT COUNT(*) as totalOrders FROM cart_items");
    const [[{ totalRevenue }]] = await db.query("SELECT SUM(price * quantity) as totalRevenue FROM cart_items");
    const [[{ totalUsers }]]   = await db.query("SELECT COUNT(*) as totalUsers FROM users WHERE role = 'user'");
    const [[{ pendingOrders }]] = await db.query("SELECT COUNT(*) as pendingOrders FROM cart_items WHERE status = 'Pending'");

    res.json({ totalOrders, totalRevenue: totalRevenue || 0, totalUsers, pendingOrders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET ALL ORDERS with customer details
router.get("/orders", auth, adminOnly, async (req, res) => {
  try {
    const [orders] = await db.query(`
      SELECT 
        ci.id, ci.name, ci.price, ci.image, ci.quantity, ci.status, ci.ordered_at,
        u.id as user_id, u.username, u.email,
        up.full_name, up.phone, up.address
      FROM cart_items ci
      JOIN users u ON ci.user_id = u.id
      LEFT JOIN user_profiles up ON u.id = up.user_id
      ORDER BY ci.ordered_at DESC
    `);
    res.json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// UPDATE ORDER STATUS
router.put("/orders/:id/status", auth, adminOnly, async (req, res) => {
  const { status } = req.body;
  const validStatuses = ["Pending", "Accepted", "Preparing", "Delivered"];

  if (!validStatuses.includes(status))
    return res.status(400).json({ error: "Invalid status" });

  try {
    await db.query("UPDATE cart_items SET status = ? WHERE id = ?", [status, req.params.id]);
    res.json({ message: "Status updated" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET ALL USERS
router.get("/users", auth, adminOnly, async (req, res) => {
  try {
    const [users] = await db.query(`
      SELECT 
        u.id, u.username, u.email, u.role,
        up.full_name, up.phone, up.address,
        COUNT(ci.id) as total_orders,
        SUM(ci.price * ci.quantity) as total_spent
      FROM users u
      LEFT JOIN user_profiles up ON u.id = up.user_id
      LEFT JOIN cart_items ci ON u.id = ci.user_id
      WHERE u.role = 'user'
      GROUP BY u.id
      ORDER BY u.id DESC
    `);
    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;