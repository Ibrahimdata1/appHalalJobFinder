import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import images from "../../assets/images";
import { useAuth } from "../contexts/authContext";
import { useState } from "react";
import axios from "axios";

const API_URL = "http://192.168.1.135:8000"; // เปลี่ยนเป็น IP จริงของ Backend

const SignIn = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      if (response.status === 200) {
        const { token, user } = response.data;
        login(user, token); // อัปเดต Context ด้วยข้อมูลผู้ใช้ + Token
        Alert.alert("เข้าสู่ระบบสำเร็จ!");
        router.push("/jobScreen");
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาด:", error);
      Alert.alert(
        error.response?.data?.message || "เข้าสู่ระบบล้มเหลว กรุณาลองใหม่"
      );
    }
  };

  return (
    <LinearGradient colors={["#1e293b", "#0f172a"]} style={{ flex: 1 }}>
      <SafeAreaView className="bg-slate-900 h-full">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        >
          <View className="justify-center gap-10 items-center mx-4">
            {/* โลโก้แอพ */}
            <Image
              source={images.banner}
              resizeMode="contain"
              className="w-1/2 h-20"
            />

            {/* หัวข้อ */}
            <Text className="text-lg text-white font-bold">
              Sign in to JobFinder
            </Text>

            {/* ฟอร์มกรอกข้อมูล */}
            <View className="w-full mt-6">
              <Text className="text-white text-lg mb-2">Email</Text>
              <TextInput
                className="bg-white text-black p-3 rounded-lg w-full"
                placeholder="Enter your email"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />

              <Text className="text-white text-lg mt-4 mb-2">Password</Text>
              <TextInput
                className="bg-white text-black p-3 rounded-lg w-full"
                placeholder="Enter your password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            {/* ปุ่ม Sign In */}
            <TouchableOpacity
              className="bg-blue-500 p-4 rounded-lg w-full items-center mt-6"
              onPress={handleLogin}
            >
              <Text className="text-white text-lg font-bold">Sign In</Text>
            </TouchableOpacity>

            {/* ปุ่มไปหน้า Sign Up */}
            <TouchableOpacity onPress={() => router.push("/signUp")}>
              <Text className="text-blue-400 text-sm mt-4">
                ยังไม่มีบัญชี? <Text className="font-bold">สมัครสมาชิก</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default SignIn;
