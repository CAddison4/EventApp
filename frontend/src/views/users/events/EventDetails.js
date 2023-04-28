import * as React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { formatDate, formatDateTime } from "../../../utilities/dates";

import { registerForEvent, withdrawFromEvent } from "../../../actions/EventActions";
import { waitlistForEvent, removeFromEventWaitlist } from "../../../actions/WaitlistActions";

import { useState, useEffect } from "react";
import axios from "axios";
import { API_END_POINT } from '@env';

export default function EventDetails({ navigation, route }) {
	const { eventObj, userId } = route.params;

	/* const contextEvent = useSelector((state) => state.event);
	console.log("contextEvent", conextEvent); */

	const [waitlistPosition, setWaitlistPosition] = useState(0);

	useEffect(() => {
		const getWaitlistPosition = async () => {
			const response = await axios.get(`${API_END_POINT}waitlistposition/${eventObj.event_id}/${userId}`);
			return response.data.waitlistPosition;
		};
		const fetchData = async () => {
			const position = await getWaitlistPosition();
			setWaitlistPosition(position);
		  };
		fetchData();	
	}, []);

	function updateEventFlag(type) {
		switch (type) {
			case "Waitlist":
				updatedEvent = { ...eventObj, isInWaitlist: true };
				break;
			case "Remove":
				updatedEvent = { ...eventObj, isInWaitlist: false };
				break;	
			case "Register":
				updatedEvent = { ...eventObj, isAttending: true };
				break;
			case "Withdraw":
				updatedEvent = { ...eventObj, isAttending: false };
				break;
			default:
				break;
		}
	}

	return (
		<View style={styles.container}>
			<Text style={styles.heading}>{eventObj.event_name}</Text>
			<View style={styles.textRows} key={`${eventObj.event_id}${eventObj.user_id}`}>	
				<View style={styles.textColumn}>
					<Text>Event date:</Text>
					<Text>Event start:</Text>
					<Text>Location:</Text>
					<Text>Your status:</Text>
					{eventObj.isInWaitlist ? <Text>Current position:</Text> : null}
				</View>
				<View style={styles.textColumn}>
					<Text>{formatDate(eventObj.event_date)}</Text>
					<Text>{formatDateTime(eventObj.event_start)}</Text>
					<Text>{eventObj.event_location}</Text>
					<Text>{eventObj.isInWaitlist ? "Waitlisted" : eventObj.attendee_status_id}</Text>
					{eventObj.isInWaitlist ? <Text>{waitlistPosition}</Text> : null}
				</View>
			</View>
			<View style={styles.actionButton}>
				{/* If eligible and in the waitlist,
				button should say "Remove" */}
				{eventObj.isEligible && eventObj.isInWaitlist && (
					<Button
						title="Remove from Waitlist"
						onPress={() => {
							removeFromEventWaitlist(eventObj, userId);
							updateEventFlag("Remove");
							navigation.navigate("Confirmation", {
								eventObj: eventObj,
								status: "Removed" 
							});
						}}
					/>
				)}
				{/* If eligible and already attending and not in waitlist,
				button should say "Withdraw" */}
				{eventObj.isEligible && eventObj.isAttending && !eventObj.isInWaitlist && (
					<Button
						title="Withdraw"
						onPress={() => {
							withdrawFromEvent(eventObj, userId);
							updateEventFlag("Withdraw");
							navigation.navigate("Confirmation", {
								eventObj: eventObj,
								status: "Withdrawn" 
							});
						}}
					/>
				)}
				{/* If eligible and not already attending and event has room,
				button should say "Register" */}
				{eventObj.isEligible && !eventObj.isAttending && eventObj.hasRoom && (
					<Button
						title="Register"
						onPress={() => {
							registerForEvent(eventObj, userId);
							updateEventFlag("Register");
							navigation.navigate("Confirmation", {
								eventObj: eventObj,
								status: "Registered" 
							});
						}}
					/>
				)}
				{/* If eligible and not already attending and event has no room,
				button should say "Waitlist" */}
				{eventObj.isEligible && !eventObj.isAttending && !eventObj.hasRoom && !eventObj.isInWaitlist && (
					<Button
						title="Waitlist"
						onPress={() => {
							waitlistForEvent(eventObj, userId);
							updateEventFlag("Waitlist");
							navigation.navigate("Confirmation", {
								eventObj: eventObj,
								status: "Waitlisted"
							});
						}}
					/>
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 20,
	},
	heading: {
		fontWeight: "bold",
		fontSize: 18,
		textAlign: "center",
		marginBottom: 20,
	},
	textRows: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginVertical: 5,
		columnGap: 20,
	},
	textColumn: {
		flexDirection: "column",
		justifyContent: "space-between",
		rowGap: 20,
	},
	actionButton: {
		marginTop: 20,
	},
});
