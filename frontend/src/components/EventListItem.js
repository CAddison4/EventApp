import { StyleSheet, Text, View, Button } from "react-native";
export default function EventListItem({ eventObj, navigation }) {
	return (
		<View>
			<Text>{eventObj.event_name}</Text>
			<Text>{eventObj.event_date}</Text>
		</View>
	);
}
