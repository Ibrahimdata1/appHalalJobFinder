import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// ตรวจสอบว่า DB_URL ถูกต้องหรือไม่
if (!process.env.DB_URL) {
  throw new Error(
    "❌ Database URL (DB_URL) is missing in environment variables"
  );
}

// เชื่อมต่อฐานข้อมูล PostgreSQL
const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: "postgres",
  logging: false,
});

// กำหนด Model User
const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true, // สร้าง createdAt และ updatedAt อัตโนมัติ
    freezeTableName: true, // ป้องกัน Sequelize เปลี่ยนชื่อตารางเป็นพหูพจน์
    underscored: true, // ใช้ created_at, updated_at แทน createdAt, updatedAt
  }
);

// ฟังก์ชันเชื่อมต่อและซิงค์โมเดลกับฐานข้อมูล
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("📡 Database Connected Successfully");

    await sequelize.sync(); // ใช้ await เพื่อให้ซิงค์เสร็จก่อนดำเนินการต่อ
    console.log("✅ User model synced with database");
  } catch (error) {
    console.error("❌ Database Connection Failed:", error);
    process.exit(1); // ออกจากโปรเซสหากเชื่อมต่อฐานข้อมูลไม่สำเร็จ
  }
};

export { sequelize, User, connectDB };
