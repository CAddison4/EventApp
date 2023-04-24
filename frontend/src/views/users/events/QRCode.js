import * as React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function QRCode({ route }) {
	const eventObj = route.params.eventObj;

	// const event = JSON.parse(eventObj);
	return (
		//We may or may not want a "Close" button here. Currently the Header contains a "Go Back" button.
		//We may want to turn off that feature for certain pages or update it to home. Could need to use State to do this.
		<View style={styles.container}>
			<Text>QR Code</Text>
			<Text>{eventObj.name}</Text>
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
