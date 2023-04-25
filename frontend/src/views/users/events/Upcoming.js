import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity } from "react-native";

import * as React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigation } from '@react-navigation/native';
import { API_END_POINT } from '@env';
import { registerForEvent, withdrawFromEvent } from "../../../actions/EventActions";
import { waitlistForEvent, removeFromEventWaitlist } from "../../../actions/WaitlistActions";


import EventListItem from "../../../components/EventListItem";

//Upcoming is Tier & Loyalty Events

const userId = "c9054246-70e7-4bb6-93d6-ffe80e45a575";
const membership_status = "Gold";

export default function Upcoming() {

	const [upcomingEvents, setUpcomingEvents] = useState([]);
	const [reRender, setReRender] = useState([false]);
	const navigation = useNavigation();

	useEffect(() => {
		const getUpcomingEvents = async () => {
			const response = await axios.get(`${API_END_POINT}/attendee/events/${userId}`);

			const data = response.data;
			await Promise.all(data.map(async (eventObj) => {
				await determineEventFlags(eventObj);
			}));
			setUpcomingEvents(data);
		};
		getUpcomingEvents();
		setReRender(false);
	}, [reRender]);

	const determineEventFlags = async (eventObj) => {

		const eligibility = [];

		switch (eventObj.type_id) {
			case ("Bronze Tier"):
				eligibility.push("Bronze");
			case ("Silver Tier"):
				eligibility.push("Silver");
			case ("Gold Tier"):
				eligibility.push("Gold");
			default:
				break;
		}

		const response = await axios.get(`${API_END_POINT}/anycapacity/${eventObj.event_id}`);
		eventObj.hasRoom = response.data.anyCapacityAvailable;

		eventObj.isAttending = eventObj.attendee_status_id === "Registered"  ? true : false;

		if (eventObj.attendee_status_id === "Invited" ||
		   (eventObj.type_id === "Guest List" && eventObj.attendee_status_id === "Registered")) {
			eventObj.isEligible = true;		
		}
		else {
			eventObj.isEligible = eligibility.includes(membership_status) ? true : false;
		}

		const res = await axios.get(`${API_END_POINT}/waitlist/inwaitlist/${eventObj.event_id}/${userId}`);
		eventObj.isInWaitlist = res.data.waitlist === '0' ? false : true;
	
		console.log("event id", eventObj.event_id);
		console.log("event name", eventObj.event_name);
		console.log("isEligible", eventObj.isEligible);
		console.log("isAttending", eventObj.isAttending);
		
	};

	return (
		<View style={styles.container}>
			<Text>Upcoming Screen</Text>
	
			<FlatList
				data={upcomingEvents}
				keyExtractor={(item) => `${item.event_id}${item.user_id}`}
				renderItem={({ item }) => (
					<View>
						<TouchableOpacity
							onPress={() =>
								navigation.navigate("EventDetails", {
									eventObj: item,
								})
							}
						>
							<EventListItem eventObj={item} />
						</TouchableOpacity>
						{/* If eligible and already attending and in waitlist,
						button should say "Remove" */}
						{item.isEligible && item.isAttending && item.isInWaitlist && (
							<Button
								title="Remove"
								onPress={() => {
									removeFromEventWaitlist(item, userId);
									setReRender(true);
									navigation.navigate("Confirmation", {
										eventObj: item,
										status: "Removed" 
									});
								}}
							/>
						)}
						{/* If eligible and already attending and not in waitlist,
						button should say "Withdraw" */}
						{item.isEligible && item.isAttending && !item.isInWaitlist && (
							<Button
								title="Withdraw"
								onPress={() => {
									withdrawFromEvent(item, userId);
									setReRender(true);
									navigation.navigate("Confirmation", {
										eventObj: item,
										status: "Withdrawn" 
									});
								}}
							/>
						)}
						{/* If eligible and not already attending and event has room,
						button should say "Register" */}
						{item.isEligible && !item.isAttending && item.hasRoom && (
							<Button
								title="Register"
								onPress={() => {
									registerForEvent(item, userId);
									setReRender(true);
									navigation.navigate("Confirmation", {
										eventObj: item,
										status: "Registered" 
									});
								}}
							/>
						)}
						{/* If eligible and not already attending and event has no room,
						button should say "Waitlist" */}
						{item.isEligible && !item.isAttending && !item.hasRoom && (
							<Button
								title="Waitlist"
								onPress={() => {
									waitlistForEvent(item, userId);
									setReRender(true);
									navigation.navigate("Confirmation", {
										eventObj: item, 
										status: "Witlisted"
									});
								}}
							/>
						)}
					</View>
				)}
			/>
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
