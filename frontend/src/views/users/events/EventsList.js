import { StyleSheet, Text, View, Button } from "react-native";

import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
// import Declined from "./Declined";
// import Invited from "./Invited";
// import MyEvents from "./MyEvents";
// import Registered from "./Registered";
import Upcoming from "./Upcoming";
import EventsCal from "./EventsCal";
import { API_END_POINT } from "@env";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const userId = "c9054246-70e7-4bb6-93d6-ffe80e45a575";

export default function EventsList() {
	// const [invitedCount, setInvitedCount] = useState([]);
	// const [registeredCount, setRegisteredCount] = useState([]);
	// const [declinedCount, setDeclinedCount] = useState([]);
	const [myEventsCount, setMyEventsCount] = useState([]);
	const [upcomingCount, setUpcomingCount] = useState([]);
	useEffect(() => {
		const getUserEventCounts = async () => {
			const apiURL = API_END_POINT;
			const response = await axios.get(`${apiURL}eventcounts/${userId}`);
			const data = response.data;
			// let upcoming = 0;
			// upcoming = parseInt(upcoming);
			// data.forEach((element) => {
			// 	upcoming += parseInt(element.count);
			// 	switch (element.attendee_status_id) {
			// 		case "Registered":
			// 			setRegisteredCount(element.count);
			// 			break;
			// 		case "Invited":
			// 			setInvitedCount(element.count);
			// 			break;
			// 		case "Declined":
			// 			setDeclinedCount(element.count);
			// 			break;
			// 		default:
			// 			break;
			// 	}
			// });
			// setUpcomingCount(upcoming);
		};
		getUserEventCounts();
	}, []);

	return (
		<Text>My Events</Text>
		// <Tab.Navigator
		// 	initialRouteName="My Events"
		// 	screenOptions={({ route }) => ({
		// 		tabBarIcon: ({ focused, color, size }) => {
		// 			let iconName;

		// 			if (route.name === "Upcoming") {
		// 				iconName = focused ? "ios-list" : "ios-list-outline";
		// 			}
		// 			if (route.name === "My Events") {
		// 				iconName = focused ? "ios-list" : "ios-list-outline";
		// 			}

		// 			return <Ionicons name={iconName} size={size} color={color} />;
		// 		},
		// 		tabBarActiveTintColor: "tomato",
		// 		tabBarInactiveTintColor: "gray",
		// 	})}>
		// 	<Tab.Screen
		// 		name="Upcoming"
		// 		component={Upcoming}
		// 		options={{
		// 			// tabBarBadge: upcomingCount,
		// 			tabBarBadgeStyle: {
		// 				color: "white",
		// 				backgroundColor: "red",
		// 				fontSize: 11,
		// 			},
		// 		}}
		// 	/>
		// 	<Tab.Screen
		// 		name="My Events"
		// 		component={MyEvents}
		// 		options={{
		// 			// tabBarBadge: invitedCount,
		// 			tabBarBadgeStyle: {
		// 				color: "white",
		// 				backgroundColor: "red",
		// 				fontSize: 11,
		// 			},
		// 		}}
		// 	/>
		// </Tab.Navigator>
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
