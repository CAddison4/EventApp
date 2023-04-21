import { StyleSheet, Text, View, Button } from "react-native";

import * as React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import Declined from "./Declined";
import Invited from "./Invited";
import Registered from "./Registered";
import Upcoming from "./Upcoming";
import EventsCal from "./EventsCal";
import { eventObjs } from "./Invited";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function EventsList() {
	return (
		// <NavigationContainer>
		// 	<Stack.Navigator
		// 		initialRouteName="Home"
		// 		screenOptions={{
		// 			headerStyle: {
		// 				backgroundColor: "#BE3455",
		// 			},
		// 			headerTintColor: "#fff",
		// 			headerTitleStyle: {
		// 				fontWeight: "bold",
		// 			},
		// 		}}>
		// 		<Stack.Screen
		// 			name="Home"
		// 			component={Home}
		// 			options={{ title: "Event App" }}
		// 		/>
		// 	</Stack.Navigator>
		// </NavigationContainer>
		<Tab.Navigator
			initialRouteName="Invited"
			screenOptions={({ route }) => ({
				tabBarIcon: ({ focused, color, size }) => {
					let iconName;

					if (route.name === "Upcoming") {
						iconName = focused ? "ios-list" : "ios-list-outline";
					}
					if (route.name === "Invited") {
						iconName = focused ? "mail" : "mail-outline";
					}
					if (route.name === "EventsCal") {
						iconName = focused ? "calendar" : "calendar-outline";
					}
					if (route.name === "Registered") {
						iconName = focused
							? "checkmark-circle"
							: "checkmark-circle-outline";
					}
					if (route.name === "Declined") {
						iconName = focused ? "close-circle" : "close-circle-outline";
					}

					// You can return any component that you like here!
					return <Ionicons name={iconName} size={size} color={color} />;
				},
				tabBarActiveTintColor: "tomato",
				tabBarInactiveTintColor: "gray",
			})}>
			<Tab.Screen name="Upcoming" component={Upcoming} />
			<Tab.Screen
				name="Invited"
				component={Invited}
				options={{ tabBarBadge: eventObjs.length }}
			/>
			<Tab.Screen name="EventsCal" component={EventsCal} />
			<Tab.Screen name="Registered" component={Registered} />
			<Tab.Screen name="Declined" component={Declined} />
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
