import { StyleSheet, Text, View, Button } from "react-native";
import { formatDate } from "../utilities/dates"
export default function EventListItem({ eventObj, navigation }) {

	return (
		<View key={`${eventObj.event_id}${eventObj.user_id}`}>
			<Text style={{ fontWeight: 400 }}>{eventObj.event_name}</Text>
			<Text>{formatDate(eventObj.event_date)}  {eventObj.type_id}</Text>
		</View>
	);
}


