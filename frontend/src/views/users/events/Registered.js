import { StyleSheet, Text, View, Button } from "react-native";
import * as React from "react";
import QRCode from "./QRCode";
import EventListItem from "../../../components/EventListItem";
import { API } from "aws-amplify";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_END_POINT } from '@env';

const userId = "c9054246-70e7-4bb6-93d6-ffe80e45a575";

export default function Registered({ navigation }) {
	const [registeredEvents, setRegisteredEvents] = useState([]);
	useEffect(() => {
		// const apiURL = "https://44rfrxgjq6.execute-api.us-west-2.amazonaws.com";
		// API.get(
		// 	"https://44rfrxgjq6.execute-api.us-west-2.amazonaws.com",
		// 	"/attendee/events/" + userId
		// ).then((response) => {
		// 	console.log("test", response);
		// });
		const getRegisteredUserEvents = async () => {
			const response = await axios.get(`${API_END_POINT}/attendee/events/${userId}`);
			const data = response.data;
			setRegisteredEvents(
				data.filter((event) => event.attendee_status_id === "Registered")
			);
		};
		getRegisteredUserEvents();
	}, []);

	return (
		<View style={styles.container}>
			<Text>Registered Screen</Text>

			{registeredEvents.map((eventObj) => (
				<View key={`${eventObj.event_id}${eventObj.user_id}`}>
					{/* This could probably be combined into a single component once we decide on what to display here (currently duplicated in multiple views).*/}
					<View>
						<Text
							onPress={() =>
								navigation.navigate("EventDetails", {
									eventObj: eventObj,
								})
							}>
							<EventListItem eventObj={eventObj} />
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
						title="Withdraw"
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
