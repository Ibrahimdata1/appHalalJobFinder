import express from "express";
import dotenv from "dotenv";
import { Users } from "../models/Users.js";
import bcrypt from "bcryptjs";

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

router.put("/profile", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const user = await Users.findByPk(req.user.id);

    if (!user) return res.status(404).json({ message: "ไม่พบผู้ใช้" });

    user.name = name;
    user.email = email;
    user.phone = phone;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();
    return res.status(200).json({ message: "อัปเดตข้อมูลสำเร็จ" });
  } catch (error) {
    return res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" });
  }
});

export default router;
