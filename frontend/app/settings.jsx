import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

export default function Settings() {
  const router = useRouter(); // ✅ เพิ่ม const ให้ useRouter ทำงานถูกต้อง

  return (
    <View className="flex-1 items-center justify-center bg-gray-100">
      <Text className="text-3xl font-bold mb-4">⚙️ ตั้งค่า</Text>

      <Button
        title="กลับหน้าหลัก"
        onPress={() => router.back()}
        color="#007AFF" // ✅ ปรับสีปุ่มให้ดูสวยขึ้น
      />
    </View>
  );
}
