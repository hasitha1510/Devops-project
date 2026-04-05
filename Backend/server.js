const express = require("express");
const cors    = require("cors");
require("dotenv").config();

const authRoutes    = require("./Routes/auth");
const cartRoutes    = require("./Routes/cart");
const profileRoutes = require("./Routes/profile");
const adminRoutes   = require("./Routes/admin");

const app = express();

app.use(cors({
  origin: 'https://eloquent-froyo-fa3d38.netlify.app',
  credentials: true
}));
app.use(express.json());

app.use("/auth",    authRoutes);
app.use("/cart",    cartRoutes);
app.use("/profile", profileRoutes);
app.use("/admin",   adminRoutes);

app.get("/", (req, res) => res.json({ message: "Pesto backend running" }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));