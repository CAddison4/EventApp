import { StyleSheet, Text, View, Button } from "react-native";

import * as React from "react";

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
import { Amplify } from "aws-amplify";
import config from "./src/aws-exports";

Amplify.configure(config);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
	return (
		<NavigationContainer>
			<Stack.Navigator
				initialRouteName="EventsList"
				screenOptions={{
					headerStyle: {
						backgroundColor: "#607D8B",
					},
					headerTintColor: "#fff",
					headerTitleStyle: {
						fontWeight: "bold",
					},
				}}>
				<Stack.Screen
					name="EventsList"
					component={EventsList}
					options={{ title: "Event App" }}
				/>
				<Stack.Screen name="EventListItem" component={EventListItem} />
				<Stack.Screen name="EventDetails" component={EventDetails} />
				<Stack.Screen name="Confirmation" component={Confirmation} />
				<Stack.Screen name="QRCode" component={QRCode} />
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
