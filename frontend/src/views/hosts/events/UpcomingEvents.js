import { StyleSheet } from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

import EventsCalHost from "./EventsCalHost";
import EventsListHost from "./EventsListHost";

const Tab = createBottomTabNavigator();

export default function Upcoming() {
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
					// You can return any component that you like here!
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
				initialParams={{ type: "upcoming" }}
			/>
			<Tab.Screen
				name="EventsCalHost"
				component={EventsCalHost}
				initialParams={{ type: "upcoming" }}
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
