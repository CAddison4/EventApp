import { StyleSheet, Text, View, Button } from "react-native";
import { formatDate } from "../utilities/dates"
export default function EventListItem({ eventObj, navigation }) {

	return (
		<View 
			key={`${eventObj.event_id}${eventObj.user_id}`}
			style={styles.eventItem}>
			<Text style={styles.boldText}>{eventObj.event_name}</Text>
			<Text>{formatDate(eventObj.event_date)}  {eventObj.type_id}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: "100%",
    	maxWidth: 400,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
	eventItem: {
		width: "100%",
		paddingLeft: 10,
		paddingRight: 10,
	},
	boldText: {
		fontWeight: "bold",
	},
});

