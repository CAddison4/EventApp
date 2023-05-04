import * as React from "react";
import {
	StyleSheet,
	Text,
	View,
	Button,
	FlatList,
	TouchableOpacity,
} from "react-native";
import { formatDate, formatDateTime } from "../../../utilities/dates";

export default function AttendeeList({ navigation, route }) {
	const attendeeList = route.params.attendeeList;
	console.log("attendeeList", attendeeList);
	const listType = route.params.type;
	const eventName = route.params.eventName;
	const eventDate = route.params.eventDate;

	// const event = JSON.parse(eventObj);
	return (
		<View style={styles.container}>
			<Text>
				{listType} Attendees for {eventName}
			</Text>
			<FlatList
				data={attendeeList}
				keyExtractor={(item) => `${item.event_id}${item.user_id}`}
				renderItem={({ item }) => (
					<View>
						{/* <TouchableOpacity
							onPress={() =>
								navigation.navigate("UserDetails", {
									eventObj: item.user_id,
								})
							}
							style={{ paddingTop: 20 }}></TouchableOpacity> */}
						<Text
							onPress={() =>
								navigation.navigate("UserDetails", { user: item })
							}>
							{item.first_name} {item.last_name} - {item.email}
						</Text>
					</View>
				)}
			/>
		</View>
	);
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
});
