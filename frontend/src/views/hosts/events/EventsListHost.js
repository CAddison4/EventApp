import {
	StyleSheet,
	View,
	Text,
	Button,
	FlatList,
	Keyboard,
	ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useState, useEffect, memo } from "react";
import axios from "axios";
import { API_END_POINT } from "@env";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import SearchBar from "../../partials/hostPartials/SearchBar";
import ClearFilterButton from "../../partials/hostPartials/ClearFilterButton";

import { setEvent } from "../../../components/store/eventSlice";
import { useDispatch, useSelector } from "react-redux";

import { getEventsWithAttendees } from "../HostComponents";

// import _ from "lodash";

export default function EventsListHost({ route }) {
	const [searchQuery, setSearchQuery] = useState("");
	const [eventObjs, setEventObjs] = useState([]);
	const [filteredEvents, setFilteredEvents] = useState([]);
	const [submittedSearchQuery, setSubmittedSearchQuery] = useState("");
	const [loading, setLoading] = useState(true);

	const type = route.params.type;
	const navigation = useNavigation();
	const contextEvents = useSelector((state) => state.event);
	const dispatch = useDispatch();

	useEffect(() => {
		const getData = async () => {
			const eventsWithAttendees = await getEventsWithAttendees();

			const eventData = eventsWithAttendees
				.filter((eventObj) => {
					const eventDate = new Date(eventObj.event_date);
					const now = new Date();

					if (type == "upcoming") {
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
			setLoading(false);
		};
		getData();
	}, []);

	const filterEvents = () => {
		setFilteredEvents(
			eventObjs.filter((eventObj) =>
				eventObj.event_name
					.toLowerCase()
					.includes(searchQuery.toLowerCase().trim())
			)
		);
	};

	const handleSearchQuery = (query) => {
		setSearchQuery(query);
		setSubmittedSearchQuery(query);
	};

	useEffect(() => {
		const filterEvents = () => {
			setFilteredEvents(eventObjs);
			setSubmittedSearchQuery(searchQuery);
		};
		filterEvents();
	}, [eventObjs, submittedSearchQuery]);

	useEffect(() => {
		dispatch(setEvent(filteredEvents));
	}, [filteredEvents]);

	return (
		<View style={styles.container}>
			{loading ? (
				<ActivityIndicator
					size="large"
					color="#0000ff"
					animating={true}
					style={styles.activityIndicator}
				/>
			) : (
				<>
					<SearchBar
						value={searchQuery}
						// onChangeText={(query) => {
						// 	handleSearchQuery(query);
						// }}
						onChangeText={handleSearchQuery}
						onSubmitEditing={(query) => {
							filterEvents(query);
							Keyboard.dismiss();
						}}
						placeholder="Search events"
						onPress={(query) => {
							filterEvents(query);
							Keyboard.dismiss();
						}}
					/>
					<ClearFilterButton
						onPress={() => {
							setSubmittedSearchQuery("");
							setSearchQuery("");
						}}
					/>

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
								</Text>
							</View>
						)}
					/>
				</>
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

// export default memo(EventsListHost);
