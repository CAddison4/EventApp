import { StyleSheet, Text, View, Button } from "react-native";
export default function EventListItem({ eventObj, navigation }) {
	return (
		<View>
			<Text>{eventObj.name}</Text>
			<Text>{eventObj.description}</Text>
			<Text>{eventObj.date}</Text>
			<Text>{eventObj.time}</Text>
			<Text>{eventObj.location}</Text>
			<Text>{eventObj.status}</Text>
		</View>
	);
}
