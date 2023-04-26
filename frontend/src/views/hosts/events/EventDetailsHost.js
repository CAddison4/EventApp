import { View, Text, Button } from "react-native";
export default function EventDetailsHost({ navigation, route }) {
	const eventObj = route.params.upcomingEvent;
	const eventId = eventObj.event_id;

	return (
		<View>
			<Text>Event Details for event {eventId}</Text>
		</View>
	);
}
