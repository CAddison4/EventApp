import { StyleSheet } from "react-native";

import * as React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import MyEvents from "./MyEvents";
import Upcoming from "./Upcoming";

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

export default function Events() {
	
	return (
		<Tab.Navigator>
			<Tab.Screen
				name="Upcoming"
				component={Upcoming}
			/>
			<Tab.Screen
				name="My Events"
				component={MyEvents}
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
