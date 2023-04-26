import { View, Text, Button } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import UpcomingEvents from "./UpcomingEvents";
import PastEvents from "./PastEvents";
import Ionicons from "react-native-vector-icons/Ionicons";

const Tab = createBottomTabNavigator();

export default function Events({ navigation }) {
	return (
		<Tab.Navigator
			initialRouteName="UpcomingEvents"
			screenOptions={({ route }) => ({
				tabBarIcon: ({ focused, color, size }) => {
					let iconName;

					if (route.name === "UpcomingEvents") {
						iconName = focused
							? "chevron-up-circle"
							: "chevron-up-circle-outline";
					}

					if (route.name === "PastEvents") {
						iconName = focused ? "time" : "time-outline";
					}
					// You can return any component that you like here!
					return <Ionicons name={iconName} size={size} color={color} />;
				},
				tabBarActiveTintColor: "tomato",
				tabBarInactiveTintColor: "gray",

				headerShown: false,
			})}>
			<Tab.Screen name="UpcomingEvents" component={UpcomingEvents} />
			<Tab.Screen name="PastEvents" component={PastEvents} />
		</Tab.Navigator>
	);
}
