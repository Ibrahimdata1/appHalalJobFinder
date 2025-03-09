import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Users } from "../models/Users.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// สมัครสมาชิก
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "อีเมลนี้ถูกใช้งานแล้ว" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await Users.create({
      name,
      email,
      password: hashedPassword,
      phone,
    });
    return res
      .status(201)
      .json({ message: "สมัครสมาชิกสำเร็จ", user: newUser });
  } catch (error) {
    return res.status(500).json({ message: "เกิดข้อผิดพลาด", error });
  }
});

// เข้าสู่ระบบ
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ where: { email } });
    if (!user)
      return res.status(400).json({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res.status(200).json({ message: "เข้าสู่ระบบสำเร็จ", token, user });
  } catch (error) {
    return res.status(500).json({ message: "เกิดข้อผิดพลาด", error });
  }
});

export default router;
