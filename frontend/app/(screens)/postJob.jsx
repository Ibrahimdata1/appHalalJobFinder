import { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import * as Location from "expo-location";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function PostJob() {
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [salary, setSalary] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState(null);

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "Allow location access to continue");
      return;
    }
    let currentLocation = await Location.getCurrentPositionAsync({});
    setLocation(currentLocation.coords);
  };

  const postJob = async () => {
    if (!jobTitle || !company || !salary || !location || !description) {
      Alert.alert(
        "กรอกข้อมูลให้ครบ!",
        "ต้องมีชื่อ ตำแหน่ง เงินเดือน รายละเอียดงานและพิกัด"
      );
      return;
    }

    const newJob = {
      id: Date.now(),
      title: jobTitle,
      company,
      salary,
      description,
      lat: location.latitude,
      lng: location.longitude,
    };

    let storedJobs = await AsyncStorage.getItem("jobs");
    let jobs = storedJobs ? JSON.parse(storedJobs) : [];
    jobs.push(newJob);

    await AsyncStorage.setItem("jobs", JSON.stringify(jobs));

    Alert.alert(
      "ประกาศงานสำเร็จ!",
      `ตำแหน่ง: ${jobTitle}\nบริษัท: ${company}\nเงินเดือน: ${salary}`
    );
    setJobTitle("");
    setCompany("");
    setSalary("");
    setDescription("");
    setLocation(null);
  };

  return (
    <View className="p-4">
      <Text className="text-xl font-bold">โพสต์งานใหม่</Text>

      <TextInput
        style={{
          borderWidth: 1,
          padding: 8,
          marginTop: 8,
          borderColor: "#000",
        }}
        placeholder="ชื่อตำแหน่งงาน"
        value={jobTitle}
        onChangeText={setJobTitle}
      />
      <TextInput
        style={{
          borderWidth: 1,
          padding: 8,
          marginTop: 8,
          borderColor: "#000",
        }}
        placeholder="ชื่อบริษัท"
        value={company}
        onChangeText={setCompany}
      />
      <TextInput
        style={{
          borderWidth: 1,
          padding: 8,
          marginTop: 8,
          borderColor: "#000",
        }}
        placeholder="เงินเดือน"
        value={salary}
        onChangeText={setSalary}
      />
      <TextInput
        style={{
          borderWidth: 1,
          padding: 8,
          marginTop: 8,
          borderColor: "#000",
        }}
        multiline
        placeholder="รายละเอียดงาน"
        value={description}
        onChangeText={setDescription}
      />

      <Button title="ใช้ตำแหน่ง GPS ปัจจุบัน" onPress={getLocation} />
      {location && (
        <Text className="text-green-500 mt-2">พิกัดบันทึกแล้ว! 📍</Text>
      )}

      <Button title="โพสต์งาน" onPress={postJob} />
      <Button title="กลับหน้าดูงาน" onPress={() => router.push("/jobScreen")} />
    </View>
  );
}
