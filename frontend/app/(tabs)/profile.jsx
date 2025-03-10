import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/authContext";

const ProfileScreen = () => {
  const { logout, token } = useAuth(); // ดึง token จาก Context
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const API_URL = "http://192.168.1.135:8000";
  // ดึงข้อมูลผู้ใช้จาก Backend
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setName(response.data.name);
        setEmail(response.data.email);
        setPhone(response.data.phone);
      } catch (error) {
        console.error("Error fetching profile:", error);
        Alert.alert("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      }
    };

    fetchUserProfile();
  }, []);

  // อัปเดตข้อมูลโปรไฟล์
  const handleSave = async () => {
    if (password && password !== confirmPassword) {
      Alert.alert("รหัสผ่านไม่ตรงกัน");
      return;
    }

    try {
      await axios.put(
        `${API_URL}/api/users`,
        { name, email, phone, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert("บันทึกข้อมูลสำเร็จ!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("เกิดข้อผิดพลาดในการอัปเดตข้อมูล");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, paddingBottom: 70 }}>
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

        <TouchableOpacity
          className="mt-4 bg-red-500 p-4 rounded-lg w-full items-center"
          onPress={logout}
        >
          <Text className="text-white font-bold text-lg">ออกจากระบบ</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
