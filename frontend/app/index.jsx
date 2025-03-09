import { View, Text, ScrollView, StatusBar, Image } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as NavigationBar from "expo-navigation-bar";
import { useEffect } from "react";
import images from "../assets/images";
import CustomButton from "../components/customButton";

export default function Index() {
  useEffect(() => {
    NavigationBar.setBackgroundColorAsync("#0f172a");
  }, []);
  return (
    <SafeAreaView className="bg-slate-900 flex-1 ">
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <View className="w-full mt-4 justify-center items-center px-4 ">
          <Image
            source={images.banner}
            className="w-1/2 h-20 mb-6"
            resizeMode="contain"
          />
          <Image source={images.work} className="w-[290px] h-[180px]" />
        </View>
        <View className="relative mt-5 ">
          <Text className="text-3xl text-white font-bold text-center">
            Apply Halal Job at <Text className="text-orange-600">JobHalal</Text>
          </Text>
        </View>
        <Text className="text-sm font-poppins text-gray-100 mt-7 text-center">
          opportunities to find halal job near your place. we create halal
          community for muslim
        </Text>
        <CustomButton
          title="continue with email"
          handlePress={() => router.push("/signIn")}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
