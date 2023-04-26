import { StyleSheet, Text, View, Button } from "react-native";

import * as React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
// import Declined from "./Declined";
// import Invited from "./Invited";
// import Registered from "./Registered";
import MyEvents from "./MyEvents";
import Upcoming from "./Upcoming";
// import EventsCal from "./EventsCal";
// import EventsList from "./EventsList";
import { eventObjs } from "./Invited";

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

export default function Events() {
	return (
		<Tab.Navigator>
			{/* screenOptions={({ route }) => ({
				tabBarIcon: ({ focused, color, size }) => {
					let iconName;

					// if (route.name === "Upcoming") {
					// 	iconName = focused ? "ios-list" : "ios-list-outline";
					// }

					// if (route.name === "My Events") {
					// 	iconName = focused ? "calendar" : "calendar-outline";
					// }

					// You can return any component that you like here!
					return <Ionicons name={iconName} size={size} color={color} />;
				},
				tabBarActiveTintColor: "tomato",
				tabBarInactiveTintColor: "gray",
				// tabBarShowLabel: false,
			})}> */}
			<Tab.Screen name="Upcoming" component={Upcoming} />
			<Tab.Screen name="My Events" component={MyEvents} />
			{/* <Tab.Screen name="EventsList" component={EventsList} />
			<Tab.Screen name="EventsCal" component={EventsCal} /> */}
		</Tab.Navigator>
	);
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
});
