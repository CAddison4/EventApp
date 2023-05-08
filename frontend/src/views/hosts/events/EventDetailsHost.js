import { View, Text, Button, TextInput, StyleSheet, Alert } from "react-native";
import React, { useState } from "react";
import axios from "axios";
import { API_END_POINT } from "@env";
import AttendeeList from "./AttendeeList";
import {
	formatLongDate,
	formatTime,
	formatDate,
} from "../../../utilities/dates";

export default function EventDetailsHost({ navigation, route }) {
	const eventObj = route.params.upcomingEvent;
	const eventId = eventObj.event_id;
	const handleRefresh = route.params.handleRefresh;
	//const eventView = route.params.eventView;
	const [isEdit, setIsEdit] = useState(false);
	const [editedName, setEditedName] = useState(eventObj.event_name);
	const [editedStartDate, setEditedStartDate] = useState(eventObj.event_start);
	const [editedEndDate, setEditedEndDate] = useState(eventObj.event_end);
	const [editedLocation, setEditedLocation] = useState(eventObj.event_location);
	const [editedCapacity, setEditedCapacity] = useState(eventObj.capacity);

	const formattedStartDate = new Date(eventObj.event_start);
	const currentDate = new Date();

	const handleSubmit = async () => {
		// formart setInpEvnStartDatetime with just date
		const eventDate = editedStartDate.slice(0, 10);

		try {
			// send editedName, editedDate, editedLocation, editedCapacity to backend
			const response = await axios.put(`${API_END_POINT}/event/${eventId}`, {
				eventName: editedName,
				eventDate: eventDate,
				eventStart: editedStartDate,
				eventEnd: editedEndDate,
				eventLocation: editedLocation,
				capacity: editedCapacity,
				eligibilityType: eventObj.type_id,
				loyaltyMax: eventObj.loyalty_max,
				cancelled: eventObj.cancelled,
				reasonCancelled: eventObj.reason_cancelled,
			});
			const data = response.data;
			setIsEdit(false);
			// push to event details page
			// const attendees = eventObj.attendees;
			const waitlist = eventObj.waitlist;
			handleRefresh();
			Alert.alert("Event Updated");
			navigation.goBack({
				upcomingEvent: {
					...data,
					// attendees,
					waitlist,
				},
			});
		} catch (error) {
			alert("An error occurred while updating event");
			console.error("Error updating event:", error);
		}
	};

	const handleDelete = async () => {
		try {
			const response = await axios.put(`${API_END_POINT}/event/${eventId}`, {
				eventName: eventObj.event_name,
				eventDate: eventObj.event_date,
				eventStart: eventObj.event_start,
				eventEnd: eventObj.event_end,
				eventLocation: eventObj.event_location,
				capacity: eventObj.capacity,
				eligibilityType: eventObj.type_id,
				loyaltyMax: eventObj.loyalty_max,
				cancelled: true,
			});
			// check if the request was successful
			if (response.status === 200) {
				console.log("Event successfully cancelled");
				handleRefresh();
				// go back to event list
				Alert.alert("Event Deleted");
				navigation.navigate("EventsHost");
			} else {
				console.log("Error cancelling event");
			}
		} catch (error) {
			console.log("Error cancelling event:", error.message);
		}
	};

	//Where should I call this?
	// const filterPastAttendance = (item, status) => {
	// 	switch (status) {
	// 		case "Attended":
	// 			setAttendeeList(
	// 				item.attendees.filter(
	// 					(attendee) => attendee.attendance_status_id === "Attended"
	// 				)
	// 			);
	// 			return;
	// 		case "No Show":
	// 			setAttendeeList(
	// 				item.attendees.filter(
	// 					(attendee) => attendee.attendance_status_id === "No Show"
	// 				)
	// 			);
	// 			return;
	// 		case "Unknown":
	// 			setAttendeeList(
	// 				item.attendees.filter(
	// 					(attendee) => attendee.attendance_status_id === "Unknown"
	// 				)
	// 			);
	// 			return;
	// 		default:
	// 			setAttendeeList(item.attendees);
	// 			return;
	// 	}
	// };
	return (
		<View style={styles.container}>
			{isEdit ? (
				<>
					<TextInput
						value={editedName}
						onChangeText={setEditedName}
						placeholder="Event name"
						style={styles.textInput}
					/>

					<TextInput
						value={editedLocation}
						onChangeText={setEditedLocation}
						placeholder="Event location"
						style={styles.textInput}
					/>
					<Button
						title="Cancel"
						onPress={() => setIsEdit(false)}
						style={styles.button}></Button>
					<Button
						title="Save"
						onPress={() => handleSubmit()}
						style={styles.button}></Button>
				</>
			) : (
				eventObj && (
					<View style={styles.container}>
						<Text style={styles.title}>Event Details</Text>
						<View style={styles.eventInfoContainer}>
							<View style={styles.eventInfoItem}>
								<Text style={styles.label}>Name:</Text>
								<Text style={styles.value}>{eventObj.event_name}</Text>
							</View>
							<View style={styles.eventInfoItem}>
								<Text style={styles.label}>Start: </Text>
								<Text style={styles.value}>
									{formatLongDate(eventObj.event_start, true)} |{" "}
									{formatTime(eventObj.event_start)}
								</Text>
							</View>
							<View style={styles.eventInfoItem}>
								<Text style={styles.label}>End: </Text>
								<Text style={styles.value}>
									{formatLongDate(eventObj.event_end, true)} |{" "}
									{formatTime(eventObj.event_end)}
								</Text>
							</View>
							<View style={styles.eventInfoItem}>
								<Text style={styles.label}>Location:</Text>
								<Text style={styles.value}>{eventObj.event_location}</Text>
							</View>
							<View style={styles.eventInfoItem}>
								<Text style={styles.label}>Capacity:</Text>
								<Text style={styles.value}>{eventObj.capacity}</Text>
							</View>
							{/* <Text>Capacity: {eventObj.capacity}</Text> */}

							<View style={styles.eventInfoItem}>
								<Text style={styles.label}>Registered:</Text>
								<Text style={styles.value}>{eventObj.number_of_attendees}</Text>
							</View>
							<View style={styles.eventInfoItem}>
								<Text style={styles.label}>Waitlisted:</Text>
								<Text style={styles.value}>{eventObj.waitlist.length}</Text>
							</View>

							{formattedStartDate < currentDate && (
								<>
									<View style={styles.eventInfoItem}>
										<Text
											// onPress={() => {
											// 	navigation.navigate("AttendeeList", {
											// 		attendeeList: eventObj.attendees.filter(
											// 			(attendee) =>
											// 				attendee.attendance_status_id === "Attended"
											// 		),
											// 		type: "Attended",
											// 		eventName: eventObj.event_name,
											// 		eventDate: eventObj.event_date,
											// 	});
											// }}
											style={styles.label}>
											Attended:
										</Text>
										<Text style={styles.value}>
											{
												eventObj.attendees.filter(
													(attendee) =>
														attendee.attendance_status_id === "Attended"
												).length
											}
										</Text>
									</View>
									<View style={styles.eventInfoItem}>
										<Text
											// onPress={() => {
											// 	navigation.navigate("AttendeeList", {
											// 		attendeeList: eventObj.attendees.filter(
											// 			(attendee) =>
											// 				attendee.attendance_status_id === "No Show"
											// 		),
											// 		type: "No Show",
											// 		eventName: eventObj.event_name,
											// 		eventDate: eventObj.event_date,
											// 	});
											// }}
											style={styles.label}>
											No Show:
										</Text>
										<Text style={styles.value}>
											{
												eventObj.attendees.filter(
													(attendee) =>
														attendee.attendance_status_id === "No Show"
												).length
											}
										</Text>
									</View>
									<View style={styles.eventInfoItem}>
										<Text
											// onPress={() => {
											// 	navigation.navigate("AttendeeList", {
											// 		attendeeList: eventObj.attendees.filter(
											// 			(attendee) =>
											// 				attendee.attendance_status_id === "Unknown"
											// 		),
											// 		type: "Unknown",
											// 		eventName: eventObj.event_name,
											// 		eventDate: eventObj.event_date,
											// 	});
											// }}
											style={styles.label}>
											Unknown:
										</Text>
										<Text style={styles.value}>
											{
												eventObj.attendees.filter(
													(attendee) =>
														attendee.attendance_status_id === "Unknown"
												).length
											}
										</Text>
									</View>
								</>
							)}
						</View>

						{eventObj.type_id === "Guest List" && (
							<Button
								title="Set Invites"
								onPress={() => navigation.navigate("InviteList", { eventObj })}
							/>
						)}
						<Button
							title="Edit"
							onPress={() => setIsEdit(true)}
							style={styles.button}></Button>
						<Button
							title="Delete"
							onPress={() => handleDelete()}
							style={styles.button}></Button>
						<Button
							title="Attendance"
							onPress={() => {
								navigation.navigate("Attendance", { eventObj: eventObj });
							}}
							buttonStyle={styles.button}
						/>
					</View>
				)
			)}
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
	title: {
		fontSize: 24,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 20,
	},
	eventInfoContainer: {
		width: "100%",
		backgroundColor: "#eee",
		borderRadius: 10,
		padding: 20,
	},
	actionButtons: {
		marginTop: 5,
		flexDirection: "column",
		justifyContent: "center",
		rowGap: 10,
		width: "100%",
	},
	eventInfoItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginVertical: 10,
	},
	label: {
		fontWeight: "bold",
	},
	value: {},
});
