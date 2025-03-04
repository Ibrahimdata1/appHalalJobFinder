import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const JobManagementScreen = () => {
  const [jobs, setJobs] = useState([]);
  // โหลดข้อมูลจาก AsyncStorage ตอนเปิดแอพ
  useEffect(() => {
    const loadJobs = async () => {
      try {
        const storedJobs = await AsyncStorage.getItem("jobs");
        if (storedJobs !== null) {
          setJobs(JSON.parse(storedJobs)); // แปลง JSON -> Array แล้วใส่ใน useState
        } else {
          // ถ้าไม่มีข้อมูล ให้ใช้ค่าเริ่มต้น
          const defaultJobs = [
            { id: "1", title: "พนักงานร้านอาหาร", location: "กรุงเทพฯ" },
            { id: "2", title: "ช่างซ่อมมือถือ", location: "นนทบุรี" },
          ];
          setJobs(defaultJobs);
          await AsyncStorage.setItem("jobs", JSON.stringify(defaultJobs)); // บันทึกค่าเริ่มต้น
        }
      } catch (error) {
        console.error("โหลดงานล้มเหลว:", error);
      }
    };

    loadJobs();
  }, []);

  const handleDelete = (id) => {
    Alert.alert("ยืนยันการลบ", "คุณต้องการลบงานนี้ใช่หรือไม่?", [
      { text: "ยกเลิก", style: "cancel" },
      {
        text: "ลบ",
        onPress: () => setJobs(jobs.filter((job) => job.id !== id)),
        style: "destructive",
      },
    ]);
  };

  return (
    <View className="flex-1 bg-gray-100 p-5">
      <Text className="text-2xl font-bold mb-5 text-center">งานของฉัน</Text>
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="bg-white p-4 rounded-lg mb-4 shadow-md">
            <Text className="text-lg font-bold">{item.title}</Text>
            <Text className="text-gray-600">ชื่อบริษัท:{item.company}</Text>
            <Text className="text-gray-600">เงินเดือน:{item.salary}</Text>
            <Text className="text-gray-600">สถานที่: {item.location}</Text>
            <View className="flex-row mt-3">
              <TouchableOpacity
                className="bg-blue-500 px-4 py-2 rounded-lg mr-2"
                onPress={() =>
                  router.push({
                    pathname: "/editJob",
                    params: {
                      job: item,
                    },
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
