import { StyleSheet, View, FlatList, TouchableOpacity } from "react-native";

import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";

import { useDispatch, useSelector } from "react-redux";
import { setEvent } from "../../../components/store/eventSlice";

import { API_END_POINT } from '@env';


import EventListItem from "../../../components/EventListItem";

const userId = "c9054246-70e7-4bb6-93d6-ffe80e45a575";
const membership_status = "Gold";

export default function EventsList({ route }) {

	const { type } = route.params;
	const [events, setEvents] = useState([]);

	const [dbEvents, setDBEvents] = useState([]);

	const [selectedFilterU, setSelectedFilterU] = useState("All");
	const [selectedFilterM, setSelectedFilterM] = useState("All");

	const navigation = useNavigation();
	const today = new Date();

	let filteredEvents = [];
	const contextEvent = useSelector((state) => state.event);
	const dispatch = useDispatch();


	useEffect(() => {
		async function fetchData() {
			await getEvents(true);
			applyFilters(type, "All");
			await dispatch(setEvent(filteredEvents));
			setEvents(filteredEvents);
		}
		fetchData();
	}, []);

	const getEvents = async (fetchFromDB) => {
		
		let loyaltyCount = 0;
		if (type === "upcoming") {
			loyaltyCount = await getLoyaltyCount(userId);
		}
		if (fetchFromDB) {
			const response = await axios.get(`${API_END_POINT}attendee/events/${userId}`);
			const data = response.data;

			filteredEvents = data.filter(eventObj => new Date(eventObj.event_date) > today);
			setDBEvents(filteredEvents);
		}
		else {
			filteredEvents = [...dbEvents];
		}
		await Promise.all(filteredEvents.map(async (eventObj) => {
			await determineEventFlags(eventObj, loyaltyCount);
		}));
	};


	const getLoyaltyCount = async (userId) => {
		const response = await axios.get(`${API_END_POINT}loyalty/${userId}`);
		return response.data.eventCount;
	}
	
	const determineEventFlags = async (eventObj, loyaltyCount) => {

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
		// Check if there is any capacity available in the event
		let response = await axios.get(`${API_END_POINT}anycapacity/${eventObj.event_id}`);
		eventObj.hasRoom = response.data.anyCapacityAvailable;

		// User is already attending if status is "Registered"
		eventObj.isAttending = eventObj.attendee_status_id === "Registered"  ? true : false;

		// User is eligible if status is "Invited", or type is "Guest List" and user is
		// "Registered", or type is "Loyalty" and event count for this user exceeds the
		// count required for this event.
		// If none of these conditions are met, the user is eligible if their membership
		// status qualifies for this tier.
		if (eventObj.attendee_status_id === "Invited" ||
		   (eventObj.type_id === "Guest List" && eventObj.attendee_status_id === "Registered") || (eventObj.type_id === "Loyalty" && loyaltyCount >= eventObj.loyalty_max)) {
			eventObj.isEligible = true;		
		}
		else {
			eventObj.isEligible = eligibility.includes(membership_status) ? true : false;
		}

		// Check if the user is already in the waitlist for this event
		response = await axios.get(`${API_END_POINT}waitlist/inwaitlist/${eventObj.event_id}/${userId}`);
		eventObj.isInWaitlist = response.data.waitlist > 0 ? true : false;

		eventObj.isInWaitlist ? eventObj.color = "red" : (eventObj.isAttending ? eventObj.color = "green" : eventObj.color = "black");
	};

	const handleFilterChangeU = (itemValue) => {
		setSelectedFilterU(itemValue);
		async function filterData() {
			await getEvents(false);
			applyFilters(type, itemValue);
			await dispatch(setEvent(filteredEvents));
			setEvents(filteredEvents);
		}
		filterData();		
	};

	const handleFilterChangeM = (itemValue) => {
		setSelectedFilterM(itemValue);
		async function filterData() {
			await getEvents(false);
			applyFilters(type, itemValue);
			await dispatch(setEvent(filteredEvents));
			setEvents(filteredEvents);
		}
		filterData();
	};

	const applyFilters = (type, filterValue) => {
		if (type === "upcoming") {
			switch (filterValue) {
				case "All":
					break;
				case "Eligible":
					filteredEvents = filteredEvents.filter(eventObj => eventObj.isEligible  || eventObj.isInWaitlist); 
					break;
				default:
					break;
			}
		}
		else {
			switch (filterValue) {
				case "All":
					filteredEvents = filteredEvents.filter(eventObj => eventObj.attendee_status_id === "Registered" || eventObj.isInWaitlist);
					break;
				case "Registered":
					filteredEvents = filteredEvents.filter(eventObj => eventObj.attendee_status_id === "Registered");
					break;
				case "Waitlisted":
					filteredEvents = filteredEvents.filter(eventObj => eventObj.isInWaitlist);
					break;
				default:
					break;
			}
		}
	}

	return (
		<View style={styles.container}>
			{type && type === "upcoming" ? (
				<Picker
					selectedValue={selectedFilterU}
					style={styles.picker}
					onValueChange={handleFilterChangeU}
					mode={"dropdown"}
				>
					<Picker.Item label="All" value="All" />
					<Picker.Item label="Eligible" value="Eligible" />
				</Picker>
			) : (
				<Picker
					selectedValue={selectedFilterM}
					style={styles.picker}
					onValueChange={handleFilterChangeM}
					mode={"dropdown"}
				>
					<Picker.Item label="All" value="All" />
					<Picker.Item label="Registered" value="Registered" />
					<Picker.Item label="Waitlisted" value="Waitlisted" />
				</Picker>
			)}
			
			<FlatList style={styles.list}
				data={events}
				keyExtractor={(item) => `${item.event_id}${item.user_id}`}
				renderItem={({ item }) => (
					<View style={styles.row}>
						<TouchableOpacity
							onPress={() =>
								navigation.navigate("EventDetails", {
									eventObj: item,
									userId: userId
								})
							}>
							<View style={styles.rowContent}>
								<EventListItem
									eventObj={item}/>
								<Ionicons
									name="chevron-forward-outline"
									size={16}
									color="grey"
								/>
							</View>
						</TouchableOpacity>						
					</View>
				)}
			/>
		</View>
	);
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: "100%",
    	maxWidth: 400,
		backgroundColor: "#fff",
		paddingLeft: 30,
		justifyContent: "space-between",
	},
	picker: {
    	alignItems: "center",
		width: 180,
	},
	list: {
		paddingTop: 10,
	},
	row: {
		paddingBottom: 20,
		width: "100%",
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	rowContent: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "flex-end",
		alignItems: "center",
		columnGap: 30,
		marginRight: 10,
	},
});
