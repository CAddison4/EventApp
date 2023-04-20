import * as React from "react";
import { StyleSheet, Text, View, Button } from "react-native";

export default function EventDetails({ navigation, route }) {
	const eventObj = route.params.eventObj;
	console.log("Route", route);
	console.log("Route.params", route.params);
	console.log("eventObj", eventObj);

	// const event = JSON.parse(eventObj);
	return (
		<View>
			<View key={eventObj.id}>
				<Text>{eventObj.name}</Text>
				<Text>{eventObj.description}</Text>
				<Text>{eventObj.date}</Text>
				<Text>{eventObj.time}</Text>
				<Text>{eventObj.location}</Text>
				<Text>{eventObj.status}</Text>
			</View>
			<Button
				title="Accept"
				onPress={() =>
					//Store the EventAttendee Status in UseState and pass this status through as the status prop to the Confirmation Screen.
					navigation.navigate("Confirmation", {
						eventObj: eventObj,
						eventAttendeeStatus: "Registered",
					})
				}
			/>

			<Button
				title="Decline"
				onPress={() =>
					// This button should call a handleDecline function that removes the event from the list.
					console.log(
						"Remove this from the list using a handleDecline function."
					)
				}
			/>
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
