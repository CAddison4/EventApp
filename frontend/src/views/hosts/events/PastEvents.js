import { View, Text, Button, FlatList } from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_END_POINT } from "@env";

export default function PastEvents({ navigation }) {
	const [eventObjs, setEventObjs] = useState([]);
	useEffect(() => {
		const getEvents = async () => {
			const apiURL = API_END_POINT;
			const response = await axios.get(`${apiURL}/events`);
			const data = response.data.filter((eventObj) => {
				//Decide if we want this to be the event start date or event end date. Ensure Upcoming Events is updated too.
				const eventDate = new Date(eventObj.event_date);
				const now = new Date();
				return eventDate < now;
			});
			setEventObjs(data);
			// setEventObjs(data);
		};
		getEvents();
	}, []);
	return (
		<View>
			<Text>Past Events</Text>

			<FlatList
				data={eventObjs}
				renderItem={({ item }) => (
					<Text
						onPress={() =>
							navigation.navigate("EventDetailsHost", { eventObj: item })
						}>
						{item.event_name}
					</Text>
				)}
			/>
		</View>
	);
}
