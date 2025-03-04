import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../contexts/authContext";
import { router } from "expo-router";
import * as Notifications from "expo-notifications";

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState(user?.password || "");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState(user?.phone || "");
  const [isEditing, setIsEditing] = useState(false);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);

  // โหลดข้อมูลโปรไฟล์และสถานะแจ้งเตือนจาก AsyncStorage
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("userProfile");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setName(parsedUser.name || "");
          setEmail(parsedUser.email || "");
          setPhone(parsedUser.phone || "");
        }

        // โหลดสถานะการแจ้งเตือน
        const storedNotificationStatus = await AsyncStorage.getItem(
          "notificationsEnabled"
        );
        if (storedNotificationStatus !== null) {
          setIsNotificationsEnabled(JSON.parse(storedNotificationStatus));
        }
      } catch (error) {
        console.error("Error loading user data", error);
      }
    };
    loadUserData();
  }, []);

  const handleSave = async () => {
    if (password !== confirmPassword) {
      Alert.alert("รหัสผ่านไม่ตรงกัน");
      return;
    }
    try {
      const updatedUser = { name, email, phone };
      await AsyncStorage.setItem("userProfile", JSON.stringify(updatedUser));
      Alert.alert("บันทึกข้อมูลสำเร็จ!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving user data", error);
    }
  };

  // ฟังก์ชันเปิด/ปิดการแจ้งเตือน
  const toggleNotifications = async () => {
    if (isNotificationsEnabled) {
      // ปิดการแจ้งเตือน
      Alert.alert("การแจ้งเตือนถูกปิดแล้ว");
      await AsyncStorage.setItem("notificationsEnabled", JSON.stringify(false));
      setIsNotificationsEnabled(false);
    } else {
      // ขอสิทธิ์การแจ้งเตือน
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("กรุณาอนุญาตให้แอพใช้การแจ้งเตือน");
        return;
      }

      // เปิดการแจ้งเตือน
      Alert.alert("การแจ้งเตือนถูกเปิดแล้ว");
      await AsyncStorage.setItem("notificationsEnabled", JSON.stringify(true));
      setIsNotificationsEnabled(true);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-100 p-5">
      <Text className="text-2xl font-bold mb-5">โปรไฟล์ของฉัน</Text>
      <TextInput
        className="w-full h-12 bg-white rounded-lg px-4 mb-4 border border-gray-300"
        placeholder="ชื่อ"
        value={name}
        onChangeText={setName}
        editable={isEditing}
      />
      <TextInput
        className="w-full h-12 bg-white rounded-lg px-4 mb-4 border border-gray-300"
        placeholder="อีเมล"
        value={email}
        onChangeText={setEmail}
        editable={isEditing}
      />
      <TextInput
        className="w-full h-12 bg-white rounded-lg px-4 mb-4 border border-gray-300"
        placeholder="รหัสผ่าน"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={isEditing}
      />
      <TextInput
        className="w-full h-12 bg-white rounded-lg px-4 mb-4 border border-gray-300"
        placeholder="ยืนยันรหัสผ่าน"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        editable={isEditing}
      />
      <TextInput
        className="w-full h-12 bg-white rounded-lg px-4 mb-4 border border-gray-300"
        placeholder="เบอร์โทรศัพท์"
        value={phone}
        onChangeText={setPhone}
        editable={isEditing}
      />

      {isEditing ? (
        <TouchableOpacity
          className="bg-green-500 p-4 rounded-lg w-full items-center"
          onPress={handleSave}
        >
          <Text className="text-white font-bold text-lg">บันทึก</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          className="bg-blue-500 p-4 rounded-lg w-full items-center"
          onPress={() => setIsEditing(true)}
        >
          <Text className="text-white font-bold text-lg">แก้ไขโปรไฟล์</Text>
        </TouchableOpacity>
      )}

      {/* ปุ่มเปิด/ปิดการแจ้งเตือน */}
      <TouchableOpacity
        className={`mt-4 p-4 rounded-lg w-full items-center ${
          isNotificationsEnabled ? "bg-gray-600" : "bg-yellow-500"
        }`}
        onPress={toggleNotifications}
      >
        <Text className="text-white font-bold text-lg">
          {isNotificationsEnabled ? "ปิดการแจ้งเตือน" : "เปิดการแจ้งเตือน"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="mt-4 bg-red-500 p-4 rounded-lg w-full items-center"
        onPress={logout}
      >
        <Text className="text-white font-bold text-lg">ออกจากระบบ</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;
