import { View, Text, Button } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import UpcomingEvents from "./UpcomingEvents";
import PastEvents from "./PastEvents";
import Ionicons from "react-native-vector-icons/Ionicons";

const Tab = createMaterialTopTabNavigator();

export default function Events({ navigation }) {
	return (
		<Tab.Navigator
			initialRouteName="Upcoming"
			screenOptions={({ route }) => ({
				// tabBarIcon: ({ focused, color, size }) => {
				// 	let iconName;

				// 	if (route.name === "Upcoming") {
				// 		iconName = focused
				// 			? "chevron-up-circle"
				// 			: "chevron-up-circle-outline";
				// 	}

				// 	if (route.name === "Past") {
				// 		iconName = focused ? "time" : "time-outline";
				// 	}
				// 	// You can return any component that you like here!
				// 	return <Ionicons name={iconName} size={size} color={color} />;
				// },
				tabBarActiveTintColor: "tomato",
				tabBarInactiveTintColor: "gray",

				headerShown: false,
			})}>
			<Tab.Screen name="Upcoming" component={UpcomingEvents} />
			<Tab.Screen name="Past" component={PastEvents} />
		</Tab.Navigator>
	);
}
