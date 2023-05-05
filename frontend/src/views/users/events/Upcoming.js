import { StyleSheet } from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

import EventsCal from "./EventsCal";
import EventsList from "./EventsList";

const Tab = createBottomTabNavigator();

export default function Upcoming( {route} ) {
	const { eventObjs, handleFilterChange } = route.params;

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
			<Tab.Screen
			   	name="List" 
			   	component={EventsList}
			   	initialParams={{ eventObjs: eventObjs,
					             handleFilterChange: handleFilterChange,
								 type: "upcoming" }}
			/>
			<Tab.Screen
		       	name="Calendar"
			   	component={EventsCal}
			   	initialParams={{ eventObjs: eventObjs,
					             handleFilterChange: handleFilterChange,
								 type: "upcoming" }}
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
