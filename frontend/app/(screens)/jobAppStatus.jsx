import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const JobApplicationStatusScreen = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const storedApplications = await AsyncStorage.getItem(
          "jobApplications"
        );
        if (storedApplications) {
          setApplications(JSON.parse(storedApplications));
        }
      } catch (error) {
        console.error("Error loading applications", error);
      }
    };
    loadApplications();
  }, []);

  const clearApplications = async () => {
    Alert.alert("ยืนยัน", "คุณต้องการล้างรายการสมัครงานหรือไม่?", [
      { text: "ยกเลิก", style: "cancel" },
      {
        text: "ตกลง",
        onPress: async () => {
          await AsyncStorage.removeItem("jobApplications");
          setApplications([]);
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-gray-100 p-5">
      <Text className="text-2xl font-bold mb-5 text-center">
        สถานะการสมัครงาน
      </Text>
      {applications.length === 0 ? (
        <Text className="text-center text-gray-500">
          คุณยังไม่มีการสมัครงาน
        </Text>
      ) : (
        <FlatList
          data={applications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="bg-white p-4 rounded-lg mb-4 shadow-md">
              <Text className="text-lg font-bold">{item.title}</Text>
              <Text className="text-gray-600">สถานะ: {item.status}</Text>
            </View>
          )}
        />
      )}
      {applications.length > 0 && (
        <TouchableOpacity
          className="bg-gray-500 p-4 rounded-lg mt-5 items-center"
          onPress={clearApplications}
        >
          <Text className="text-white font-bold text-lg">ล้างรายการ</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default JobApplicationStatusScreen;
