import express from "express";
import { Job } from "../models/Job.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// ✅ ดึงรายการงานทั้งหมด
router.get("/jobs", async (req, res) => {
  try {
    const jobs = await Job.findAll();
    res.status(201).json(jobs);
  } catch (error) {
    console.error("❌ ดึงข้อมูลงานล้มเหลว:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการโหลดงาน" });
  }
});

// ✅ เพิ่มงานใหม่
router.post("/jobs", async (req, res) => {
  try {
    const { title, company, salary, lat, lng } = req.body;
    if (!title || !company || !lat || !lng) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    const newJob = await Job.create({ title, company, salary, lat, lng });
    res.status(201).json({ message: "เพิ่มงานสำเร็จ", job: newJob });
  } catch (error) {
    console.error("❌ เพิ่มงานล้มเหลว:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการเพิ่มงาน" });
  }
});

// ✅ ลบงาน
router.delete("/jobs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findByPk(id);

    if (!job) {
      return res.status(404).json({ message: "ไม่พบงานที่ต้องการลบ" });
    }

    await job.destroy();
    res.json({ message: "ลบงานสำเร็จ" });
  } catch (error) {
    console.error("❌ ลบงานล้มเหลว:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการลบงาน" });
  }
});

export default router;
