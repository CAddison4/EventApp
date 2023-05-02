import * as React from "react";
import { StyleSheet, Text, View, Button, Alert } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { formatLongDate, formatTime } from "../../../utilities/dates";

import { registerForEvent, withdrawFromEvent } from "../../../actions/EventActions";
import { waitlistForEvent, removeFromEventWaitlist } from "../../../actions/WaitlistActions";
import { setEvent } from "../../../components/store/eventSlice";

import { useState, useEffect } from "react";
import axios from "axios";
import { API_END_POINT } from '@env';

export default function EventDetails({ navigation, route }) {
	const eventObj = route.params.eventObj;
	const userId = route.params.userId;

	var contextEvents = useSelector((state) => state.event);
	const dispatch = useDispatch();

	const [waitlistPosition, setWaitlistPosition] = useState(0);
	const [status, setStatus] = useState("");

	useEffect(() => {
		const yourStatus = 
		eventObj.isInWaitlist
			? "Waitlisted"
			: eventObj.isEligible && eventObj.attendee_status_id === null
				? "Eligible"
				: eventObj.isEligible && eventObj.attendee_status_id !== null
					? eventObj.attendee_status_id
					: !eventObj.isEligible
						? "Ineligible"
						: "";
		setStatus(yourStatus);
    }, []);

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

	async function updateEventFlag(type) {
		const updatedEvents = contextEvents.map(event => {
			if (event.event_id === eventObj.event_id && (event.attendee_userid === userId || event.waitlist_userid === userId)) {
				switch (type) {
					case "Waitlist":
						return { ...event, isInWaitlist: true, color: "orange" };
					case "Remove":
						return { ...event, isInWaitlist: false, color: "black" };
					case "Register":
						return { ...event, isAttending: true, color: "green", attendee_status_id: "Registered" };
					case "Withdraw":
						//	go back to attendee_status_id = Invited or Null
						if (eventObj.type_id === "Guest List") {
							return {...event, isAttending: false, color: "black",  attendee_status_id: "Invited"};
						}
						else {
							return {...event, isAttending: false, color: "black",  attendee_status_id: null};	
						}
					default:
						return event;
				}
			} else {
				return event;
			}
		});
		// Save the contextEvents array back in state
		await dispatch(setEvent(updatedEvents));
	}

	async function displayAlert(type, eventObj) {
		switch (type) {
			case "Waitlist":
				Alert.alert(`You are waitlisted for ${eventObj.event_name}`);
				break;
			case "Remove":
				Alert.alert(`You have been removed from the waitlist for ${eventObj.event_name}`);
				break;
			case "Register":
				Alert.alert(`You are registered for ${eventObj.event_name}`);
				break;
			case "Withdraw":
				Alert.alert(`You have withdrawn from ${eventObj.event_name}`);
				break;
			default:
				break;
		}
		navigation.goBack();
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>{eventObj.event_name}</Text>
			<View style={styles.eventInfoContainer}>
				<View style={styles.eventInfoItem}>
					<Text style={styles.label}>Event date:</Text>
					<Text style={styles.value}>{formatLongDate(eventObj.event_date, true)}</Text>
				</View>
				<View style={styles.eventInfoItem}>
					<Text style={styles.label}>Event start:</Text>
					<Text style={styles.value}>{formatTime(eventObj.event_start)}</Text>
				</View>
				<View style={styles.eventInfoItem}>
					<Text style={styles.label}>Location:</Text>
					<Text style={styles.value}>{eventObj.event_location}</Text>
				</View>
				<View style={styles.eventInfoItem}>
					<Text style={styles.label}>Your status:</Text>
					<Text style={styles.value}>{status}</Text>
				</View>
				{eventObj.isInWaitlist &&
					<View style={styles.eventInfoItem}>
						<Text style={styles.label}>Waitlist position:</Text>
						<Text style={styles.value}>{waitlistPosition}</Text>
					</View>
				}
				{eventObj.type_id === "Loyalty" &&
					<View style={styles.eventInfoItem}>
						<Text style={styles.label}>Loyalty count:</Text>
						<Text style={styles.value}>{eventObj.loyaltyCount}</Text>
					</View>
				}
				<View style={styles.actionButtons}>
					{/* If eligible and in the waitlist,
					button should say "Remove" */}
					{eventObj.isEligible && eventObj.isInWaitlist && (
						<Button
							title="Remove from Waitlist"
							onPress={() => {
								removeFromEventWaitlist(eventObj, userId);
								updateEventFlag("Remove");
								displayAlert("Remove", eventObj);
							}}
						/>
					)}
					{/* If eligible and already attending and not in waitlist,
					button should say "Withdraw", also show QR code button */}
					{eventObj.isEligible && eventObj.isAttending && !eventObj.isInWaitlist && (
						<>
							<Button
								title="Withdraw"
								onPress={() => {
									withdrawFromEvent(eventObj, userId);
									updateEventFlag("Withdraw");
									displayAlert("Withdraw", eventObj);
								}}
							/>
							<Button
								title="QR Code"
								onPress={() =>
									//Will also need to pass the user information through to this screen.
									navigation.navigate("AttendeeQRCode", {
										eventObj: eventObj,
									})
								}
							/>
						</>
					)}
					{/* If eligible and not already attending and event has room,
					button should say "Register" */}
					{eventObj.isEligible && !eventObj.isAttending && eventObj.hasRoom && (
						<Button
							title="Register"
							onPress={() => {
								registerForEvent(eventObj, userId);
								updateEventFlag("Register");
								displayAlert("Register", eventObj);
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
								displayAlert("Waitlist", eventObj);
							}}
						/>
					)}
				</View>
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
