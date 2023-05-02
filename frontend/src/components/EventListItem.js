import { StyleSheet, Text, View } from "react-native";
import { formatLongDate } from "../utilities/dates";

export default function EventListItem({ eventObj }) {

	return (
		<View 
			key={`${eventObj.event_id}${eventObj.user_id}`}
			style={styles.eventItem}>
			<Text style={[styles.boldText, {color: eventObj.color}]}>{eventObj.event_name}</Text>
			<Text>
				{`${formatLongDate(eventObj.event_date, false)}, `} 
				{eventObj.type_id} 
				{eventObj.type_id === "Loyalty" ? `, ${eventObj.loyalty_max}` : ""}
			</Text>

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
		paddingLeft: 45,
		paddingRight: 10,
	},
	boldText: {
		fontWeight: "bold",
		fontSize: 16,
	},
});

