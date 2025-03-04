import { DataTypes } from "sequelize";
import { sequelize } from "./User.js"; // ✅ ใช้ sequelize ตัวเดียวกัน

export const Application = sequelize.define("Application", {
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
});
