import { StyleSheet, Text, View, Button } from "react-native";

import * as React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSelector } from "react-redux";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainProfile = () => {
  const user = useSelector((state) => state.user);


  if (!user) {
    return <Text>Loading...</Text>;
  }
  return (
    <View>
      {Object.keys(user).map((key) => (
        <View key={key}>
          <Text>
            {key}: {user[key]}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default MainProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
