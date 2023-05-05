import { StyleSheet, Text, View, Alert, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { CalendarList } from "react-native-calendars";
import YearPicker from "../../../components/YearPicker";
import Calendar from "../../../components/Calendar";

export default function EventsCalHost({ route, navigation }) {
	const { eventObjs, handleRefresh } = route.params;
	const [markedDates, setMarkedDates] = useState({});
	// use filter to filter events by upcoming, past, or all
	// type is the upcoming or past
	const [loading, setLoading] = useState(true);
	const [selected, setSelected] = useState("");
	const [selectedYear, setSelectedYear] = useState("");
	
	const handleYearSelect = (year) => {
		setSelectedYear(year);
    };

	// create marked array
	useEffect(() => {
		setSelected(selectedYear + "-01-01");

		const filteredEvents = eventObjs.filter((event) => {
			const eventDate = new Date(event.event_date);
			return eventDate.getFullYear() === selectedYear;
		});
		// console.log("filteredEvents",filteredEvents)
		const eventDatesArray = filteredEvents.map((event) => {
			// check the date is valid
			if (event.event_date && Date.parse(event.event_date)) {
				const originalDate = new Date(event.event_date);
				// format the date to YYYY-MM-DD
				const formattedDate = originalDate.toISOString().slice(0, 10);
				// return the formatted date as a key to the markedDates object
				return {
					[formattedDate]: {
						selected: true,
						selectedColor: "blue",
						disabled: false,
						eventId: event.event_id,
					},
				};
			}

		});

		// merge all the markedDates objects into one
		const mergedMarkedDates = Object.assign({}, ...eventDatesArray);

		setMarkedDates(mergedMarkedDates);
		setLoading(false);
	}, [eventObjs]);

	const infoPressed = () => {
		// show alert that has descriptions of the different colors
		Alert.alert(
			"Event Calendar",
			"Blue: Event exists",
			[
				{
					text: "OK",
					onPress: () => console.log("OK Pressed"),
				},
			],
			{ cancelable: false }
		);
	};
	
	useEffect(() => {
		setSelected(current);
	  }, [current]);

	return (
		<><View style={styles.titleContainer}>
			<Text style={styles.title}>Event Calendar
				<Ionicons
					name="information-circle-outline"
					style={styles.informationIcon}
					// use infoPressed function to show alert
					onPress={() => { infoPressed(); }} /></Text>
			<Text>selected:{selected}</Text>
		</View>
        <View style={{zIndex: 5000}}> 
            <Text>YearPicker Example {selectedYear}</Text>
			<YearPicker onSelect={handleYearSelect} />
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
					<Calendar
					key={selected}
					markedDates={markedDates}
					current={selected}
					/>
				</View>
			)}
		</>
	);
}

const styles = StyleSheet.create({
	calendarContainer: {
		width: "100%",
		height: "100%", // or any other desired height
		zIndex: 1,
	  },
	// calendarContainer: {
	// 	marginTop: 10,
	// 	width: "100%",
	// 	height: "100%",
	// },
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
