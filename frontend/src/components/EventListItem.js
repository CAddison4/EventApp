import { StyleSheet, Text, View } from "react-native";
import { formatLongDate } from "../utilities/dates";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function EventListItem({ eventObj }) {
	const colorToIconNameMap = {
		orange: "timer-outline",
		red: "close-circle-outline",
		green: "checkmark-circle-outline",
		black: "alert-circle-outline",
	};

	const iconName = colorToIconNameMap[eventObj.color] || "alert-circle-outline";

	var eventDescription = "";

	if (eventObj.type_id === "Loyalty") {
		eventDescription = `Minimum past events required: ${eventObj.loyalty_max}`;
	} else {
		if (!eventObj.hasRoom) {
			eventDescription = `Capacity: ${eventObj.capacity}, event is FULL`;
		} else {
			eventDescription = `Capacity: ${eventObj.capacity}, spots available: ${eventObj.capacityAvailable}`;
		}
	}

	return (
		<View style={styles.card}>
			<View style={styles.icon}>
				<Ionicons name={iconName} size={36} color={eventObj.color} />
			</View>
			<View
				style={styles.eventItem}
				key={`${eventObj.event_id}${eventObj.user_id}`}>
				<Text style={[styles.boldText]}>{eventObj.event_name}</Text>
				<Text>{`${formatLongDate(eventObj.event_date, true)}`}</Text>
				<Text>{eventObj.type_id}</Text>
				<Text>{eventDescription}</Text>
			</View>
			<View>
				<Ionicons name="chevron-forward-outline" size={24} color="grey" />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		flex: 1,
		flexDirection: "row",
		width: "100%",
		backgroundColor: "#eee",
		//	backgroundColor: "#faeede",
		justifyContent: "space-between",
		alignItems: "center",
		borderRadius: 10,
		margin: 5,
		padding: 5,
	},
	icon: {
		height: 40,
		width: 40,
		marginLeft: 5,
	},
	eventItem: {
		flex: 1,
		flexDirection: "column",
		width: "100%",
		margin: 5,
		marginLeft: 15,
	},
	boldText: {
		fontWeight: "bold",
		fontSize: 16,
	},
});
