import { StyleSheet, Text, View, Button } from "react-native";

import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

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

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const userId = "c9054246-70e7-4bb6-93d6-ffe80e45a575";

export default function EventsList() {

	const [invitedCount, setInvitedCount] = useState([]);
	const [registeredCount, setRegisteredCount] = useState([]);
	const [declinedCount, setDeclinedCount] = useState([]);
	const [upcomingCount, setUpcomingCount] = useState([]);
	useEffect(() => {
		const getUserEventCounts = async () => {
			const apiURL = "https://c030d30f5d.execute-api.us-west-2.amazonaws.com";
			const response = await axios.get(`${apiURL}/eventcounts/${userId}`);
			const data = response.data;
			let upcoming = 0;
			upcoming = parseInt(upcoming);
			data.forEach(element => {
				upcoming += parseInt(element.count);
				switch (element.attendee_status_id) {
					case "Registered":
						setRegisteredCount(element.count);
						break;
					case "Invited":
						setInvitedCount(element.count);
						break;
					case "Declined":
						setDeclinedCount(element.count);
						break;
					default:
						break;
				}	
			});
			setUpcomingCount(upcoming);
		};
		getUserEventCounts();
	}, []);

	return (
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
					// if (route.name === "EventsCal") {
					// 	iconName = focused ? "calendar" : "calendar-outline";
					// }
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
			<Tab.Screen
				name="Upcoming"
				component={Upcoming}
					options={{ tabBarBadge: upcomingCount,
						       tabBarBadgeStyle: { color: 'white', backgroundColor: 'red', fontSize: 11 },
					}}
			/>
			<Tab.Screen
				name="Invited"
				component={Invited}
					options={{ tabBarBadge: invitedCount,
							   tabBarBadgeStyle: { color: 'white', backgroundColor: 'red', fontSize: 11 },
					}}
			/>
			<Tab.Screen
				name="Registered"
				component={Registered}
					options={{ tabBarBadge: registeredCount,
							   tabBarBadgeStyle: { color: 'white', backgroundColor: 'red', fontSize: 11 },
					}}
			/>
			<Tab.Screen
				name="Declined"
				component={Declined}
					options={{ tabBarBadge: declinedCount,
							   tabBarBadgeStyle: { color: 'white', backgroundColor: 'red', fontSize: 11 },
					}}
			/>
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
