import React from "react";
import { Text, View } from "react-native";

interface EditScreenInfoProps {
  path: string;
}

export const EditScreenInfo: React.FC<EditScreenInfoProps> = ({ path }) => {
  return (
    <View>
      <View className="mx-12 items-center">
        <Text className="text-center text-lg leading-6 text-gray-900 dark:text-gray-100">
          Open up the code for this screen:
        </Text>
        <View className="my-2 rounded-md px-1">
          <Text className="text-gray-900 dark:text-gray-100">{path}</Text>
        </View>
        <Text className="text-center text-lg leading-6 text-gray-900 dark:text-gray-100">
          Change any of the text, save the file, and your app will automatically update.
        </Text>
      </View>
    </View>
  );
};
