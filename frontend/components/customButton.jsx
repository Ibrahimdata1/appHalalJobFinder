import { TouchableOpacity, Text } from "react-native";
import React from "react";

const CustomButton = ({ title, handlePress, isLoading }) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={[
        {
          backgroundColor: "#FFB347", // สีส้มอ่อน
          paddingVertical: 14, // ระยะห่างบน-ล่างเล็กน้อย
          paddingHorizontal: 24, // ระยะห่างด้านข้าง
          borderRadius: 50, // มุมโค้งมน
          justifyContent: "center", // จัดข้อความให้กึ่งกลาง
          alignItems: "center", // จัดข้อความให้กึ่งกลาง
          opacity: isLoading ? 0.6 : 1, // ลดความทึบเมื่อกำลังโหลด
          marginTop: 30, // ระยะห่างจากด้านบน
        },
        isLoading && { backgroundColor: "#FF9E56" }, // สีพื้นหลังเปลี่ยนเมื่อกำลังโหลด
      ]}
      disabled={isLoading}
    >
      <Text className={`text-slate-800 font-bold text-lg`}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
