import { StyleSheet, Text, View, Button } from "react-native";

import * as React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { API_END_POINT } from '@env';
import EventListItem from "../../../components/EventListItem";

const userId = "c9054246-70e7-4bb6-93d6-ffe80e45a575";

export default function Invited({ navigation }) {

	const [invitedEvents, setInvitedEvents] = useState([]);
	useEffect(() => {
		const getInvitedUserEvents = async () => {
			const apiURL = API_END_POINT;
			const response = await axios.get(`${apiURL}/attendee/events/${userId}`);
			const data = response.data;
			setInvitedEvents(
				data.filter((event) => event.attendee_status_id === "Invited")
			);
		};
		getInvitedUserEvents();
	}, []);
	
	return (
		<View style={styles.container}>
			<Text>Invited Screen</Text>
			{invitedEvents.map((eventObj) => (
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
						title="Register"
						onPress={() =>
							//Store the EventAttendee Status in UseState and pass this status through as the status prop to the Confirmation Screen.
							// This button should call a handleInviteresponse function that removes the event from the list.
							navigation.navigate("Confirmation", {
								eventObj: eventObj,
								eventAttendeeStatus: "Registered",
							})
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
