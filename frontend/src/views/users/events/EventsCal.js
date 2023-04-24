import * as React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import {Calendar, LocaleConfig} from 'react-native-calendars';

export default function EventsCal({navigation}) {
	const [selected, setSelected] = useState('');
	const [events, setEvents] = useState([]);
	const [markedDates, setMarkedDates] = useState({});
	
	useEffect(() => {
	  const getAllEvents = async () => {
		const apiURL = "https://dhkil9f47g.execute-api.us-west-2.amazonaws.com";
		const response = await axios.get(`${apiURL}/events`);
		const data = response.data;
		setEvents(data);
		console.log(data);
  
		// create an array for the event dates to use in the calendar00000000
		const eventDatesArray = data.map(event => {
		  console.log(event.event_date);
		  // check the date is valid
		  if (event.event_date && Date.parse(event.event_date)) {
			const originalDate = new Date(event.event_date);
			const formattedDate = originalDate.toISOString().slice(0, 10);
			return { [formattedDate]: { selected: true, selectedColor: 'orange', eventId: event.event_id } };
		  } else {
			return null; // invalid date
		  }
		});
  
		console.log(eventDatesArray);
		const mergedMarkedDates = Object.assign({}, ...eventDatesArray); 
		// use eventDatesArray to create a new object
		console.log(mergedMarkedDates);
		setMarkedDates(mergedMarkedDates); 
  
		return eventDatesArray; 
	  };
  
	  getAllEvents()
		.then(eventDatesArray => {
		  console.log("eventdate", eventDatesArray);
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
			onDayPress={day => {
				setSelected(day.dateString);
				const {eventId} = markedDates[day.dateString];
				if (eventId) {
					console.log('eventId', eventId);
					const eventObj = events.find(event => event.event_id === eventId);
					console.log('eventObj', eventObj)
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
});
