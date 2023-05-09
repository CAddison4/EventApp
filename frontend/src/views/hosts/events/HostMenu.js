import { StyleSheet, Text, View, Button } from "react-native";
import CreateEvent from "./CreateEvent";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_END_POINT } from "@env";

export default function HostMenu({ navigation }) {
	const date = new Date();
	const formattedDate = date.toISOString().slice(0, 10);
	const [eventObj, setEventObj] = useState(null);
	const [errors, setErrors] = useState([]);

	useEffect(() => {
		// get the event for today
		const getEvents = async () => {
			try {
				const response = await axios.get(
					`${API_END_POINT}event/date/${formattedDate}`
				);
				console.log("response: " + response.status);
				if (response.status === 200) {
					const eventExists = response.data.eventExists;
					if (eventExists) {
						setEventObj(response.data.eventExists);
					}
				}
			} catch (error) {
				if (error.response && error.response.statusCode === 500) {
				}
			}
		};
		getEvents();
	}, []);

	return (
		<View style={styles.container}>
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
