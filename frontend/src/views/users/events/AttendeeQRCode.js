import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { formatLongDate } from "../../../utilities/dates";
//import { BarCodeScanner } from 'expo-barcode-scanner';

export default function AttendeeQRCode({ route }) {

	const user = useSelector((state) => state.user);
	const { user_id, ...userData } = user;
	const firstName = userData.first_name;
	const lastName = userData.last_name;

	const eventObj = route.params.eventObj;

	return (
		<View style={styles.container}>
			<View style={styles.qrcode}
				
			/>
			<Text style={styles.title}>{firstName} {lastName}</Text>
			<Text style={styles.title}>{eventObj.event_name}</Text>
			<Text>{formatLongDate(eventObj.event_date, true)}</Text>
			<Text>{eventObj.event_location}</Text>
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
	qrcode: {
		backgroundColor: "#fff",
		color: "#000",
		height: 200,
		width: 200,
		borderStyle: "solid",
		borderWidth: 2,
		borderColor: "#000",
		marginBottom: 20,
	},
	title: {
		fontSize: 18,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 20,
	},
});
