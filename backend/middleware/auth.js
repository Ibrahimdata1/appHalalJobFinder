import jwt from "jsonwebtoken";

const authenticateUser = (req, res, next) => {
  console.log(`📌 Request: ${req.method} ${req.url}`);
  console.log("📌 Headers ที่ได้รับ:", req.headers);
  try {
    const token = req.headers.authorization?.split(" ")[1]; // 🔹 ดึง token จาก header

    if (!token) {
      console.error("❌ ไม่พบ Token");

      return res.status(401).json({ error: "Unauthorized: ไม่พบ Token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // 🔹 เปลี่ยนเป็น secret จริงของคุณ
    req.user = { id: decoded.id }; // ✅ เพิ่ม user_id เข้า req

    next(); // ✅ ส่งต่อไปยัง route ถัดไป
  } catch (error) {
    return res.status(403).json({ error: "Invalid token" });
  }
};

export default authenticateUser;
