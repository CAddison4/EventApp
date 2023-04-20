import { StyleSheet, Text, View, Button } from "react-native";
import * as React from "react";
import QRCode from "./QRCode";

const eventObjs = [
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

export default function Registered({ navigation }) {
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
						title="QR Code"
						onPress={() =>
							//Will also need to pass the user information through to this screen.
							navigation.navigate("QRCode", {
								eventObj: eventObj,
							})
						}
					/>

					<Button
						title="Unregister"
						onPress={() =>
							// This button should call a handleInviteresponse function that removes the event from the list and updates the EventAttendeeStatus to Declined.
							console.log(
								"Remove this from the list using a handleDecline function."
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
