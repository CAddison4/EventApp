import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { formatLongDate } from "../../../utilities/dates";
//import { QRCode } from "react-native-qrcode-svg";

export default function AttendeeQRCode({ route }) {

	const user = useSelector((state) => state.user);
	const { user_id, ...userData } = user;
	const firstName = userData.first_name;
	const lastName = userData.last_name;

	const eventObj = route.params.eventObj;

	return (
		<View style={styles.container}>
			<View>
				{/* <QRCode value="Hello, world!" size={200} /> */}
			</View>
			<Text style={styles.title}>{firstName} {lastName}</Text>
			<Text style={styles.title}>{eventObj.event_name}</Text>
			<Text>{formatLongDate(eventObj.event_date, true)}</Text>
			<Text>{eventObj.event_location}</Text>
			<Text style={styles.instructions}>Please present this QR code on arrival at the tournament as proof of registration.</Text>
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
	title: {
		fontSize: 18,
		fontWeight: "bold",
		textAlign: "center",
		marginTop: 20,
	},
});
