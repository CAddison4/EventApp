//test
import { StyleSheet } from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect } from "react";

import EventsCal from "./EventsCal";
import EventsList from "./EventsList";

const Tab = createBottomTabNavigator();

export default function MyEvents( {route} ) {
	const { eventObjs, handleFilterChange, filterValueU, filterValueM, handleRefresh, handleSetDisplayTab } = route.params;

	useEffect(() => {
        handleSetDisplayTab("My Events");
    }, []);

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
								 type: "myevents",
								 filterValueU: filterValueU,
								 filterValueM: filterValueM,
								 handleRefresh: handleRefresh,
								 handleSetDisplayTab: handleSetDisplayTab }}
			/>
			<Tab.Screen
			   	name="Calendar"
				component={EventsCal}
				initialParams={{ eventObjs: eventObjs,
					             handleFilterChange: handleFilterChange,
								 type: "myevents",
								 filterValueU: filterValueU,
								 filterValueM: filterValueM,
								 handleRefresh: handleRefresh,
								 handleSetDisplayTab: handleSetDisplayTab }}
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