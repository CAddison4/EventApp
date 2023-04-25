import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import * as React from "react";
import { useEffect } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Ionicons from "@expo/vector-icons/Ionicons";
import { CommonActions } from "@react-navigation/native";

import { requireAuth } from "./src/components/middleware/AuthMiddleware";
import MainProfile from "./src/views/users/profile/MainProfile";

import AuthForm from "./src/views/AuthForm";
import Events from "./src/views/users/events/Events";
import EventDetails from "./src/views/users/events/EventDetails";
import EventsList from "./src/views/users/events/EventsList";
import EventListItem from "./src/components/EventListItem";
import EventsCal from "./src/views/users/events/EventsCal";
import Confirmation from "./src/views/users/events/Confirmation";
import QRCode from "./src/views/users/events/QRCode";

import HostMenu from "./src/views/hosts/events/HostMenu";
import CreateEvent from "./src/views/hosts/events/CreateEvent";

import { Provider, useDispatch } from "react-redux";

import store from "./src/components/store/index";

import { Amplify, Hub } from "aws-amplify";
import config from "./src/aws-exports";

Amplify.configure(config);

import eventObjs from "./src/views/users/events/Invited";

import ProfileNavButton from "./src/components/ProfileNavButton";

// import { API_URL } from "@env";
// console.log("API_URL", API_END_POINT);

const Stack = createNativeStackNavigator();

const App = () => {
	const [authenticated, setAuthenticated] = React.useState(false);

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

	const testUser = { role_id: "Host" };
	// const testUser = { role_id: "Attendee" };

	return (
		<Provider store={store}>
			<NavigationContainer>
				<Stack.Navigator
					initialRouteName={testUser.role_id == "Host" ? "HostMenu" : "Events"}
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
							<Stack.Screen name="MainProfile" component={MainProfile} />
							<Stack.Screen
								name="Events"
								component={Events}
								options={{
									title: "Event App",
									headerRight: () => <ProfileNavButton />,
								}}
							/>
							<Stack.Screen name="EventsList" component={EventsList} />
							<Stack.Screen name="EventsCal" component={EventsCal} />
							<Stack.Screen name="EventListItem" component={EventListItem} />
							<Stack.Screen name="EventDetails" component={EventDetails} />
							<Stack.Screen name="Confirmation" component={Confirmation} />
							<Stack.Screen name="QRCode" component={QRCode} />
							<Stack.Screen
								name="ProfileNavButton"
								component={ProfileNavButton}
							/>

							<Stack.Screen name="HostMenu" component={HostMenu} />

							<Stack.Screen name="CreateEvent" component={CreateEvent} />
						</>
					)}
				</Stack.Navigator>
			</NavigationContainer>
		</Provider>
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
