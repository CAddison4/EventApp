import * as React from "react";
import { useState, useEffect } from "react";
import { StyleSheet, Text, View, Alert, ActivityIndicator } from "react-native";
import { CalendarList } from "react-native-calendars";
import { useDispatch, useSelector } from "react-redux";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function EventsCal({ navigation, route }) {
	const [selected, setSelected] = useState("");
	const [events, setEvents] = useState([]);
	const [markedDates, setMarkedDates] = useState({});
	const [filter, setFilter] = useState('All');
	const userId = "c9054246-70e7-4bb6-93d6-ffe80e45a575";
	const contextEvent = useSelector((state) => state.event);
	const { type } = route.params;
	let dateColor = "blue";
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		console.log("running use effect")
		if (contextEvent) {
			setEvents(contextEvent);
			if (type === "myevents") {
				console.log("filtering my events");
				const filteredEvents = contextEvent.filter(
					(eventObj => eventObj.attendee_status_id === "Registered" || eventObj.isInWaitlist)
				);
				setEvents(filteredEvents);
			}
		}
		if(contextEvent.length>0){
			setLoading(false);
		}
	}, [navigation, type, contextEvent, filter]);


	useEffect(() => {
		const eventDatesArray = events.map((event) => {
			// check the date is valid
			if (event.event_date && Date.parse(event.event_date)) {
				const originalDate = new Date(event.event_date);
				// format the date to YYYY-MM-DD
				const formattedDate = originalDate.toISOString().slice(0, 10);
				// return the formatted date as a key to the markedDates object
				if (event.isInWaitlist) {
					dateColor = "orange";
				} else if (event.isAttending) {
					dateColor = "green";
				} else if (event.isEligible) {
					dateColor = "grey";
				} else {
					dateColor = "red";
				}
				return {
					[formattedDate]: {
						selected: true,
						selectedColor: dateColor,
						disabled: false,
						eventId: event.event_id,
					},
				};
			} else {
				return null; // invalid date
			}
		});

		// merge all the markedDates objects into one
		const mergedMarkedDates = Object.assign({}, ...eventDatesArray);
		setMarkedDates(mergedMarkedDates);
	}, [events]);

	// when a day is pressed, navigate to the event details screen
	const dayPressed = (day) => {
		setSelected(day.dateString);
		const { eventId } = markedDates[day.dateString];
		if (eventId) {
			const selectedEvent = events.find((event) => event.event_id === eventId);
			navigation.navigate("EventDetails", {
				eventObj: selectedEvent,
				userId: userId,
				navigation: navigation,
			});
		}
	};

	const infoPressed = () => {
		// show alert that has descriptions of the different colors
		Alert.alert(
			"Event Calendar",
			"Blue: Eligible to register\nGreen: Registered\nOrange: In Waitlist\nRed: Not Available",
			[
				{
					text: "OK",
					onPress: () => console.log("OK Pressed"),
				},
			],
			{ cancelable: false }
		);
	};


	return (
		<><View style={styles.titleContainer}>
			<Text style={styles.title}>Event Calendar
				<Ionicons
					name="information-circle-outline"
					style={styles.informationIcon}
					// use infoPressed function to show alert
					onPress={() => { infoPressed(); }} /></Text>
		</View>


				{loading ? (

					<ActivityIndicator
						size="large"
						color="#0000ff"
						animating={true}
						style={styles.activityIndicator}
					/>

				) : (
					<View style={styles.calendarContainer}>
					<CalendarList
						current={selected}
						pastScrollRange={0}
						futureScrollRange={12}
						scrollEnabled={true}
						showScrollIndicator={true}
						markedDates={markedDates}
						disabledByDefault={true}
						disableAllTouchEventsForDisabledDays={true}
						disabledOpacity={0.4}
						markingType={"multi-dot"}
						onDayPress={(day) => {
							dayPressed(day);
						}}
						theme={{
							textDayFontSize: 18,
							textMonthFontSize: 16,
							textDayHeaderFontSize: 16,
							monthTextColor: "black",
							arrowColor: "black",
							textMonthFontWeight: "bold",
							todayTextColor: "lightblue",
							dotColor: "#7EC8E3",
							textDayStyle: { fontWeight: "bold" },
							// Add the following style to increase row height
							calendar: { height: "auto" },
						}} />
					</View>
			)}
		</>
	);

}

const styles = StyleSheet.create({
	calendarContainer: {
		marginTop: 10,
		width: "100%",
		height: "100%",
	},
	titleContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginTop: 10,
	},
	title: {
		textAlign: "center",
		flex: 1,
		fontSize: 20,
		fontWeight: "bold",
	},
	iconContainer: {
		marginRight: 10,
	},
	informationIcon: {
		fontSize: 18,
		color: "grey",
	},
});
