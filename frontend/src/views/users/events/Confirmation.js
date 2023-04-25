import * as React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Confirmation({ route }) {
	const eventObj = route.params.eventObj;
	const eventAttendeeStatus = route.params.status;

	// const event = JSON.parse(eventObj);
	return (
		<View style={styles.container}>
			<Text>{eventObj.name}</Text>
			<Text>
				{(() => {
					switch (eventAttendeeStatus) {
					case "Registered":
						return `You are registered for ${eventObj.event_name}!`;
					case "Waitlisted":
						return `You are waitlisted for ${eventObj.event_name}.`;
					case "Withdrawn":
						return `You have withdrawn from ${eventObj.event_name}.`;
					case "Removed":
						return `You have been removed from the waitlist for ${eventObj.event_name}.`;
					default:
						return "";
					}
				})()}
			</Text>
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
