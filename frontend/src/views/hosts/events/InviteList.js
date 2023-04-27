import Checkbox from "expo-checkbox";
import axios from "axios";
import { View, Text, Button, FlatList, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { API_END_POINT } from "@env";

export default function InviteList({ navigation, route }) {
	const eventObj = route.params.eventObj;
	const eventId = eventObj.event_id;

	// fetch user list from backend
	const [users, setUsers] = useState([]);
	const [checked, setChecked] = useState([]);
	const [originalChecked, setOriginalChecked] = useState([]);

	// fetch all the users and also fetch the list of users that are already invited
	// check if the userid is in the list of invited users
	useEffect(() => {
		const getUsers = async () => {
			const apiURL = API_END_POINT;
			const response = await axios.get(`${apiURL}/users`);
			const data = response.data;
			setUsers(data);
		};
		getUsers();

		const getInvitedUsers = async () => {
			const apiURL = API_END_POINT;
			const response = await axios.get(`${apiURL}/attendee/users/${eventId}`);
			const data = response.data;
			// create a list of user_ids that are already invited
			const users = data.map((user) => user.user_id);
			if (users.length > 0) {
				setChecked(users);
				setOriginalChecked(users);
			}
		};
		getInvitedUsers();
	}, []);

	// count how many users are checked
	const numChecked = checked.length;

	const handleCheck = (user_id) => {
		setChecked((checked) => {
			// if user_id is already in checked, remove it
			if (checked.includes(user_id)) {
				return checked.filter((id) => id !== user_id);
			}
			// otherwise, add it to checked
			return [...checked, user_id];
		});
	};

	const handleSubmit = async () => {
		const apiURL = API_END_POINT;
		// send checked to backend
		// filter out the users that are no longer checked
		const unchecked = originalChecked.filter(
			(user_id) => !checked.includes(user_id)
		);
		console.log("unchecked", unchecked);
		if (unchecked.length > 0) {
			unchecked.map(async (user_id) => {
				await axios.delete(`${apiURL}/attendee/${eventId}/${user_id}`);
			});
		}

		// filter out the users that are checked but not in the original checked list
		const invited = checked.filter(
			(user_id) => !originalChecked.includes(user_id)
		);
		console.log("invited", invited);
		if (invited.length > 0) {
			invited.map(async (user_id) => {
				await axios.post(`${apiURL}/attendee/${eventId}/${user_id}`, {
					status: "Invited",
				});
			});
		}
		// navigate back to the event details page?
	};

	return (
		<View style={styles.container}>
			{eventObj && (
				<>
					<Text style={styles.title}>All Users</Text>
					<Text style={styles.eventInfo}>Event - {eventObj.event_name}</Text>
					<Text style={styles.eventInfo}>
						Max Capacity - {eventObj.capacity}
					</Text>
					<Text style={styles.eventInfo}>Checked - {numChecked}</Text>
					<FlatList
						data={users}
						renderItem={({ item }) => (
							<View style={styles.userContainer}>
								<Text
									onPress={() =>
										navigation.navigate("UserDetails", { user: item })
									}
									style={styles.userName}>
									{item.first_name} {item.last_name}
								</Text>
								<Checkbox
									value={checked.includes(item.user_id)}
									onValueChange={() => handleCheck(item.user_id)}
									style={styles.checkbox}
								/>
							</View>
						)}
					/>
					<View style={styles.buttonContainer}>
						<Button title="Save" onPress={handleSubmit} />
					</View>
				</>
			)}
		</View>
	);
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: "#fff",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 16,
	},
	eventInfo: {
		fontSize: 18,
		marginBottom: 8,
	},
	userContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
	},
	userName: {
		flex: 1,
		fontSize: 16,
	},
	checkbox: {
		marginLeft: 16,
	},
	buttonContainer: {
		marginTop: 16,
	},
});
