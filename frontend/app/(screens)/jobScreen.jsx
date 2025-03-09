import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import useAuth from "../contexts/authContext";

const API_URL = "http://192.168.1.135:8000";

export default function JobScreen() {
  const { token } = useAuth();
  const [location, setLocation] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // ✅ โหลดข้อมูลงานจาก API
  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/jobs`, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ ส่ง Token ไปที่ Backend
          "Content-Type": "application/json",
        },
      });
      setJobs(response.data); // ✅ โหลดงานก่อน
      console.log("respond get job", response.data);
    } catch (error) {
      console.error("❌ โหลดข้อมูลงานล้มเหลว:", error);
      Alert.alert("เกิดข้อผิดพลาดในการโหลดงาน");
    }
  };

  // ✅ โหลดตำแหน่งแล้วจัดเรียงงานใหม่
  const fetchLocationAndSortJobs = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
      console.log("📍 Current location:", currentLocation.coords);

      // ✅ อัปเดต jobs ใหม่ โดยเรียงลำดับตามระยะทาง
      setJobs((prevJobs) => {
        return [...prevJobs].sort((a, b) => {
          const distanceA = Math.hypot(
            currentLocation.coords.latitude - a.lat,
            currentLocation.coords.longitude - a.lng
          );
          const distanceB = Math.hypot(
            currentLocation.coords.latitude - b.lat,
            currentLocation.coords.longitude - b.lng
          );
          return distanceA - distanceB;
        });
      });
    } catch (error) {
      console.error("❌ ไม่สามารถดึงตำแหน่งที่ตั้ง:", error);
    }
  };

  // ✅ โหลดข้อมูลครั้งแรก: โหลดงานก่อน แล้วค่อยหาโลเคชัน
  useEffect(() => {
    fetchJobs(); // โหลดงานจาก API
    fetchLocationAndSortJobs(); // หาโลเคชั่นแยกต่างหาก
  }, []);

  // ✅ รีเฟรชข้อมูลทั้งหมด
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchJobs();
    await fetchLocationAndSortJobs();
    setRefreshing(false);
  };

  return (
    <View className="flex-1">
      {/* ✅ แผนที่แสดงงาน */}
      <MapView
        style={{ width: "100%", height: 250 }}
        initialRegion={{
          latitude: location ? location.latitude : 13.7563,
          longitude: location ? location.longitude : 100.5018,
          latitudeDelta: 0.4,
          longitudeDelta: 0.4,
        }}
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="ตำแหน่งของคุณ"
            pinColor="blue"
          />
        )}
        {jobs.map((job) => (
          <Marker
            key={job.id}
            coordinate={{ latitude: job.lat, longitude: job.lng }}
            title={job.title}
          />
        ))}
      </MapView>

      {/* ✅ ปุ่มสำหรับโพสต์งาน */}
      <TouchableOpacity
        onPress={() => router.push("/postJob")}
        className="text-blue-500 font-montserrat font-bold p-4"
      >
        <Text className="text-black text-center">
          ประกาศหาพนักงาน (สำหรับเจ้าของร้าน)
        </Text>
      </TouchableOpacity>

      {/* ✅ รายการงาน */}
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="p-4 border-b border-gray-200">
            <Text className="text-lg font-bold">{item.title}</Text>
            <Text className="text-gray-600">{item.company}</Text>
            <Text className="text-blue-500">{item.salary}</Text>
            <Text className="text-blue-500">{item.description}</Text>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/jobDesc",
                  params: { job: JSON.stringify(item) },
                })
              }
              className="mt-2 bg-blue-500 p-2 rounded"
            >
              <Text className="text-white text-center">ดูรายละเอียดงาน</Text>
            </TouchableOpacity>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}
