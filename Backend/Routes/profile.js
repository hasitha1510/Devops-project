const express = require("express");
const db      = require("../db");
const auth = require("../Middleware/auth");

const router = express.Router();

// SETUP / UPDATE PROFILE
router.post("/setup", auth, async (req, res) => {
  const { full_name, phone, address } = req.body;
  if (!full_name || !phone || !address)
    return res.status(400).json({ error: "All fields are required" });

  try {
    const [existing] = await db.query(
      "SELECT id FROM user_profiles WHERE user_id = ?", [req.userId]
    );

    if (existing.length > 0) {
      await db.query(
        "UPDATE user_profiles SET full_name=?, phone=?, address=? WHERE user_id=?",
        [full_name, phone, address, req.userId]
      );
    } else {
      await db.query(
        "INSERT INTO user_profiles (user_id, full_name, phone, address) VALUES (?,?,?,?)",
        [req.userId, full_name, phone, address]
      );
    }
    res.json({ message: "Profile saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET PROFILE
router.get("/", auth, async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT id, username, email FROM users WHERE id = ?", [req.userId]
    );
    const [profiles] = await db.query(
      "SELECT full_name, phone, address FROM user_profiles WHERE user_id = ?", [req.userId]
    );

    const user    = users[0];
    const profile = profiles[0] || null;

    res.json({
      username:         user.username,
      email:            user.email,
      full_name:        profile?.full_name || null,
      phone:            profile?.phone     || null,
      address:          profile?.address   || null,
      profile_complete: !!profile
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;