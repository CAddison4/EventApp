import {
	StyleSheet,
	Text,
	View,
	Button,
	FlatList,
	TouchableOpacity,
} from "react-native";

import * as React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { API_END_POINT } from "@env";
import {
	registerForEvent,
	withdrawFromEvent,
} from "../../../actions/EventActions";
import {
	waitlistForEvent,
	removeFromEventWaitlist,
} from "../../../actions/WaitlistActions";

import EventListItem from "../../../components/EventListItem";

const userId = "c9054246-70e7-4bb6-93d6-ffe80e45a575";
const membership_status = "Gold";

export default function Upcoming({ navigation }) {
	const [upcomingEvents, setUpcomingEvents] = useState([]);
	const [reRender, setReRender] = useState([false]);
	// const navigation = useNavigation();

	// Count number of events this user has attended prior to today
	const getLoyaltyCount = async (userId) => {
		const response = await axios.get(`${API_END_POINT}loyalty/${userId}`);
		return response.data.eventCount;
	};

	useEffect(() => {
		const loyaltyCount = getLoyaltyCount(userId);
		const getUpcomingEvents = async () => {
			const response = await axios.get(
				`${API_END_POINT}attendee/events/${userId}`
			);
			const data = response.data;
			await Promise.all(
				data.map(async (eventObj) => {
					await determineEventFlags(eventObj, loyaltyCount);
				})
			);
			setUpcomingEvents(data);
		};
		getUpcomingEvents();
		setReRender(false);
	}, [reRender, navigation]);

	const determineEventFlags = async (eventObj, loyaltyCount) => {
		const eligibility = [];

		switch (eventObj.type_id) {
			case "Bronze Tier":
				eligibility.push("Bronze");
			case "Silver Tier":
				eligibility.push("Silver");
			case "Gold Tier":
				eligibility.push("Gold");
			default:
				break;
		}
		// Check if there is any capacity available in the event
		let response = await axios.get(
			`${API_END_POINT}anycapacity/${eventObj.event_id}`
		);
		eventObj.hasRoom = response.data.anyCapacityAvailable;

		// User is already attending if status is "Registered"
		eventObj.isAttending =
			eventObj.attendee_status_id === "Registered" ? true : false;

		// User is eligible if status is "Invited", or type is "Guest List" and user is
		// "Registered", or type is "Loyalty" and event count for this user exceeds the
		// count required for this event.
		// If none of these conditions are met, the user is eligible if their membership
		// status qualifies for this tier.
		if (
			eventObj.attendee_status_id === "Invited" ||
			(eventObj.type_id === "Guest List" &&
				eventObj.attendee_status_id === "Registered") ||
			(eventObj.type_id === "Loyalty" && loyaltyCount >= eventObj.loyalty_max)
		) {
			eventObj.isEligible = true;
		} else {
			eventObj.isEligible = eligibility.includes(membership_status)
				? true
				: false;
		}

		// Check if the user is already in the waitlist for this event
		response = await axios.get(
			`${API_END_POINT}waitlist/inwaitlist/${eventObj.event_id}/${userId}`
		);
		eventObj.isInWaitlist = response.data.waitlist > 0 ? true : false;
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
							style={{ paddingTop: 20 }}>
							<EventListItem eventObj={item} />
						</TouchableOpacity>
						{/* If eligible and in the waitlist,
						button should say "Remove" */}
						{item.isEligible && item.isInWaitlist && (
							<Button
								title="Remove from Waitlist"
								onPress={() => {
									removeFromEventWaitlist(item, userId);
									setReRender(true);
									navigation.navigate("Confirmation", {
										eventObj: item,
										status: "Removed",
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
										status: "Withdrawn",
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
										status: "Registered",
									});
								}}
							/>
						)}
						{/* If eligible and not already attending and event has no room,
						button should say "Waitlist" */}
						{item.isEligible &&
							!item.isAttending &&
							!item.hasRoom &&
							!item.isInWaitlist && (
								<Button
									title="Waitlist"
									onPress={() => {
										waitlistForEvent(item, userId);
										setReRender(true);
										navigation.navigate("Confirmation", {
											eventObj: item,
											status: "Waitlisted",
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
