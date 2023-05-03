import * as React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";
import { Calendar, LocaleConfig, CalendarList } from "react-native-calendars";
import { API_END_POINT } from "@env";
import { useDispatch, useSelector } from "react-redux";
import EventsFetch from "../../../actions/EventFetch";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function EventsCal({ navigation, route }) {
	const [selected, setSelected] = useState("");
	const [events, setEvents] = useState([]);
	const [markedDates, setMarkedDates] = useState({});
	const [filter, setFilter] = useState('All');
	const userId = "c9054246-70e7-4bb6-93d6-ffe80e45a575";
	const contextEvent = useSelector((state) => state.event);
	const dispatch = useDispatch();
	const { type } = route.params;
	let dateColor = "blue";

	useEffect(() => {
		if(contextEvent){

			setEvents(contextEvent);
			if (type === "myevents") {
				console.log("filtering my events");
			const filteredEvents = contextEvent.filter(
				(eventObj => eventObj.attendee_status_id === "Registered" || eventObj.isInWaitlist)
			);
			setEvents(filteredEvents);
			}
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
				dateColor = "blue";
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
		if(eventId){
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
			"Blue: Eligible to register\nGreen: Registered\nOrange: In Waitlist\nRed: Not Eligible",
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
					  onPress={ () => {infoPressed();} }/></Text>
		 	 </View>
			 <View style={styles.calendarContainer}>

				  {contextEvent ? (
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
						  } }
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
				  ) : (
					  <Text>Loading Events...</Text>
				  )}
			  </View></>
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
  