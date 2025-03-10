import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import * as Location from "expo-location";
import useAuth from "../contexts/authContext";
import axios from "axios";

const API_URL = "http://192.168.1.135:8000"; // เปลี่ยนเป็น URL Backend
const NOMINATIM_API_URL = "https://nominatim.openstreetmap.org/search"; // OpenStreetMap API

export default function PostJob() {
  const { token } = useAuth();
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [salary, setSalary] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState("");

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "Allow location access to continue");
      return;
    }
    let currentLocation = await Location.getCurrentPositionAsync({});
    setLocation({
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    });
  };

  const postJob = async () => {
    if (!jobTitle || !company || !salary || !location || !description) {
      Alert.alert(
        "กรอกข้อมูลให้ครบ!",
        "ต้องมีชื่อตำแหน่ง เงินเดือน รายละเอียดงาน และพิกัด"
      );
      return;
    }

    const newJob = {
      title: jobTitle,
      company,
      salary,
      description,
      lat: location.latitude,
      lng: location.longitude,
    };

    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/jobs`, newJob, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ ส่ง Token ไปที่ Backend
          "Content-Type": "application/json",
        },
      });
      Alert.alert(
        "ประกาศงานสำเร็จ!",
        `ตำแหน่ง: ${jobTitle}\nบริษัท: ${company}`
      );
      setJobTitle("");
      setCompany("");
      setSalary("");
      setDescription("");
      setLocation(null);
    } catch (error) {
      Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถโพสต์งานได้");
    }
    setLoading(false);
  };

  const searchLocation = async (text) => {
    setQuery(text);
    if (text.length < 3) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await axios.get(`${NOMINATIM_API_URL}`, {
        params: {
          q: text,
          format: "json",
          addressdetails: 1,
          limit: 5,
        },
        headers: {
          "User-Agent": "MyApp/1.0 (contact@example.com)", // ใส่อีเมลจริงเพื่อให้ API ยอมรับ
          "Accept-Language": "th", // ให้ผลลัพธ์เป็นภาษาไทย
        },
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
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

        {/* 🔹 ค้นหาสถานที่โดยใช้ OpenStreetMap (Nominatim API) */}
        <TextInput
          style={{
            borderWidth: 1,
            padding: 8,
            marginTop: 8,
            borderColor: "#000",
          }}
          placeholder="ค้นหาสถานที่ทำงาน..."
          value={query}
          onChangeText={searchLocation}
        />
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.place_id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                padding: 10,
                borderBottomWidth: 1,
                borderBottomColor: "#ccc",
              }}
              onPress={() => {
                setLocation({
                  latitude: parseFloat(item.lat),
                  longitude: parseFloat(item.lon),
                });
                setQuery(item.display_name);
                setSearchResults([]);
              }}
            >
              <Text>{item.display_name}</Text>
            </TouchableOpacity>
          )}
        />

        {/* 🔹 MapView (OpenStreetMap) */}
        <MapView
          provider={PROVIDER_DEFAULT} // ✅ ใช้ OpenStreetMap แทน Google Maps
          style={{ height: 300, marginTop: 8 }}
          region={{
            latitude: location?.latitude || 13.736717, // Default กรุงเทพ
            longitude: location?.longitude || 100.523186,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          onPress={(e) => setLocation(e.nativeEvent.coordinate)}
        >
          {location && <Marker coordinate={location} />}
        </MapView>

        <Button title="ใช้ตำแหน่งปัจจุบัน" onPress={getCurrentLocation} />
        {location && (
          <Text className="text-green-500 mt-2">พิกัดบันทึกแล้ว! 📍</Text>
        )}

        <Button
          title={loading ? "กำลังโพสต์..." : "โพสต์งาน"}
          onPress={postJob}
          disabled={loading}
        />
      </View>
    </SafeAreaView>
  );
}
