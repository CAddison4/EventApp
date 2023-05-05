import { StyleSheet, View, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";

import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import DropDownPicker from "react-native-dropdown-picker";

import { useDispatch, useSelector } from "react-redux";
import { setEvent } from "../../../components/store/eventSlice";

import { API_END_POINT } from '@env';

import EventListItem from "../../../components/EventListItem";

export default function EventsList({ route }) {

	const user = useSelector((state) => state.user);
	const { user_id, ...userData } = user;
	const membership_status = userData.membership_status_id;

	const type = route.params.type;

	const [filteredEvents, setFilteredEvents] = useState([]);

	const [dbEvents, setDBEvents] = useState([]);

	const [selectedFilterU, setSelectedFilterU] = useState("All");
	const [selectedFilterM, setSelectedFilterM] = useState("All");
	const [isLoading, setIsLoading] = useState(true);
	const [isLoadingF, setIsLoadingF] = useState(true);
	const [open, setOpen] = useState(false);

	const navigation = useNavigation();
	const today = new Date();

	let events = [];
	const contextEvents = useSelector((state) => state.event);
	const dispatch = useDispatch();

	const [filterItemsM, setFilterItemsM] = useState([
		{label: 'All', value: 'All'},
		{label: 'Registered', value: 'Registered'},
		{label: 'Waitlisted', value: 'Waitlisted'}]);
	const [filterItemsU, setFilterItemsU] = useState([
		{label: 'All', value: 'All'},
		{label: 'Eligible', value: 'Eligible'}]);

	useEffect(() => {
		setIsLoading(true);
		async function fetchData() {
			await getEvents(true);
			await dispatch(setEvent(events));
			applyFilters(type, "All");
			setFilteredEvents(events);
			setIsLoading(false);
		}
		fetchData();
	}, []);

	useEffect(() => {
		if (type === "upcoming") {
			handleFilterChange(selectedFilterU);
		}
		else {
			handleFilterChange(selectedFilterM);
		}
	}, [selectedFilterU, selectedFilterM]);

	useEffect(() => {
		if (contextEvents) {
            events = [...contextEvents];
			setDBEvents(events);
			type === "upcoming" ? applyFilters(type, selectedFilterU)
		                        : applyFilters(type, selectedFilterM);
			setFilteredEvents(events);
		}
    }, [contextEvents]);

	const getEvents = async (fetchFromDB) => {
		let loyaltyCount = 0;
		if (type === "upcoming") {
			loyaltyCount = await getLoyaltyCount(user_id);
		}
		if (fetchFromDB) {
			const response = await axios.get(`${API_END_POINT}attendee/events/${user_id}`);
			const data = response.data;

			events = data.filter(eventObj => new Date(eventObj.event_date) > today);
			setDBEvents(events);
			console.log("DB Events: ", events)
		}
		else {
			events = [...dbEvents];
		}
		await Promise.all(events.map(async (eventObj) => {
			await determineEventFlags(eventObj, loyaltyCount);
		}));
	};

	const getLoyaltyCount = async (userid) => {
		const response = await axios.get(`${API_END_POINT}loyalty/${userid}`);
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
		eventObj.hasRoom = response.data.numberOfAttendees < eventObj.capacity ? true : false;
		eventObj.capacityAvailable = eventObj.capacity - parseInt(response.data.numberOfAttendees);

		// User is already attending if status is "Registered"
		eventObj.isAttending = eventObj.attendee_status_id === "Registered"  ? true : false;

		// User is eligible if status is "Invited", or type is "Guest List"
		// and status is "Registered", or type is "Loyalty" and event count for
		// this user exceeds the count required for this event.
		// If none of these conditions are met, the user is eligible if their
		// membership status qualifies for this tier.
		eventObj.loyaltyCount = loyaltyCount;
		if (eventObj.attendee_status_id === "Invited" ||
		   (eventObj.type_id === "Guest List" && eventObj.attendee_status_id === "Registered") || (eventObj.type_id === "Loyalty" && loyaltyCount >= eventObj.loyalty_max)) {
			eventObj.isEligible = true;		
		}
		else {
			eventObj.isEligible = eligibility.includes(membership_status) ? true : false;
		}

		// Check if the user is already in the waitlist for this event
		response = await axios.get(`${API_END_POINT}waitlist/inwaitlist/${eventObj.event_id}/${user_id}`
		);
		eventObj.isInWaitlist = response.data.waitlist > 0 ? true : false;

		if (eventObj.isInWaitlist) {
			eventObj.color = "orange";
		  } else if (eventObj.isAttending) {
			eventObj.color = "green";
		  } else if (eventObj.isEligible) {
			eventObj.color = "black";
		  } else {
			eventObj.color = "red";
		  }
	};

	const handleFilterChange = (itemValue) => {
		if (type === "upcoming") {
			setSelectedFilterU(itemValue);
		}
		else {
			setSelectedFilterM(itemValue);
		}
		setIsLoadingF(true); 
		async function filterData() {
			await getEvents(false);
			await dispatch(setEvent(events));
			applyFilters(type, itemValue);
			setFilteredEvents(events);
			setIsLoadingF(false);
		}
		filterData();	
	};

	const applyFilters = (type, filterValue) => {
		if (type === "upcoming") {
			switch (filterValue) {
				case "All":
					break;
				case "Eligible":
					events = events.filter(eventObj => eventObj.isEligible  || eventObj.isInWaitlist); 
					break;
				default:
					break;
			}
		}
		else {
			switch (filterValue) {
				case "All":
					events = events.filter(eventObj => eventObj.attendee_status_id === "Registered" || eventObj.isInWaitlist);
					break;
				case "Registered":
					events = events.filter(eventObj => eventObj.attendee_status_id === "Registered");
					break;
				case "Waitlisted":
					events = events.filter(eventObj => eventObj.isInWaitlist);
					break;
				default:
					break;
			}
		}
	}

	return (
		<View style={styles.container}>
			{isLoading || isLoadingF ? (
				<ActivityIndicator
					size="large"
					color="#0000ff"
					animating = {true}
               		style = {styles.activityIndicator} />
			) : (
				<>
				{type && type === "upcoming" ? (
					<View style={styles.picker}>
						<DropDownPicker 
							open={open}
							value={selectedFilterU}
							items={filterItemsU}
							setOpen={setOpen}
							setValue={setSelectedFilterU}
						/> 
					</View>
				) : (
					<View style={styles.picker}>
						<DropDownPicker 
							open={open}
							value={selectedFilterM}
							items={filterItemsM}
							setOpen={setOpen}
							setValue={setSelectedFilterM}
						/> 
					</View>
				)}
				<FlatList style={styles.list}
					data={filteredEvents}
					keyExtractor={(item) => `${item.event_id}${item.user_id}`}
					renderItem={({ item }) => (
						<View>
							<TouchableOpacity
								onPress={() =>
									navigation.navigate("EventDetails", {
										eventObj: item,
										userId: user_id,
										navigation: navigation,
									})
								}>
								<EventListItem
									eventObj={item}/>
							</TouchableOpacity>						
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
		width: "100%",
    	maxWidth: 400,
		backgroundColor: "#fff",
		paddingLeft: 5,
		paddingRight: 5,
	},
	activityIndicator: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		height: 80
	},
	picker: {
    	alignItems: "center",
		width: 180,
		top: 10,
		height: 50,
		marginBottom: 10,
		zIndex: 2000,
	},
	list: {
		paddingTop: 10,
	},
});