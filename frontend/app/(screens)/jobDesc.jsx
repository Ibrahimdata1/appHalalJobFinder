import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import useAuth from "../contexts/authContext";

const API_URL = "http://192.168.1.135:8000"; // ✅ เปลี่ยนเป็น URL ของ Backend

const JobDesc = () => {
  const { job } = useLocalSearchParams(); // ✅ ดึง job จาก params
  const [jobData, setJobData] = useState(job ? JSON.parse(job) : null);
  const { token } = useAuth();

  console.log("📥 job ที่ได้รับจาก params:", jobData);

  // ✅ ถ้า jobData มีแค่ ID ให้โหลดรายละเอียดงานจาก API
  useEffect(() => {
    if (!jobData) {
      console.error("❌ ไม่มีข้อมูลงาน, ไม่สามารถโหลดรายละเอียดได้");
      Alert.alert("เกิดข้อผิดพลาด", "ไม่พบข้อมูลงาน");
      return;
    }
  }, [jobData]);

  // ✅ ฟังก์ชันสมัครงานและบันทึกลง PostgreSQL
  const handleApplyJob = async () => {
    if (!jobData) return;

    try {
      const response = await axios.post(
        `${API_URL}/api/applications`,
        {
          jobId: jobData.id,
          status: "กำลังพิจารณา",
          jobtitle: jobData.title,
          jobcomp: jobData.company,
          jobsalary: jobData.salary,
          jobdesc: jobData.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ ส่ง Token ไปที่ Backend
          },
        }
      );
      console.log("job");
      if (response.status === 201) {
        Alert.alert("✅ สมัครงานสำเร็จ!", "ข้อมูลของคุณถูกบันทึกแล้ว");
        router.push("/jobAppStatus");
      }
    } catch (error) {
      console.error("❌ สมัครงานล้มเหลว:", error);
      Alert.alert("เกิดข้อผิดพลาดในการสมัครงาน");
    }
  };

  // ✅ แสดงข้อความโหลดข้อมูล ถ้ายังไม่มี jobData
  if (!jobData) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-500">กำลังโหลดข้อมูลงาน...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100 p-5">
      <Text className="text-2xl font-bold mb-3">{jobData.title}</Text>
      <Text className="text-gray-600 mb-2">
        สถานที่: {jobData.location || "ไม่ระบุ"}
      </Text>
      <Text className="text-gray-600 mb-2">เงินเดือน: {jobData.salary}</Text>
      <Text className="text-gray-800 mb-5">
        รายละเอียดงาน: {jobData.description}
      </Text>

      {/* ✅ ปุ่มสมัครงาน */}
      <TouchableOpacity
        className="bg-green-500 p-4 rounded-lg w-full items-center mb-3"
        onPress={handleApplyJob}
      >
        <Text className="text-white font-bold text-lg">สมัครงาน</Text>
      </TouchableOpacity>

      {/* ✅ ปุ่มกลับ */}
      <TouchableOpacity
        className="bg-gray-500 p-4 rounded-lg w-full items-center mb-3"
        onPress={() => router.back()}
      >
        <Text className="text-white font-bold text-lg">กลับ</Text>
      </TouchableOpacity>

      {/* ✅ ปุ่มไปหน้าจัดการ */}
      <TouchableOpacity
        className="bg-gray-500 p-4 rounded-lg w-full items-center"
        onPress={() => router.push("/jobManage")}
      >
        <Text className="text-white font-bold text-lg">ไปหน้าจัดการ</Text>
      </TouchableOpacity>
    </View>
  );
};

export default JobDesc;
