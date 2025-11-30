import mongoose from "mongoose";

const mealSchema = new mongoose.Schema({
  foodName: String,
  calories: Number,
  protein: Number,
  carbs: Number,
  fats: Number,
  measure: String,
  grams: Number,
  category: String,
  qty: { type: Number, default: 1 }, // <-- new field
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  weight: { type: Number, required: true },
  height: { type: Number, required: true },
  goal: { type: String, default: "maintain" },
  activity: { type: String, default: "moderate" },
  nutrients: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fats: Number,
  },
  meals: [mealSchema],
});

const User = mongoose.model("User", userSchema);
export default User;
