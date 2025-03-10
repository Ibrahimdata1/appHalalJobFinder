import express from "express";
import { Jobs } from "../models/Jobs.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
let clients = [];

// ✅ ดึงรายการงานทั้งหมด
router.get("/", async (req, res) => {
  try {
    const jobs = await Jobs.findAll();
    return res.status(201).json(jobs);
  } catch (error) {
    console.error("❌ ดึงข้อมูลงานล้มเหลว:", error);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดในการโหลดงาน" });
  }
});
router.get("/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  clients.push(res);

  req.on("close", () => {
    clients = clients.filter((client) => client !== res);
  });
});
// ฟังก์ชันส่งข้อมูลไปยัง clients ทุกคน
const sendJobUpdate = (jobData) => {
  clients.forEach((client) =>
    client.write(`data: ${JSON.stringify(jobData)}\n\n`)
  );
};

// ✅ เพิ่มงานใหม่
router.post("/", async (req, res) => {
  try {
    const { title, company, salary, description, lat, lng } = req.body;
    if (!title || !company || !description || !lat || !lng) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    const newJob = await Jobs.create({
      title,
      company,
      salary,
      description,
      lat,
      lng,
    });
    sendJobUpdate(newJob);
    return res.status(201).json({ message: "เพิ่มงานสำเร็จ", job: newJob });
  } catch (error) {
    console.error("❌ เพิ่มงานล้มเหลว:", error);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดในการเพิ่มงาน" });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const jobId = req.params.id;
    const { title, company, salary, location, description } = req.body;
    const userId = req.user.id; // ได้จาก Token

    // ค้นหางานที่ user เป็นเจ้าของ
    const job = await Jobs.findOne({ where: { id: jobId, userId } });

    if (!job)
      return res
        .status(404)
        .json({ error: "ไม่พบงาน หรือคุณไม่มีสิทธิ์แก้ไข" });

    // อัปเดตข้อมูลงาน
    await job.update({ title, company, salary, location, description });

    return res.status(200).json({ message: "อัปเดตงานสำเร็จ", job });
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการอัปเดตงาน:", error);
    return res.status(500).json({ error: "เกิดข้อผิดพลาดในการอัปเดตงาน" });
  }
});
// ✅ ลบงาน
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Jobs.findByPk(id);

    if (!job) {
      return res.status(404).json({ message: "ไม่พบงานที่ต้องการลบ" });
    }

    await job.destroy();
    return res.json({ message: "ลบงานสำเร็จ" });
  } catch (error) {
    console.error("❌ ลบงานล้มเหลว:", error);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดในการลบงาน" });
  }
});

export default router;
