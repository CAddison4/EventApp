import * as React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Confirmation({ route }) {
	const eventObj = route.params.eventObj;
	const eventAttendeeStatus = route.params.eventAttendeeStatus;

	// const event = JSON.parse(eventObj);
	return (
		<View style={styles.container}>
			<Text>{eventObj.name}</Text>
			<Text>
				{eventAttendeeStatus === "Registered"
					? `You are registered for ${eventObj.name}!`
					: `You have requested to attend ${eventObj.name}. Your request will be reviewed by the event host`}
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
