import { StyleSheet, Text, View, Button } from "react-native";

import * as React from "react";
import { Amplify } from "aws-amplify";
import config from "./src/aws-exports";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import EventDetails from "./src/views/users/events/EventDetails";
import Confirmation from "./src/views/users/events/Confirmation";
import QRCode from "./src/views/users/events/QRCode";
import EventsList from "./src/views/users/events/EventsList";
import EventListItem from "./src/components/EventListItem";
import eventObjs from "./src/views/users/events/Invited";
import Events from "./src/views/users/events/Events";
import ProfileNavButton from "./src/components/ProfileNavButton";
import EventsCal from "./src/views/users/events/EventsCal";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

Amplify.configure(config);

export default function App() {
	return (
		<NavigationContainer>
			<Stack.Navigator
				initialRouteName="Events"
				screenOptions={{
					headerStyle: {
						backgroundColor: "#607D8B",
					},
					headerRight: () => <ProfileNavButton />,
					headerTintColor: "#fff",
					headerTitleStyle: {
						fontWeight: "bold",
					},
				}}>
				<Stack.Screen name="EventsList" component={EventsList} />
				<Stack.Screen
					name="Events"
					component={Events}
					options={{ title: "Event App" }}
				/>
				<Stack.Screen name="EventListItem" component={EventListItem} />
				<Stack.Screen name="EventDetails" component={EventDetails} />
				<Stack.Screen name="Confirmation" component={Confirmation} />
				<Stack.Screen name="QRCode" component={QRCode} />
				<Stack.Screen name="ProfileNavButton" component={ProfileNavButton} />
			</Stack.Navigator>
		</NavigationContainer>
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
