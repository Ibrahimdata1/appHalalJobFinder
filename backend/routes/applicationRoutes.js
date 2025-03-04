import express from "express";
import { Application } from "../models/Application.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// ✅ เพิ่มการสมัครงาน
router.post("/applications", async (req, res) => {
  try {
    const { jobId, status } = req.body;
    if (!jobId) {
      return res.status(400).json({ message: "ต้องระบุ jobId" });
    }

    const newApplication = await Application.create({ jobId, status });
    res
      .status(201)
      .json({ message: "สมัครงานสำเร็จ", application: newApplication });
  } catch (error) {
    console.error("❌ สมัครงานล้มเหลว:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการสมัครงาน" });
  }
});

// ✅ ดึงข้อมูลการสมัครงาน
router.get("/applications", async (req, res) => {
  try {
    const applications = await Application.findAll();
    res.status(201).json(applications);
  } catch (error) {
    console.error("❌ ดึงข้อมูลการสมัครล้มเหลว:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลการสมัคร" });
  }
});

export default router;
