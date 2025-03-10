import { View, Text, Image } from "react-native";
import { Tabs, Redirect } from "expo-router";
import { Home, Pencil, User, Bookmark } from "lucide-react-native";
import { useEffect } from "react";
import * as NavigationBar from "expo-navigation-bar";

const TabIcon = ({ IconComponent, color }) => {
  useEffect(() => {
    NavigationBar.setBackgroundColorAsync("#161622");
  }, []);
  return (
    <View>
      <IconComponent size={24} color={color} />
    </View>
  );
};
const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#FFA001",
          tabBarInactiveTintColor: "#CDCDE0",
          tabBarStyle: {
            backgroundColor: "#161622",
            borderTopLeftRadius: 15, // ✅ เพิ่มขอบมน
            borderTopRightRadius: 15,
            paddingBottom: 10, // ✅ ป้องกันการบัง UI
          },
          tabBarHideOnKeyboard: true, // ✅ ซ่อน Tab Bar เมื่อลูกค้าใช้คีย์บอร์ด
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <TabIcon IconComponent={Home} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="jobScreen"
          options={{
            title: "jobScreen",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <TabIcon IconComponent={Pencil} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="postJob"
          options={{
            title: "postJob",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <TabIcon IconComponent={Bookmark} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <TabIcon IconComponent={User} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;
