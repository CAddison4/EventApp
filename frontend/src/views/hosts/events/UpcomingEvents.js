import { StyleSheet } from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

import EventsCalHost from "./EventsCalHost";
import EventsListHost from "./EventsListHost";

import { setFilters } from "../../../components/store/filtersSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

const Tab = createBottomTabNavigator();

export default function Upcoming({ route }) {
	const { eventObjs, handleRefresh } = route.params;
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
