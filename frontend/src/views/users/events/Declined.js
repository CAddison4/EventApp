import { StyleSheet, Text, View, Button } from "react-native";

import * as React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { API_END_POINT } from '@env'

import EventListItem from "../../../components/EventListItem";

const userId = "c9054246-70e7-4bb6-93d6-ffe80e45a575";

export default function Declined({ navigation }) {

	const [declinedEvents, setDeclinedEvents] = useState([]);
	useEffect(() => {
		const getDeclinedUserEvents = async () => {
			const apiURL = API_END_POINT;
			const response = await axios.get(`${apiURL}/attendee/events/${userId}`);
			const data = response.data;
			setDeclinedEvents(
				data.filter((event) => event.attendee_status_id === "Declined")
			);
		};
		getDeclinedUserEvents();
	}, []);

	return (
		<View style={styles.container}>
			<Text>Declined Screen</Text>

			{declinedEvents.map((eventObj) => (
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
						title="Register"
						onPress={() =>
							//Will also need to pass the user information through to this screen.
							navigation.navigate("QRCode", {
								eventObj: eventObj,
							})
						}
					/>

					<Button
						title="Waitlist?"
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
