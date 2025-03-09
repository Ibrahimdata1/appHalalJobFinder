import express from "express";
import dotenv from "dotenv";
import { Users } from "../models/Users.js";

dotenv.config();
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await Users.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(400).json({ message: "ไม่มี User นี้ในระบบ" });
    }
    return res.status(200).json({ message: "ดึงข้อมูลผู้ใช้สำเร็จ!", user });
  } catch (error) {
    return res.status(500).json({ message: "เกิดข้อผิดพลาด", error });
  }
});

export default router;
