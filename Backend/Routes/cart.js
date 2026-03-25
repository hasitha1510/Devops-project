const express = require("express");
const db      = require("../db");
const auth = require("../Middleware/auth");

const router = express.Router();

// ADD TO CART
router.post("/add", auth, async (req, res) => {
  const { name, price, image, quantity } = req.body;

  try {
    const [existing] = await db.query(
      "SELECT id, quantity FROM cart_items WHERE user_id=? AND name=?",
      [req.userId, name]
    );

    if (existing.length > 0) {
      await db.query(
        "UPDATE cart_items SET quantity = quantity + ? WHERE id = ?",
        [quantity, existing[0].id]
      );
    } else {
      await db.query(
        "INSERT INTO cart_items (user_id, name, price, image, quantity) VALUES (?,?,?,?,?)",
        [req.userId, name, price, image, quantity]
      );
    }
    res.json({ message: "Cart updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET CART
router.get("/", auth, async (req, res) => {
  try {
    const [items] = await db.query(
      "SELECT id, name, price, image, quantity FROM cart_items WHERE user_id = ?",
      [req.userId]
    );
    res.json({
      total_orders: items.length,
      items
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;