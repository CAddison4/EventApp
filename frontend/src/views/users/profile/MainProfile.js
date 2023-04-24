import { StyleSheet, Text, View, Button } from "react-native";

import * as React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const  MainProfile = () => {

    return (
        <View >
            <Text>Home Screen</Text>
        </View>
    );
}

export default MainProfile;