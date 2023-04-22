import { StyleSheet, Text, View, Button } from "react-native";

import * as React from "react";
import axios from "axios";
import { useState, useEffect } from "react";

import EventListItem from "../../../components/EventListItem";

//Upcoming is Tier & Loyalty Events

const userId = "c9054246-70e7-4bb6-93d6-ffe80e45a575";

export default function Upcoming() {

	const [upcomingEvents, setUpcomingEvents] = useState([]);
	useEffect(() => {
		const getUpcomingUserEvents = async () => {
			const apiURL = "https://c030d30f5d.execute-api.us-west-2.amazonaws.com";
			const response = await axios.get(`${apiURL}/attendee/events/${userId}`);
			const data = response.data;
			setUpcomingEvents(data);
		};
		getUpcomingUserEvents();
	}, []);

	return (
		<View style={styles.container}>
			<Text>Upcoming Screen</Text>
			{upcomingEvents.map((eventObj) => (
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
