import express from "express";
import User from "../models/User.js";
import authenticate from "../middleware/auth.js";

const router = express.Router();

router.post("/add", authenticate, async (req, res) => {
  const { food } = req.body;
  const userId = req.user.id;

  if (!food || !food.Food) {
    return res.status(400).send("Invalid food object");
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).send("User not found");

    if (!user.meals) user.meals = [];

    const normalizedFoodName = food.Food.trim().toLowerCase();

    // Find existing meal
    let existingMeal = user.meals.find(
      (m) => (m.foodName || "").trim().toLowerCase() === normalizedFoodName
    );

    if (existingMeal) {
      existingMeal.qty = (existingMeal.qty || 0) + 1; // increment qty
    } else {
      existingMeal = {
        foodName: food.Food.trim(),
        calories: parseFloat(food.Calories) || 0,
        protein: parseFloat(food.Protein) || 0,
        carbs: parseFloat(food.Carbs) || 0,
        fats: parseFloat(food.Fat) || 0,
        measure: food.Measure || "",
        grams: parseFloat(food.Grams) || 0,
        category: food.Category || "",
        qty: 1, // ✅ explicitly set
      };
      user.meals.push(existingMeal);
    }

    await user.save();

    // Return only the meal that was added/updated
    res.status(200).json(existingMeal);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding meal");
  }
});



// Get all meals
router.get("/", authenticate, async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).send("User not found");
    res.json(user.meals || []);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching meals");
  }
});

// Delete a meal
router.delete("/:mealId", authenticate, async (req, res) => {
  const userId = req.user.id;
  const { mealId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).send("User not found");

    user.meals = user.meals.filter((m) => m._id.toString() !== mealId);
    await user.save();

    res.json(user.meals);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting meal");
  }
});

// Update meal quantity
router.patch("/:mealId", authenticate, async (req, res) => {
  const userId = req.user.id;
  const { mealId } = req.params;
  const { qty } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).send("User not found");

    const meal = user.meals.id(mealId);
    if (!meal) return res.status(404).send("Meal not found");

    meal.qty = qty;
    await user.save();
    res.json(meal);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating quantity");
  }
});

export default router;
