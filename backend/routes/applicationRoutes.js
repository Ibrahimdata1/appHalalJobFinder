import express from "express";
import { Applications } from "../models/Applications.js";
import { Users } from "../models/Users.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// ✅ เพิ่มการสมัครงาน
router.post("/", async (req, res) => {
  console.log("req.body", req.body);
  try {
    const { jobId, status, jobtitle, jobcomp, jobsalary, jobdesc } = req.body;
    const userId = req.user.id;
    if (!jobId || !userId) {
      return res.status(400).json({ message: "ต้องระบุ jobId or user_id" });
    }

    const newApplication = await Applications.create({
      jobId,
      status,
      userId,
      jobtitle,
      jobcomp,
      jobsalary,
      jobdesc,
    });
    return res
      .status(201)
      .json({ message: "สมัครงานสำเร็จ", applications: newApplication });
  } catch (error) {
    console.error("❌ สมัครงานล้มเหลว:", error);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดในการสมัครงาน" });
  }
});

// ✅ ดึงข้อมูลการสมัครงาน
router.get("/", async (req, res) => {
  const userId = req.user.id;
  try {
    const applications = await Applications.findAll({
      where: { userId: userId },
    });
    return res.status(200).json(applications);
  } catch (error) {
    console.error("❌ ดึงข้อมูลการสมัครล้มเหลว:", error);
    return res
      .status(500)
      .json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลการสมัคร" });
  }
});
//ล้างหมดเกลี้ยง
router.delete("/clear", async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ error: "ต้องระบุ user_id" });
    }
    const deletedRows = await Applications.destroy({ where: { userId } }); // 🔥 ลบทั้งหมด
    if (deletedRows === 0) {
      return res.status(404).json({ message: "ไม่มีข้อมูลให้ลบ" });
    }
    return res.status(200).json({ message: "ล้างรายการสมัครงานสำเร็จ" });
  } catch (error) {
    console.error("❌ ล้างรายการสมัครงานล้มเหลว:", error);
    return res
      .status(500)
      .json({ message: "เกิดข้อผิดพลาดในการล้างรายการสมัครงาน" });
  }
});

// ✅ ลบการสมัครงาน
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // ค้นหา Application ที่ต้องการลบ
    const application = await Application.findByPk(id);
    if (!application) {
      return res.status(404).json({ message: "ไม่พบข้อมูลการสมัครงาน" });
    }

    await application.destroy(); // ลบข้อมูลออกจากฐานข้อมูล
    return res.status(200).json({ message: "ลบการสมัครงานสำเร็จ" });
  } catch (error) {
    console.error("❌ ลบการสมัครงานล้มเหลว:", error);
    return res
      .status(500)
      .json({ message: "เกิดข้อผิดพลาดในการลบการสมัครงาน" });
  }
});

export default router;
