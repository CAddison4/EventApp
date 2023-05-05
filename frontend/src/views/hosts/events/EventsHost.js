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

				tabBarActiveTintColor: "tomato",
				tabBarInactiveTintColor: "gray",

				headerShown: false,
			})}>
			<Tab.Screen name="Upcoming" component={UpcomingEvents} />
			<Tab.Screen name="Past" component={PastEvents} />
		</Tab.Navigator>
	);
}
