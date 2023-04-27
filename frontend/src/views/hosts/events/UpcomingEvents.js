import { StyleSheet, View, Text, Button, FlatList } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_END_POINT } from "@env";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

import AttendeeList from "./AttendeeList";
// import _ from "lodash";

export default function UpcomingEvents({ navigation }) {
	const [eventObjs, setEventObjs] = useState([]);

	useEffect(() => {
		const getData = async () => {
			const eventsWithAttendees = await getEventsWithAttendees();
			console.log(eventsWithAttendees);

			const eventData = eventsWithAttendees.filter((eventObj) => {
				const eventDate = new Date(eventObj.event_date);
				const now = new Date();
				return eventDate >= now;
			});

			setEventObjs(eventData);
			// setEventObjs(eventsWithAttendees);
		};
		getData();

		//each event object needs to have Event ID, Event Name, Event Date, Register, Waitlist
	}, []);

	const getEventsWithAttendees = async () => {
		const apiURL = API_END_POINT;

		// Make request to get all events
		const eventsResponse = await axios.get(`${apiURL}events`);
		const events = eventsResponse.data;

		// Make separate request for attendees of each event
		const eventsWithAttendees = await Promise.all(
			events.map(async (event) => {
				const attendeesResponse = await axios.get(
					`${apiURL}attendee/users/${event.event_id}`
				);
				const waitlistResponse = await axios.get(
					`${apiURL}waitlist/users/${event.event_id}`
				);
				const attendees = attendeesResponse.data;
				const waitlist = waitlistResponse.data;
				return {
					...event,
					attendees,
					waitlist,
				};
			})
		);

		return eventsWithAttendees;
	};

	return (
		<View style={styles.container}>
			<FlatList
				data={eventObjs}
				renderItem={({ item }) => (
					<View>
						<Text
							onPress={() =>
								navigation.navigate("EventDetailsHost", {
									upcomingEvent: item,
								})
							}
							style={styles.headerTxt}>
							{item.event_name}
						</Text>
						<Text style={styles.bodyTxt}>Date: {item.event_date}</Text>
						<Text>
							<Text style={styles.bodyTxt}>Capacity: {item.capacity} </Text>
							<Text
								style={styles.bodyTxt}
								onPress={() => {
									navigation.navigate("AttendeeList", {
										attendeeList: item.attendees,
										type: "Registered",
										eventName: item.event_name,
										eventDate: item.event_date,
									});
								}}>
								Registered: {item.attendees.length}
							</Text>
							<Text
								style={styles.bodyTxt}
								onPress={() => {
									navigation.navigate("AttendeeList", {
										attendeeList: item.waitlist,
										type: "Waitlisted",
										eventName: item.event_name,
										eventDate: item.event_date,
									});
								}}>
								Waitlist: {item.waitlist.length}
							</Text>
						</Text>
					</View>
				)}
			/>
		</View>

		// <View style={styles.container}>
		// 	<FlatList
		// 		data={eventObjs}
		// 		renderItem={({ item }) => (
		// 			<View>
		// 				<Text
		// 					onPress={() =>
		// 						navigation.navigate("EventDetailsHost", {
		// 							upcomingEvent: item,
		// 						})
		// 					}
		// 					style={styles.headerTxt}>
		// 					{item.event_name}
		// 				</Text>
		// 				<Text style={styles.bodyTxt}>Date: {item.event_date}</Text>
		// 			</View>
		// 		)}
		// 	/>
		// </View>
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
// 	return (
// 		<View>
// 			<Text>Upcoming Events</Text>

// 			<FlatList
// 				data={eventObjs}
// 				renderItem={({ item }) => (
// 					<Text
// 						onPress={() =>
// 							navigation.navigate("EventDetailsHost", { eventObj: item })
// 						}>
// 						{item.event_name}
// 					</Text>
// 				)}
// 			/>
// 		</View>
// 	);
// }

// import { StyleSheet, View, Text, Button, FlatList } from "react-native";
// import { StatusBar } from "expo-status-bar";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { API_END_POINT } from "@env";
// import { TouchableOpacity } from "react-native-gesture-handler";
// import { Ionicons } from "@expo/vector-icons";
// // import _ from "lodash";

// export default function UpcomingEvents({ navigation }) {
// 	const [eventObjs, setEventObjs] = useState([]);
// 	const [eventAttendees, setEventAttendees] = useState([]);
// 	const [registeredEventAttendees, setRegisteredEventAttendees] = useState([]);
// 	const [eventWaitlist, setEventWaitlist] = useState([]);

// 	const [allEventAttendees, setAllEventAttendees] = useState([]);

// 	///attendee/users/{eventId}

// 	///waitlist/users/{eventId}

// 	useEffect(() => {
// 		const getEvents = async () => {
// 			const apiURL = API_END_POINT;
// 			const eventResponse = await axios.get(`${apiURL}events`);
// 			const eventData = eventResponse.data.filter((eventObj) => {
// 				//Decide if we want this to be the event start date or event end date. Ensure Past Events is updated too.
// 				const eventDate = new Date(eventObj.event_date);
// 				const now = new Date();
// 				return eventDate >= now;
// 			});
// 			setEventObjs(eventData);
// 		};

// 		getEvents();

// 		//each event object needs to have Event ID, Event Name, Event Date, Register, Waitlist
// 	}, []);

// 	const getEventAttendees = async (eventObj) => {
// 		const apiURL = API_END_POINT;
// 		const allEventAttendees = await axios.get(
// 			`${apiURL}attendee/users/${eventObj.event_id}`
// 		);
// 		setEventAttendees(allEventAttendees);
// 	};

// 	// const getEventAttendees = async () => {
// 	// 	const apiURL = API_END_POINT;

// 	// 	const eventAttendeesResponse = await axios.get(
// 	// 		`${apiURL}attendee/users/${eventObj.event_id}`
// 	// 	);
// 	// 	const eventAttendeesData = eventAttendeesResponse.data.filter();
// 	// 	setRegisteredEventAttendees(eventAttendeesData);
// 	// };
// 	// const getEventWaitlist = async (eventObj) => {
// 	// 	console.log("eventObjID", eventObj.event_id);
// 	// 	const apiURL = API_END_POINT;
// 	// 	const eventWaitlistResponse = await axios.get(
// 	// 		`${apiURL}waitlist/users/${eventObj.event_id}`
// 	// 	);
// 	// 	const eventWaitlistData = eventWaitlistResponse.data;
// 	// 	setEventWaitlist(eventWaitlistData);
// 	// };

// 	return (
// 		// <View style={styles.container}>
// 		// 	<FlatList
// 		// 		data={eventObjs}
// 		// 		style={{ width: "90%" }}
// 		// 		keyExtractor={(item, index) => index + ""}
// 		// 		ListHeaderComponent={tableHeader}
// 		// 		stickyHeaderIndices={[0]}
// 		// 		renderItem={({ item, index }) => {
// 		// 			return (
// 		// 				<View
// 		// 					style={{
// 		// 						...styles.tableRow,
// 		// 						backgroundColor: index % 2 == 1 ? "#F0FBFC" : "white",
// 		// 					}}>
// 		// 					<Text
// 		// 						style={{ ...styles.columnRowTxt, fontWeight: "bold" }}
// 		// 						onPress={() =>
// 		// 							navigation.navigate("EventDetailsHost", { eventObj: item })
// 		// 						}>
// 		// 						{item.event_name}
// 		// 					</Text>
// 		// 					<Text style={styles.columnRowTxt}>{item.capacity}</Text>
// 		// 					<Text style={styles.columnRowTxt}>{item.Weight}</Text>
// 		// 					<Text style={styles.columnRowTxt}>{item.Age}</Text>
// 		// 					<Text style={styles.columnRowTxt}>{item.Age}</Text>
// 		// 				</View>
// 		// 			);
// 		// 		}}
// 		// 	/>
// 		// 	<StatusBar style="auto" />
// 		// </View>
// 		<View style={styles.container}>
// 			<FlatList
// 				data={eventObjs}
// 				renderItem={({ item }) => (
// 					<View>
// 						<Text
// 							onPress={() =>
// 								navigation.navigate("EventDetailsHost", {
// 									upcomingEvent: item,
// 								})
// 							}
// 							style={styles.headerTxt}>
// 							{item.event_name}
// 						</Text>
// 						<Text style={styles.bodyTxt}>Date: {item.event_date}</Text>
// 					</View>
// 				)}
// 			/>
// 		</View>
// 	);
// }

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		backgroundColor: "#fff",
// 		alignItems: "center",
// 		justifyContent: "center",
// 		paddingTop: 80,
// 	},
// 	tableHeader: {
// 		flexDirection: "row",
// 		justifyContent: "space-evenly",
// 		alignItems: "center",
// 		backgroundColor: "#37C2D0",
// 		borderTopEndRadius: 10,
// 		borderTopStartRadius: 10,
// 		height: 50,
// 	},
// 	tableRow: {
// 		flexDirection: "row",
// 		height: 40,
// 		alignItems: "center",
// 	},
// 	columnHeader: {
// 		// width: "20%",
// 		justifyContent: "space-evenly",
// 		alignItems: "center",
// 	},
// 	columnHeaderTxt: {
// 		color: "white",
// 		fontWeight: "bold",
// 	},
// 	columnRowTxt: {
// 		width: "30%",
// 		justifyContent: "space-evenly",
// 		textAlign: "left",
// 	},

// 	headerTxt: {
// 		fontSize: 20,
// 		fontWeight: "bold",
// 	},

// 	bodyTxt: {
// 		fontSize: 16,
// 		fontWeight: "regular",
// 	},

// 	listItemLayout: {
// 		display: "flex",
// 		flexDirection: "column",
// 	},
// });
// 	return (
// 		<View>
// 			<Text>Upcoming Events</Text>

// 			<FlatList
// 				data={eventObjs}
// 				renderItem={({ item }) => (
// 					<Text
// 						onPress={() =>
// 							navigation.navigate("EventDetailsHost", { eventObj: item })
// 						}>
// 						{item.event_name}
// 					</Text>
// 				)}
// 			/>
// 		</View>
// 	);
// }
