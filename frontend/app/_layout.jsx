import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { Montserrat_700Bold } from "@expo-google-fonts/montserrat";
import { Stack, router } from "expo-router";
import { useNavigation } from "expo-router";
import { AuthProvider } from "./contexts/authContext";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import "../global.css";

const RootLayout = () => {
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    poppinsRegular: Poppins_400Regular,
    poppinsBold: Poppins_700Bold,
    montserrat: Montserrat_700Bold,
  });
  if (!fontsLoaded) {
    return null;
  }
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#0f172a" }, // สีพื้นหลังของ Header
          headerTintColor: "#fff", // สีตัวอักษร
          headerTitleStyle: { fontSize: 20, fontWeight: "bold" },
          headerLeft: ({ canGoBack }) =>
            canGoBack ? ( // ตรวจสอบว่ามีหน้าก่อนหน้าหรือไม่
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{ margin: 10 }}
              >
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
            ) : null,
        }}
      >
        <Stack.Screen name="index" />
      </Stack>
    </AuthProvider>
  );
};

export default RootLayout;
