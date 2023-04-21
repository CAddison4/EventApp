import { StyleSheet, Text, View, Button } from "react-native";

import * as React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import EventDetails from "./EventDetails";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export const eventObjs = [
	{
		id: 1,
		name: "Event 1",
		description: "This is the first event",
		date: "2021-10-10",
		time: "10:00",
		location: "Location 1",
		status: "Invited",
	},
	{
		id: 2,
		name: "Event 2",
		description: "This is the second event",
		date: "2021-10-10",
		time: "10:00",
		location: "Location 2",
		status: "Invited",
	},
];
export default function Invited({ navigation }) {
	return (
		<View style={styles.container}>
			<Text>Invited Screen</Text>
			{eventObjs.map((eventObj) => (
				<View>
					<View key={eventObj.id}>
						<Text
							onPress={() =>
								navigation.navigate("EventDetails", {
									eventObj: eventObj,
								})
							}>
							<Text>{eventObj.name}</Text>
							<Text>{eventObj.description}</Text>
							<Text>{eventObj.date}</Text>
							<Text>{eventObj.time}</Text>
							<Text>{eventObj.location}</Text>
							<Text>{eventObj.status}</Text>
						</Text>
					</View>
					<Button
						title="Accept"
						onPress={() =>
							//Store the EventAttendee Status in UseState and pass this status through as the status prop to the Confirmation Screen.
							// This button should call a handleInviteresponse function that removes the event from the list.
							navigation.navigate("Confirmation", {
								eventObj: eventObj,
								eventAttendeeStatus: "Registered",
							})
						}
					/>

					<Button
						title="Decline"
						onPress={() =>
							// This button should call a handleInviteresponse function that removes the event from the list.
							console.log(
								"Remove this from the list using a handleInviteResponse function."
							)
						}
					/>
				</View>
			))}
		</View>
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
