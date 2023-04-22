import { StyleSheet, Text, View, Button } from "react-native";
import * as React from "react";
import QRCode from "./QRCode";
import EventListItem from "../../../components/EventListItem";
import { API } from "aws-amplify";
import { useEffect, useState } from "react";
import axios from "axios";

const userId = "4283c2ad-b9ab-41d6-bc02-597125f21ccd";

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
			const apiURL = "https://44rfrxgjq6.execute-api.us-west-2.amazonaws.com";
			const response = await axios.get(`${apiURL}/attendee/events/${userId}`);
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
				<View>
					{/* This could probably be combined into a single component once we decide on what to display here (currently duplicated in multiple views).*/}
					<View key={`${eventObj.event_id}${eventObj.user_id}`}>
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
