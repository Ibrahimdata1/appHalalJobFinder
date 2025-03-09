import { Stack } from "expo-router";

const screenLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="editJob" />
      <Stack.Screen name="jobAppStatus" />
      <Stack.Screen name="jobDesc" />
      <Stack.Screen name="jobManage" />
      <Stack.Screen name="jobScreen" />
      <Stack.Screen name="notiScreen" />
      <Stack.Screen name="postJob" />
    </Stack>
  );
};

export default screenLayout;
