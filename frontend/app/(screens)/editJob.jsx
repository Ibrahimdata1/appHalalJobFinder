import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EditJobScreen = () => {
  const job =
    useLocalSearchParams().job && JSON.parse(useLocalSearchParams().job);
  const [title, setTitle] = useState(job?.title || "");
  const [company, setCompany] = useState(job?.company || "");
  const [salary, setSalary] = useState(job?.salary || "");
  const [location, setLocation] = useState(job?.location || "");
  const [description, setDescription] = useState(job?.description || "");

  const handleSave = async () => {
    if (!title || !location || !salary || !description) {
      Alert.alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    Alert.alert("บันทึกการแก้ไขสำเร็จ!");
    try {
      const storedJobs = await AsyncStorage.getItem("jobs");
      let jobs = storedJobs ? JSON.parse(storedJobs) : [];

      jobs = jobs.map((jobStorage) =>
        jobStorage.id === job.id
          ? { ...jobStorage, title, company, salary, location, description }
          : jobStorage
      );

      await AsyncStorage.setItem("jobs", JSON.stringify(jobs));
      Alert.alert("บันทึกการแก้ไขสำเร็จ!");
      router.back(); // กลับไปที่หน้าจัดการงาน
    } catch (error) {
      console.error("บันทึกงานล้มเหลว:", error);
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
