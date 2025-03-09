import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { router } from "expo-router";
import useAuth from "../contexts/authContext";
import axios from "axios";

const API_URL = "http://192.168.1.135:8000"; // 🔹 เปลี่ยนเป็น URL Backend ของคุณ

const JobManagementScreen = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  // ✅ โหลดข้อมูลจาก API (PostgreSQL)
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/api/jobs`, {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ ส่ง Token ไปที่ Backend
            "Content-Type": "application/json",
          },
        });
        setJobs(response.data); // 📌 ตั้งค่าข้อมูลใน state
      } catch (error) {
        console.error("❌ โหลดงานล้มเหลว:", error);
        Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถโหลดงานได้");
      }
      setLoading(false);
    };
    fetchJobs();
  }, []);

  // ✅ ฟังก์ชันลบงาน
  const handleDelete = (id) => {
    Alert.alert("ยืนยันการลบ", "คุณต้องการลบงานนี้ใช่หรือไม่?", [
      { text: "ยกเลิก", style: "cancel" },
      {
        text: "ลบ",
        onPress: async () => {
          try {
            await axios.delete(`${API_URL}/api/jobs/${id}`);
            setJobs(jobs.filter((job) => job.id !== id)); // อัปเดต state หลังลบ
          } catch (error) {
            console.error("❌ ลบงานล้มเหลว:", error);
            Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถลบงานได้");
          }
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <View className="flex-1 bg-gray-100 p-5">
      <Text className="text-2xl font-bold mb-5 text-center">งานของฉัน</Text>

      {loading ? (
        <Text className="text-center text-gray-500">กำลังโหลดงาน...</Text>
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View className="bg-white p-4 rounded-lg mb-4 shadow-md">
              <Text className="text-lg font-bold">{item.title}</Text>
              <Text className="text-gray-600">ชื่อบริษัท: {item.company}</Text>
              <Text className="text-gray-600">เงินเดือน: {item.salary}</Text>
              <Text className="text-gray-600">สถานที่: {item.location}</Text>
              <View className="flex-row mt-3">
                <TouchableOpacity
                  className="bg-blue-500 px-4 py-2 rounded-lg mr-2"
                  onPress={() =>
                    router.push({
                      pathname: "/editJob",
                      params: { job: JSON.stringify(item) },
                    })
                  }
                >
                  <Text className="text-white">แก้ไข</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-red-500 px-4 py-2 rounded-lg"
                  onPress={() => handleDelete(item.id)}
                >
                  <Text className="text-white">ลบ</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      <TouchableOpacity
        className="bg-green-500 p-4 rounded-lg mt-5 items-center"
        onPress={() => router.push("/postJob")}
      >
        <Text className="text-white font-bold text-lg">+ โพสต์งานใหม่</Text>
      </TouchableOpacity>
    </View>
  );
};

export default JobManagementScreen;
