import express from "express";
import User from "../models/User.js";

const router = express.Router();

// 🔹 Helper Function: Calculate BMR, TDEE, and Macros
const calculateNutrients = ({ gender, weight, height, age, activity, goal }) => {
  let BMR;

  // Step 1️⃣: Calculate BMR
  if (gender.toLowerCase() === "male") {
    BMR = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    BMR = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  // Step 2️⃣: Multiply by Activity Factor
  const activityFactors = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryactive: 1.9,
  };

  const factor = activityFactors[activity.toLowerCase()] || 1.55;
  let TDEE = BMR * factor;

  // Step 3️⃣: Adjust for Goal
  if (goal && goal.toLowerCase() === "lose") TDEE -= 500;
  else if (goal && goal.toLowerCase() === "gain") TDEE += 500;

  // Step 4️⃣: Macronutrient Breakdown
  const protein = (TDEE * 0.25) / 4;
  const carbs = (TDEE * 0.5) / 4;
  const fats = (TDEE * 0.25) / 9;

  return {
    calories: Math.round(TDEE),
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fats: Math.round(fats),
  };
};

// ✅ Signup Route (now with auto nutrient calculation)
router.post("/", async (req, res) => {
  try {
    const { name, email, password, age, gender, weight, height, goal, activity } = req.body;

    // Basic validation
    if (!name || !email || !password || !age || !gender || !weight || !height) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 🧮 Calculate nutrients before saving
    const nutrients = calculateNutrients({
      gender,
      weight: Number(weight),
      height: Number(height),
      age: Number(age),
      activity,
      goal,
    });

    // Create new user with nutrient data
    const newUser = new User({
      name,
      email,
      password, // ❗ Plain text (later: use bcrypt)
      age: Number(age),
      gender,
      weight: Number(weight),
      height: Number(height),
      goal,
      activity,
      nutrients, // ✅ store calculated result directly
    });

    await newUser.save();

    // ✅ Send response including calculated data
    res.status(201).json({
      message: "Signup successful!",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        ...nutrients,
      },
    });
  } catch (error) {
    console.error("❌ Signup Error:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
});

export default router;
