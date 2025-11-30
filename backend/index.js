import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import loginRoute from "./routes/loginRoute.js";
import signupRoute from './routes/signupRoute.js'
import mealRoute from "./routes/mealRoute.js";
import userRoute from "./routes/user.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config(); // Load .env variables

const app = express();

// ✅ Middlewares
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
); // Allows frontend to connect to backend
app.use(express.json()); // Parses incoming JSON requests

// ✅ MongoDB Connection
mongoose
.connect(process.env.MONGO_URI) // Example: "mongodb://localhost:27017/nutrientApp"
.then(() => console.log("✅ MongoDB Connected Successfully"))
.catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Test Route (for checking server status)
// app.get("/", (req, res) => {
//   res.send("🚀 Nutrient App Backend is Running");
// });

//✅ Signup Route
app.use("/api/signup", signupRoute)

//✅ Login Route
app.use("/api/login", loginRoute)

//✅ Meal Route
app.use("/api/meals", mealRoute);

//✅ User Route
app.use("/api/user", userRoute);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendPath));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🌿 Server running on http://localhost:${PORT}`));
