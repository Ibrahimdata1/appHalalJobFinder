import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import { connectDB } from "./models/User.js";
import "./models/Job.js";
import "./models/Application.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "*", // อนุญาตทุกโดเมน
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(bodyParser.json());

// เชื่อมต่อ PostgreSQL + PostGIS
const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: "postgres",
  logging: false,
});
await connectDB();

app.use("/auth", authRoutes);
app.use("/api", jobRoutes);
app.use("/api", applicationRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Backend API is running...");
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
