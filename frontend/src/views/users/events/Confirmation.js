import * as React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Confirmation({ route }) {
	const eventObj = route.params.eventObj;
	const eventAttendeeStatus = route.params.status;

	// const event = JSON.parse(eventObj);
	return (
		<View style={styles.container}>
			<Text>
				{(() => {
					switch (eventAttendeeStatus) {
					case "Registered":
						return "You are registered for";
					case "Waitlisted":
						return "You are waitlisted for";
					case "Withdrawn":
						return "You have withdrawn from";
					case "Removed":
						return "You have been removed from the waitlist for";
					default:
						return "";
					}
				})()}
			</Text>
			<Text style={styles.boldText}>{eventObj.event_name}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
		width: "100%",
		paddingLeft: 10,
		paddingRight: 10,
	},
	boldText: {
		fontWeight: "bold",
		fontSize: 16,
	},
});
