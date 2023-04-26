import { StyleSheet } from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

import EventsCal from "./EventsCal";
import EventsList from "./EventsList";
import { NavigationEvents } from "react-navigation";

const Tab = createBottomTabNavigator();

export default function MyEvents() {
	return (
		<Tab.Navigator
			initialRouteName="EventsList"
			screenOptions={({ route }) => ({
				tabBarIcon: ({ focused, color, size }) => {
					let iconName;

					if (route.name === "List") {
						iconName = focused ? "ios-list" : "ios-list-outline";
					}

					if (route.name === "Calendar") {
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
			<Tab.Screen name="List"
				component={EventsList}
				initialParams={{ type: "myevents" }} />
			<Tab.Screen name="Calendar"
				component={EventsCal}
				initialParams={{ type: "myevents" }} />
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
