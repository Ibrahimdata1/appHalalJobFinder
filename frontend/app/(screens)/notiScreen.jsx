import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";

const notiScreen = () => {
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      message: "มีผู้สมัครงานสำหรับตำแหน่ง พนักงานร้านอาหาร",
      type: "job_application",
    },
    { id: "2", message: "งานของคุณได้รับการตอบกลับ", type: "job_response" },
  ]);

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  return (
    <View className="flex-1 bg-gray-100 p-5">
      <Text className="text-2xl font-bold mb-5 text-center">การแจ้งเตือน</Text>
      {notifications.length === 0 ? (
        <Text className="text-center text-gray-500">ไม่มีการแจ้งเตือน</Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="bg-white p-4 rounded-lg mb-4 shadow-md">
              <Text className="text-gray-800">{item.message}</Text>
            </View>
          )}
        />
      )}
      {notifications.length > 0 && (
        <TouchableOpacity
          className="bg-red-500 p-4 rounded-lg mt-5 items-center"
          onPress={handleClearNotifications}
        >
          <Text className="text-white font-bold text-lg">ล้างการแจ้งเตือน</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default notiScreen;
