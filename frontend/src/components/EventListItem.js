import { StyleSheet, Text, View, Button } from "react-native";
export default function EventListItem({ eventObj, navigation }) {
	return (
		<View key={`${eventObj.event_id}${eventObj.user_id}`}>
			<Text>{eventObj.event_name}</Text>
			<Text>{eventObj.event_date}</Text>
		</View>
	);
}
