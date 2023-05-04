import { Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEvent } from "../../../components/store/eventSlice";

export default function EventsCalHost({ route }) {
	const [events, setEvents] = useState([]);
	const contextEvent = useSelector((state) => state.event);
	const type = route.params.type;

	useEffect(() => {
		if (contextEvent) {
			setEvents(contextEvent);
		}
	}, [contextEvent]);

	return (
		<View>
			<Text>Events Calendar Host</Text>
			{events.map((event) => {
				return <Text>{event.event_name}</Text>;
			})}
		</View>
	);
}
