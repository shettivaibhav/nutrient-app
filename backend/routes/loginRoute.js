import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();
const SECRET_KEY = "your-secret-key";

// ✅ Login route
router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Enter both email and password" });
    }

    // Find user in DB
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    // Check password (plain text for now, hash recommended)
    if (user.password !== password) {
      return res.status(400).json({ success: false, message: "Incorrect password" });
    }

    // Generate JWT containing userId
    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "1h" });

    // Send token (and optionally userId) to frontend
    res.status(200).json({
      success: true,
      message: "Login successful!",
      token        // token contains userId inside payload
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error, try again later" });
  }
});

export default router;
