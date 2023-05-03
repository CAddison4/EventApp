import { StyleSheet, View, Text, Button, FlatList } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_END_POINT } from "@env";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import SearchBar from "../../partials/hostPartials/SearchBar";
import ClearFilterButton from "./ClearFilterButton";

import { getEventsWithAttendees } from "../../hosts/HostComponents";

import AttendeeList from "../../hosts/events/AttendeeList";
// import _ from "lodash";

export default function EventsListHost({ eventView }) {
	const [searchQuery, setSearchQuery] = useState("");
	const [eventObjs, setEventObjs] = useState([]);
	const [filteredEvents, setFilteredEvents] = useState([]);
	const [attendeeList, setAttendeeList] = useState([]);
	const navigation = useNavigation();

	useEffect(() => {
		const getData = async () => {
			const eventsWithAttendees = await getEventsWithAttendees();

			const eventData = eventsWithAttendees
				.filter((eventObj) => {
					const eventDate = new Date(eventObj.event_date);
					const now = new Date();

					if (eventView === "upcoming") {
						return eventDate >= now;
					} else {
						return eventDate < now;
					}
				})
				.map((eventObj) => {
					const options = {
						month: "long",
						day: "numeric",
						year: "numeric",
					};
					//const formattedDate = new Date(eventObj.event_date);
					//.toLocaleDateString("en-US", options);
					return { ...eventObj };
				})
				.sort((a, b) => new Date(a.event_date) - new Date(b.event_date));

			setEventObjs(eventData);
		};
		getData();
	}, []);

	// const getEventsWithAttendees = async () => {
	// 	const apiURL = API_END_POINT;

	// 	// Make request to get all events
	// 	const eventsResponse = await axios.get(`${apiURL}events`);
	// 	const events = eventsResponse.data;

	// 	// Make separate request for attendees of each event
	// 	const eventsWithAttendees = await Promise.all(
	// 		events.map(async (event) => {
	// 			const attendeesResponse = await axios.get(
	// 				`${apiURL}attendee/users/${event.event_id}`
	// 			);
	// 			const waitlistResponse = await axios.get(
	// 				`${apiURL}waitlist/users/${event.event_id}`
	// 			);
	// 			const attendees = attendeesResponse.data;
	// 			const waitlist = waitlistResponse.data;
	// 			return {
	// 				...event,
	// 				attendees,
	// 				waitlist,
	// 			};
	// 		})
	// 	);

	// 	return eventsWithAttendees;
	// };

	const filterEvents = () => {
		setFilteredEvents(
			eventObjs.filter((eventObj) =>
				eventObj.event_name.toLowerCase().includes(searchQuery.toLowerCase())
			)
		);
	};

	useEffect(() => {
		const filterEvents = () => {
			setFilteredEvents(eventObjs);
		};
		filterEvents();
	}, [eventObjs, searchQuery]);

	// const filteredEvents = filterEvents(eventObjs, searchQuery);

	return (
		<View style={styles.container}>
			<SearchBar
				value={searchQuery}
				onChangeText={setSearchQuery}
				onSubmitEditing={filterEvents}
				placeholder="Search events"
				onPress={filterEvents}
			/>
			<ClearFilterButton onPress={() => setSearchQuery("")} />

			<FlatList
				data={filteredEvents}
				renderItem={({ item }) => (
					<View>
						<Text style={styles.headerTxt}>{item.event_date}</Text>
						<Text
							onPress={() =>
								navigation.navigate("EventDetailsHost", {
									upcomingEvent: item,
									// eventView: eventView,
								})
							}
							style={styles.bodyTxt}>
							{item.event_name}
						</Text>

						<Text>
							<Text>
								Status:{" "}
								{item.attendees.length >= item.capacity
									? `Full | Waitlist: ${item.waitlist.length}`
									: (new Date(item.event_date) < new Date() && "Closed") ||
									  `Open | Spots Available: ${
											item.capacity - item.attendees.length
									  }`}
							</Text>

							{/* {eventView === "past" && (
								<>
									{" "}
									<Text
										style={styles.bodyTxt}
										onPress={() => {
											navigation.navigate("AttendeeList", {
												attendeeList: item.attendees.filter(
													(attendee) =>
														attendee.attendance_status_id === "Attended"
												),
												type: "Attended",
												eventName: item.event_name,
												eventDate: item.event_date,
											});
										}}>
										Attended:{" "}
										{
											// item.attendees.filter(
											// 	(attendee) =>
											// 		attendee.attendance_status_id === "Attended"
											// ).length
											item.attendees.filter(
												(attendee) =>
													attendee.attendance_status_id === "Attended"
											).length
										}
									</Text>{" "}
									<Text
										style={styles.bodyTxt}
										onPress={() => {
											navigation.navigate("AttendeeList", {
												attendeeList: item.attendees.filter(
													(attendee) =>
														attendee.attendance_status_id === "No Show"
												),
												type: "No Show",
												eventName: item.event_name,
												eventDate: item.event_date,
											});
										}}>
										No Show:{" "}
										{
											item.attendees.filter(
												(attendee) =>
													attendee.attendance_status_id === "No Show"
											).length
										}
									</Text>{" "}
									<Text
										style={styles.bodyTxt}
										onPress={() => {
											navigation.navigate("AttendeeList", {
												attendeeList: item.attendees.filter(
													(attendee) =>
														attendee.attendance_status_id === "Unknown"
												),
												type: "Unknown",
												eventName: item.event_name,
												eventDate: item.event_date,
											});
										}}>
										Unknown:{" "}
										{
											item.attendees.filter(
												(attendee) =>
													attendee.attendance_status_id === "Unknown"
											).length
										}
									</Text>
								</>
							)} */}
						</Text>
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
		paddingTop: 80,
	},
	tableHeader: {
		flexDirection: "row",
		justifyContent: "space-evenly",
		alignItems: "center",
		backgroundColor: "#37C2D0",
		borderTopEndRadius: 10,
		borderTopStartRadius: 10,
		height: 50,
	},
	tableRow: {
		flexDirection: "row",
		height: 40,
		alignItems: "center",
	},
	columnHeader: {
		// width: "20%",
		justifyContent: "space-evenly",
		alignItems: "center",
	},
	columnHeaderTxt: {
		color: "white",
		fontWeight: "bold",
	},
	columnRowTxt: {
		width: "30%",
		justifyContent: "space-evenly",
		textAlign: "left",
	},

	headerTxt: {
		fontSize: 20,
		fontWeight: "bold",
	},

	bodyTxt: {
		fontSize: 16,
		fontWeight: "regular",
	},

	listItemLayout: {
		display: "flex",
		flexDirection: "column",
	},
});
