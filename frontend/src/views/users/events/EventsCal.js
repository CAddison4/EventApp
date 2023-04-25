import * as React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import {Calendar, LocaleConfig} from 'react-native-calendars';
import { API_END_POINT } from '@env'

export default function EventsCal({navigation}) {
	const [selected, setSelected] = useState('');
	const [events, setEvents] = useState([]);
	const [markedDates, setMarkedDates] = useState({});
	const [filter, setFilter] = useState('All');
	const userId = "c9054246-70e7-4bb6-93d6-ffe80e45a575";

	useEffect(() => {
	  const getAllEvents = async () => {
		const apiURL = API_END_POINT;
		const response = await axios.get(`${apiURL}/events`);
		const data = response.data;
		setEvents(data);
		// console.log("full-list",data);
  
		// check the filter state and filter the events array accordingly

		// create an array for the event dates to use in the calendar
		const eventDatesArray = data.map(event => {
			if (filter === 'All') {
				return event;
			} else if (filter === 'Registered') {
				return events.find(event => event.userId === eventId);
			} else if (filter === 'Eligible') {
				return event.invited;
			} else if (filter === 'Waitlisted') {
				return event.waitlisted;
			}

		  // console.log(event.event_date);
		  // check the date is valid
		  if (event.event_date && Date.parse(event.event_date)) {
			const originalDate = new Date(event.event_date);
			const formattedDate = originalDate.toISOString().slice(0, 10);
			return { [formattedDate]: { selected: true, selectedColor: 'orange', eventId: event.event_id } };
		  } else {
			return null; // invalid date
		  }
	    } );

		// console.log(eventDatesArray);
		const mergedMarkedDates = Object.assign({}, ...eventDatesArray); 
		// use eventDatesArray to create a new object
	    console.log(mergedMarkedDates);
		setMarkedDates(mergedMarkedDates); 
		return eventDatesArray; 
	  };
  
	  getAllEvents()
		.then(eventDatesArray => {
		  // console.log("eventdate", eventDatesArray);
		})
		.catch(error => {
		  console.error(error);
		});
	}, []);
  
	useEffect(() => {
	  // update the markedDates state when the selected date changes
	  console.log("markedDates updated", markedDates);
	}, [markedDates]);
  
	return (
		<View style={styles.container}>
		  <Text>EventsCal Screen</Text>
		  <Calendar
		   style={[styles.calendar, {height: 700}]}
		   calendarStyle={styles.customCalendarStyle}
			onDayPress={day => {
				// filter the events array to find the event that matches the selected date
				setSelected(day.dateString);
				

				const {eventId} = markedDates[day.dateString];
				console.log('eventId', eventId);
				if (eventId) {
					// console.log('eventId', eventId);
					const eventObj = events.find(event => event.event_id === eventId);
					// console.log('eventObj', eventObj)
										// navigate to the event details screen
					navigation.navigate("EventDetails", {
						eventObj: eventObj,
					})
				}
			}}
			markingType={'multi-dot'}
			markedDates={{
			  ...markedDates,
			// if you want to mark the selected date
			//   [selected]: {
			// 	dots: [{ key: 'selected', color: 'green' }],
			// 	selected: true,
			//   },
			}}
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
	},
	calendar: {
	  marginTop: 50,
	  padding: 10,
	  width: 400,
	},
	customCalendarStyle: {
	  dayTextAtIndex0: {
		color: 'red',
		fontSize: 16, // customize the font size for days
	  },
	  dayTextAtIndex6: {
		color: 'blue',
		fontSize: 16, // customize the font size for days
	  },
	  textMonth: {
		fontWeight: 'bold',
		fontSize: 16, // customize the font size for month text
	  },
	  textDayHeader: {
		fontWeight: '300',
		fontSize: 16, // customize the font size for day header
	  },
	},
  });
