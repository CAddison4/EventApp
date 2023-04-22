import { StyleSheet, Text, View, Button } from "react-native";

import * as React from "react";
import axios from "axios";
import { useState, useEffect } from "react";

import EventListItem from "../../../components/EventListItem";

const userId = "c9054246-70e7-4bb6-93d6-ffe80e45a575";

export default function Invited({ navigation }) {

	const [invitedEvents, setInvitedEvents] = useState([]);
	useEffect(() => {
		const getInvitedUserEvents = async () => {
			const response = await axios.get(
				`https://c030d30f5d.execute-api.us-west-2.amazonaws.com/attendee/events/${userId}`
			);
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
						title="Accept"
						onPress={() =>
							//Store the EventAttendee Status in UseState and pass this status through as the status prop to the Confirmation Screen.
							// This button should call a handleInviteresponse function that removes the event from the list.
							navigation.navigate("Confirmation", {
								eventObj: eventObj,
								eventAttendeeStatus: "Registered",
							})
						}
					/>

					<Button
						title="Decline"
						onPress={() =>
							// This button should call a handleInviteresponse function that removes the event from the list.
							console.log(
								"Remove this from the list using a handleInviteResponse function."
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
