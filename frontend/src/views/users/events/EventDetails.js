import * as React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { formatDate, formatDateTime } from "../../../utilities/dates"

export default function EventDetails({ navigation, route }) {
	const eventObj = route.params.eventObj;

	return (
		<View>
			<View key={`${eventObj.event_id}${eventObj.user_id}`}>
				<Text>{eventObj.event_name}</Text>
				<Text>{formatDate(eventObj.event_date)}</Text>
				<Text>{formatDateTime(eventObj.event_start)}</Text>
				<Text>{eventObj.event_location}</Text>
				<Text>{eventObj.attendee_status_id}</Text>
			</View>
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
			{item.isEligible && !item.isAttending && !item.hasRoom && !item.isInWaitlist && (
				<Button
					title="Waitlist"
					onPress={() => {
						waitlistForEvent(item, userId);
						setReRender(true);
						navigation.navigate("Confirmation", {
							eventObj: item, 
							status: "Waitlisted"
						});
					}}
				/>
			)}
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
