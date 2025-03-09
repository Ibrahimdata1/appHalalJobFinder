import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import userRoute from "./routes/userRouter.js";
import { connectDB } from "./models/Users.js";
import authenticateUser from "./middleware/auth.js";
import "./models/Jobs.js";
import "./models/Applications.js";

dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "*", // อนุญาตทุกโดเมน
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(bodyParser.json());

await connectDB();

app.use("/auth", authRoutes);
app.use("/api/users", authenticateUser, userRoute);
app.use("/api/jobs", authenticateUser, jobRoutes);
app.use("/api/applications", authenticateUser, applicationRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Backend API is running...");
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
