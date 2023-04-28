import * as React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { API_END_POINT } from "@env";
import { useDispatch, useSelector } from "react-redux";
import EventsFetch from "../../../actions/EventFetch";

export default function EventsCal({ navigation, route }) {
	const [selected, setSelected] = useState("");
	const [events, setEvents] = useState([]);
	const [markedDates, setMarkedDates] = useState({});
	const [filter, setFilter] = useState('All');
	const userId = "c9054246-70e7-4bb6-93d6-ffe80e45a575";
	const contextEvent = useSelector((state) => state.event);
	const dispatch = useDispatch();
	const { type } = route.params;
	const [selectedEvent, setSelectedEvent] = useState(null);
	const [ dateColor, setDateColor] = useState("green");

	
	const customStyle = {
		textDayFontSize: 20,
		textMonthFontSize: 24,
		textYearFontSize: 30,

	};

	useEffect(() => {
		if(contextEvent){

			setEvents(contextEvent);
			if (type === "myevents") {
			const filteredEvents = contextEvent.filter(
				(eventObj => eventObj.attendee_status_id === "Registered" || eventObj.isInWaitlist)
			);
			setEvents(filteredEvents);
			}
	   }
	  }, [navigation, type, contextEvent, filter]);
	  
	  
	  useEffect(() => {
		if(type=="myevents")
		{
			setDateColor("orange")
		}
		const eventDatesArray = events.map((event) => {
		  // console.log(event.event_date);
		  // check the date is valid
		  if (event.event_date && Date.parse(event.event_date)) {
			const originalDate = new Date(event.event_date);
			const formattedDate = originalDate.toISOString().slice(0, 10);
			return {
			  [formattedDate]: {
				selected: true,
				selectedColor: dateColor,
				eventId: event.event_id,
			  },
			};
		  } else {
			return null; // invalid date
		  }
		});
	  
		const mergedMarkedDates = Object.assign({}, ...eventDatesArray);
		setMarkedDates(mergedMarkedDates);
	  }, [events]);
	  
	  return (
		<View>
		  <Text>Events Calendar</Text>
		  {contextEvent ? (
			<Calendar
			  onDayPress={(day) => {
				setSelected(day.dateString);
				const { eventId } = markedDates[day.dateString];
				const selectedEvent = events.find((event) => event.event_id === eventId);
				navigation.navigate("EventDetails", {
				  eventObj: selectedEvent,
				});
			  }}
			  markedDates={markedDates}
			  markingType={"multi-dot"}
			  theme={{
				calendarBackground: "#ffffff",
				textSectionTitleColor: "#b6c1cd",
				dayTextColor: "#2d4150",
				todayTextColor: "#fe7013",
				selectedDayTextColor: "#ffffff",
				monthTextColor: "#2d4150",
				selectedDayBackgroundColor: "#fe7013",
				arrowColor: "#fe7013",
				"stylesheet.calendar.header": {
				  week: {
					marginTop: 5,
					flexDirection: "row",
					justifyContent: "space-between",
				  },
				},
			  }}
			  style={{ borderWidth: 1, borderColor: "gray" }}
			  customStyle={customStyle}
			/>
		  ) : (
			<Text>Loading Events...</Text>
		  )}
		</View>
	  );
	  
	
}
