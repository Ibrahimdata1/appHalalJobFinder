import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import axios from "axios";
import useAuth from "../contexts/authContext";

const API_URL = "http://192.168.1.135:8000"; // 🔹 เปลี่ยนเป็น URL Backend ของคุณ

const JobApplicationStatusScreen = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  // ✅ โหลดข้อมูลการสมัครงานจาก API
  useEffect(() => {
    const fetchApplications = async () => {
      if (!token) {
        console.error("❌ ไม่มี Token, ไม่สามารถดึงข้อมูลได้");
        return;
      }
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/api/applications`, {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ ส่ง Token ไปที่ Backend
            "Content-Type": "application/json",
          },
        });
        setApplications(response.data);
        console.log("respond.data.jobApp", response.data);
      } catch (error) {
        console.error("❌ โหลดข้อมูลการสมัครล้มเหลว:", error);
        Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถโหลดข้อมูลการสมัครงานได้");
      }
      setLoading(false);
    };
    fetchApplications();
  }, []);

  // ✅ ฟังก์ชันลบทั้งหมด (พร้อมการยืนยัน)
  const clearApplications = async () => {
    Alert.alert(
      "⚠️ ยืนยันการลบทั้งหมด",
      "คุณแน่ใจหรือไม่ว่าต้องการล้างรายการสมัครงานทั้งหมด? ❌ การลบนี้ไม่สามารถกู้คืนได้!",
      [
        { text: "ยกเลิก", style: "cancel" },
        {
          text: "ลบทั้งหมด",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(`${API_URL}/api/applications/clear`, {
                headers: {
                  Authorization: `Bearer ${token}`, // ✅ ส่ง Token ไปที่ Backend
                  "Content-Type": "application/json",
                },
              });
              setApplications([]); // เคลียร์ state
              Alert.alert("✅ สำเร็จ", "ล้างรายการสมัครงานเรียบร้อยแล้ว");
            } catch (error) {
              console.error("❌ ล้างข้อมูลล้มเหลว:", error);
              Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถล้างรายการสมัครงานได้");
            }
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-100 p-5">
      <Text className="text-2xl font-bold mb-5 text-center">
        สถานะการสมัครงาน
      </Text>

      {loading ? (
        <Text className="text-center text-gray-500">กำลังโหลดข้อมูล...</Text>
      ) : applications.length === 0 ? (
        <Text className="text-center text-gray-500">
          คุณยังไม่มีการสมัครงาน
        </Text>
      ) : (
        <FlatList
          data={applications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View className="bg-white p-4 rounded-lg mb-4 shadow-md">
              <Text className="text-lg font-bold">
                ชื่อตำแหน่งงาน:{item.jobtitle}
              </Text>
              <Text className="text-gray-600">ชื่อบริษัท: {item.jobcomp}</Text>
              <Text className="text-gray-600">เงินเดือน: {item.jobsalary}</Text>
              <Text className="text-gray-600">
                รายละเอียดงาน: {item.jobdesc}
              </Text>
              <Text className="text-gray-600">สถานะ: {item.status}</Text>
            </View>
          )}
        />
      )}

      {applications.length > 0 && (
        <TouchableOpacity
          className="bg-red-500 p-4 rounded-lg mt-5 items-center"
          onPress={clearApplications} // ✅ กดแล้วมี Alert ยืนยันก่อนลบ
        >
          <Text className="text-white font-bold text-lg">❌ ล้างรายการ</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default JobApplicationStatusScreen;
