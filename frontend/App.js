import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import * as React from "react";
import { useEffect } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { CommonActions } from "@react-navigation/native";

import { requireAuth } from "./src/components/middleware/AuthMiddleware";
import MainProfile from "./src/views/users/profile/MainProfile";

import AuthForm from "./src/views/AuthForm";
import EventDetails from "./src/views/users/events/EventDetails";
import Confirmation from "./src/views/users/events/Confirmation";
import QRCode from "./src/views/users/events/QRCode";
import EventsList from "./src/views/users/events/EventsList";
import EventListItem from "./src/components/EventListItem";

import EventsCal from "./src/views/users/events/EventsCal";

import { Amplify, Hub } from "aws-amplify";
import config from "./src/aws-exports";

import eventObjs from "./src/views/users/events/Invited";
import Events from "./src/views/users/events/Events";

import ProfileNavButton from "./src/components/ProfileNavButton";

import { API_END_POINT } from "@env";
console.log("API_END_POINT", API_END_POINT);

const Stack = createNativeStackNavigator();

// const Tab = createBottomTabNavigator();
Amplify.configure(config);

const App = () => {
	const [authenticated, setAuthenticated] = React.useState(false);
	// const navigation = useNavigation();

	useEffect(() => {
		Hub.listen("auth", (data) => {
			switch (data.payload.event) {
				case "signIn":
					console.log("signed in", data.payload.data);
					setAuthenticated(true);
					break;
				case "signOut":
					console.log("signed out", data.payload.data);
					setAuthenticated(false);
					break;
			}
		});
	}, []);
	return (
		<NavigationContainer>
			<Stack.Navigator
				initialRouteName="Events"
				screenOptions={{
					headerStyle: {
						backgroundColor: "#607D8B",
					},
					headerTintColor: "#fff",
					headerTitleStyle: {
						fontWeight: "bold",
					},
				}}>
				{authenticated == true ? (
					<Stack.Screen name="AuthForm" component={AuthForm} />
				) : (
					<>
						<Stack.Screen name="EventsList" component={EventsList} />
						<Stack.Screen name="EventsCal" component={EventsCal} />
						<Stack.Screen name="MainProfile" component={MainProfile} />
						<Stack.Screen
							name="Events"
							component={Events}
							options={{
								title: "Event App",
								headerRight: () => <ProfileNavButton />,
							}}
						/>
						<Stack.Screen name="EventListItem" component={EventListItem} />
						<Stack.Screen name="EventDetails" component={EventDetails} />
						<Stack.Screen name="Confirmation" component={Confirmation} />
						<Stack.Screen name="QRCode" component={QRCode} />
						<Stack.Screen
							name="ProfileNavButton"
							component={ProfileNavButton}
						/>
					</>
				)}
			</Stack.Navigator>
		</NavigationContainer>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
});

export default App;
