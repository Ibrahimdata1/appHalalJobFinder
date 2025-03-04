import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const screenLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="editJob" options={{ headerShown: false }} />
        <Stack.Screen name="jobAppStatus" options={{ headerShown: false }} />
        <Stack.Screen name="jobDesc" options={{ headerShown: false }} />
        <Stack.Screen name="jobManage" options={{ headerShown: false }} />
        <Stack.Screen name="jobScreen" options={{ headerShown: false }} />
        <Stack.Screen name="notiScreen" options={{ headerShown: false }} />
        <Stack.Screen name="postJob" options={{ headerShown: false }} />
      </Stack>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
    </>
  );
};

export default screenLayout;
