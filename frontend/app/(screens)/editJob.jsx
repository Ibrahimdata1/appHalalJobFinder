import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import useAuth from "../contexts/authContext";
import axios from "axios";

const API_URL = "http://192.168.1.135:8000"; // 🔹 เปลี่ยนเป็น URL Backend ของคุณ

const EditJobScreen = () => {
  const { token } = useAuth();
  const job =
    useLocalSearchParams().job && JSON.parse(useLocalSearchParams().job);

  // ใช้ state เก็บข้อมูลงาน
  const [title, setTitle] = useState(job?.title || "");
  const [company, setCompany] = useState(job?.company || "");
  const [salary, setSalary] = useState(job?.salary || "");
  const [location, setLocation] = useState(job?.location || "");
  const [description, setDescription] = useState(job?.description || "");

  // ฟังก์ชันบันทึกข้อมูลที่แก้ไข
  const handleSave = async () => {
    if (!title || !location || !salary || !description) {
      Alert.alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    try {
      // ส่งข้อมูลที่แก้ไขไปอัปเดตที่ backend
      await axios.put(
        `${API_URL}/api/jobs/${job.id}`,
        {
          title,
          company,
          salary,
          location,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ ส่ง Token ไปที่ Backend
            "Content-Type": "application/json",
          },
        }
      );

      Alert.alert("บันทึกการแก้ไขสำเร็จ!");
      router.back(); // กลับไปหน้ารายการงาน
    } catch (error) {
      console.error("บันทึกงานล้มเหลว:", error);
      Alert.alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    }
  };

  return (
    <View className="flex-1 bg-gray-100 p-5">
      <Text className="text-2xl font-bold mb-5 text-center">แก้ไขงาน</Text>
      <TextInput
        className="w-full h-12 bg-white rounded-lg px-4 mb-4 border border-gray-300"
        placeholder="ชื่อตำแหน่งงาน"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        className="w-full h-12 bg-white rounded-lg px-4 mb-4 border border-gray-300"
        placeholder="ชื่อบริษัท"
        value={company}
        onChangeText={setCompany}
      />
      <TextInput
        className="w-full h-12 bg-white rounded-lg px-4 mb-4 border border-gray-300"
        placeholder="เงินเดือน"
        value={salary}
        onChangeText={setSalary}
        keyboardType="numeric"
      />
      <TextInput
        className="w-full h-12 bg-white rounded-lg px-4 mb-4 border border-gray-300"
        placeholder="สถานที่ทำงาน"
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        className="w-full h-24 bg-white rounded-lg px-4 mb-4 border border-gray-300"
        placeholder="รายละเอียดงาน"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TouchableOpacity
        className="bg-blue-500 p-4 rounded-lg mt-3 items-center"
        onPress={handleSave}
      >
        <Text className="text-white font-bold text-lg">
          บันทึกการเปลี่ยนแปลง
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="mt-4 bg-gray-500 p-4 rounded-lg items-center"
        onPress={() => router.back()}
      >
        <Text className="text-white font-bold text-lg">ยกเลิก</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditJobScreen;
