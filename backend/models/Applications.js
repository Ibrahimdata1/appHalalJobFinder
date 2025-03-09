import { DataTypes } from "sequelize";
import { sequelize } from "./Users.js"; // ✅ ใช้ sequelize ตัวเดียวกัน

export const Applications = sequelize.define("Applications", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
  },
  jobId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Jobs",
      key: "id",
    },
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "กำลังพิจารณา",
  },
  jobtitle: {
    type: DataTypes.STRING,
    allowNull: false, // ✅ ชื่อตำแหน่งงานต้องมีค่าเสมอ
  },
  jobcomp: {
    type: DataTypes.STRING,
    allowNull: false, // ✅ ชื่อบริษัทต้องมีค่าเสมอ
  },
  jobsalary: {
    type: DataTypes.STRING, // ✅ เงินเดือน สามารถเป็น `STRING` เพราะอาจมี "ตามตกลง"
    allowNull: true,
  },
  jobdesc: {
    type: DataTypes.TEXT, // ✅ รายละเอียดงานควรเป็น `TEXT` เพื่อรองรับข้อความยาวๆ
    allowNull: true,
  },
});
