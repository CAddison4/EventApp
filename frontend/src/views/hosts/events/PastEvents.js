import EventsListHost from "./EventsListHost";
import EventsCalHost from "./EventsCalHost";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";

import { StyleSheet } from "react-native";

import { setFilters } from "../../../components/store/filtersSlice";
import { useDispatch, useSelector } from "react-redux";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
const Tab = createBottomTabNavigator();

/**
 * Component for displaying past events for host
 * @component
 * @returns view of past events for host
 */

export default function PastEvents({ route }) {
	const { eventObjs, handleRefresh } = route.params;
	console.log("past eventObjs", eventObjs);

	return (
		<Tab.Navigator
			initialRouteName="EventsListHost"
			screenOptions={({ route }) => ({
				tabBarIcon: ({ focused, color, size }) => {
					let iconName;

					if (route.name === "EventsListHost") {
						iconName = focused ? "ios-list" : "ios-list-outline";
					}

					if (route.name === "EventsCalHost") {
						iconName = focused ? "calendar" : "calendar-outline";
					}
					return <Ionicons name={iconName} size={size} color={color} />;
				},
				tabBarActiveTintColor: "tomato",
				tabBarInactiveTintColor: "gray",
				tabBarShowLabel: false,
				headerShown: false,
			})}>
			<Tab.Screen
				name="EventsListHost"
				component={EventsListHost}
				initialParams={{
					eventObjs: eventObjs,
					handleRefresh: handleRefresh,
				}}
			/>
			<Tab.Screen
				name="EventsCalHost"
				component={EventsCalHost}
				initialParams={{
					eventObjs: eventObjs,
					handleRefresh: handleRefresh,
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
