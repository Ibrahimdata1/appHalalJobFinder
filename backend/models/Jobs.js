import { DataTypes } from "sequelize";
import { sequelize } from "./Users.js"; // ✅ ใช้ sequelize ตัวเดียวกับ User.js

export const Jobs = sequelize.define("Jobs", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  company: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  salary: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.TEXT, // ✅ รายละเอียดงานควรเป็น `TEXT` เพื่อรองรับข้อความยาวๆ
    allowNull: true,
  },
  lat: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  lng: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});
