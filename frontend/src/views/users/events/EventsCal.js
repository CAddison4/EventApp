import * as React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { API_END_POINT } from "@env";
import { fetchEvents } from "../../../actions/FetchEvents";

export default function EventsCal({ navigation }) {
	const [selected, setSelected] = useState("");
	const [events, setEvents] = useState([]);
	const [markedDates, setMarkedDates] = useState({});
	const [selectedEvent, setSelectedEvent] = useState();

	const customStyle = {
		textDayFontSize: 20,
		textMonthFontSize: 24,
		textYearFontSize: 30,

	  };
	  
	useEffect(() => {
		fetchEvents
		const getAllEvents = async () => {
			const apiURL = API_END_POINT;
			const response = await axios.get(`${apiURL}events`);
			const data = response.data;
			setEvents(data);
			//console.log(data);
			// create an array for the event dates to use in the calendar
			const eventDatesArray = data.map((event) => {
				// console.log(event.event_date);
				// check the date is valid
				if (event.event_date && Date.parse(event.event_date)) {
					const originalDate = new Date(event.event_date);
					const formattedDate = originalDate.toISOString().slice(0, 10);
					return {
						[formattedDate]: {
							selected: true,
							selectedColor:"",
							eventId: event.event_id,
						},
					};
				} else {
					return null; // invalid date
				}
			});

			//	console.log(eventDatesArray);
			const mergedMarkedDates = Object.assign({}, ...eventDatesArray);
			// use eventDatesArray to create a new object
			//	console.log(mergedMarkedDates);
			setMarkedDates(mergedMarkedDates);

			return eventDatesArray;
		};

		getAllEvents()
			.then((eventDatesArray) => {
				//   console.log("eventdate", eventDatesArray);
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);

	// useEffect(() => {
	// 	// update the markedDates state when the selected date changes
	// 	//	  console.log("markedDates updated", markedDates);
	// }, [markedDates]);

	const handleDatePress = (day) => {
		setSelected(day.dateString);
		const { eventId } = markedDates[day.dateString];
		if (eventId) {
			// just fetch the data and show in bottom
			const eventObj = events.find((event) => event.event_id === eventId);
			// navigation.navigate("EventDetails", {
			// 	eventObj: eventObj,
			// });

			setSelectedEvent(eventObj);
			
		}
	};

	return (
		<View style={styles.container}>
			<Calendar
				style={styles.calendar}
				theme={{ ...customStyle }}
				onDayPress={handleDatePress}
				markingType={"multi-dot"}
				markedDates={{
					...markedDates,
				}}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 0,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
	calendar: {
		marginTop:20,
		width: 400,
	}
});
