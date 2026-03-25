const express  = require("express");
const bcrypt   = require("bcryptjs");
const jwt      = require("jsonwebtoken");
const db       = require("../db");
require("dotenv").config();

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ error: "All fields are required" });

  try {
    const [existing] = await db.query(
      "SELECT id FROM users WHERE email = ?", [email]
    );
    if (existing.length > 0)
      return res.status(400).json({ error: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashed]
    );
    res.json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password, adminSecret } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "All fields are required" });

  try {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ?", [email]
    );
    if (rows.length === 0)
      return res.status(400).json({ error: "User not found" });

    const user  = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ error: "Incorrect password" });

    // If adminSecret provided, verify it
    let role = user.role;
    if (adminSecret) {
      if (adminSecret !== process.env.ADMIN_SECRET)
        return res.status(403).json({ error: "Invalid admin secret key" });
      // Upgrade this user to admin
      await db.query("UPDATE users SET role = 'admin' WHERE id = ?", [user.id]);
      role = "admin";
    }

    const token = jwt.sign(
      { userId: user.id, role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      access_token: token,
      token_type:   "bearer",
      username:     user.username,
      role
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET CURRENT USER
router.get("/me", require("../Middleware/auth"), async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, username, email, role FROM users WHERE id = ?", [req.userId]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: "User not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

"ADMIN_SECRET=pesto@admin2025"