import { StyleSheet, Text, View, Button } from "react-native";
import CreateEvent from "./CreateEvent";
import Users from "../users/Users";
import EventsHost from "./EventsHost";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_END_POINT } from "@env";

export default function HostMenu({ navigation }) {
	const date = new Date();
	const formattedDate = date.toISOString().slice(0, 10);
	const [eventObj, setEventObj] = useState(null);
	// useEffect(() => {
	// 	const getEvents = async () => {
	// 	  const response = await axios.get(`${API_END_POINT}event/date/${formattedDate}`);
	// 	  const data = response.data;
	// 	  setEventObj(data);
	// 	};
	// 	getEvents();
	//   }, []);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Host Menu</Text>
			<View style={styles.buttonsContainer}>
				<View style={styles.buttonWrapper}>
					{eventObj ? (
						<>
							<Text>Check Attendance</Text>
							<Button
								title={String(eventObj.event_name)}
								onPress={() => {
									navigation.navigate("Attendance", { eventObj: eventObj });
								}}
								buttonStyle={styles.button}
							/>
						</>
					) : null}
				</View>
				<View style={styles.buttonWrapper}>
					<Button
						title="Events List"
						onPress={() => {
							navigation.navigate("EventsHost");
						}}
						buttonStyle={styles.button}
					/>
				</View>
				<View style={styles.buttonWrapper}>
					<Button
						title="Create Event"
						onPress={() => {
							navigation.navigate("CreateEvent");
						}}
						buttonStyle={styles.button}
					/>
				</View>
				<View style={styles.buttonWrapper}>
					<Button
						title="Users List"
						onPress={() => {
							navigation.navigate("Users");
						}}
						buttonStyle={styles.button}
					/>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 20,
	},
	buttonsContainer: {
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		marginTop: 50,
	},
	buttonWrapper: {
		width: "100%",
		paddingHorizontal: 40,
		paddingVertical: 20,
	},
	button: {
		width: 300,
		height: 40,
		marginBottom: 20,
	},
});
