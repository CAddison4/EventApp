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
	const [selected, setSelected] = useState([]);
	const [originalSelected, setoriginalSelected] = useState([]);

	// fetch all the users and also fetch the list of users that are already invited
	// check if the userid is in the list of invited users
	useEffect(() => {
		const getUsers = async (status) => {
			const apiURL = API_END_POINT;
			const response = await axios.get(`${apiURL}/users`);
			const data = response.data;
			const filteredData = data.filter((user) => user.role_id === "Attendee");
			setUsers(filteredData);
		  };
		  
		getUsers();

		const getInvitedUsers = async () => {
			const apiURL = API_END_POINT;
			const response = await axios.get(`${apiURL}/attendee/users/${eventId}`);
			const data = response.data;
			// create a list of user_ids that are already invited
			const users = data.map((user) => user.user_id);
			if (users.length > 0) {
				setSelected(users);
				setoriginalSelected(users);
			}
		};
		getInvitedUsers();
	}, []);

	// count how many users are selected
	const numSelected = selected.length;

	const handleCheck = (user_id) => {
		setSelected((selected) => {
			// if user_id is already in selected, remove it
			if (selected.includes(user_id)) {
				return selected.filter((id) => id !== user_id);
			}
			// otherwise, add it to selected
			return [...selected, user_id];
		});
	};

	const handleSubmit = async () => {
		const apiURL = API_END_POINT;
		// send selected to backend
		// filter out the users that are no longer selected
		const unselected = originalSelected.filter(
			(user_id) => !selected.includes(user_id)
		);
		if (unselected.length > 0) {
			unselected.map(async (user_id) => {
				await axios.delete(`${apiURL}/attendee/${eventId}/${user_id}`);
			});
		}

		// filter out the users that are selected but not in the original selected list
		const invited = selected.filter(
			(user_id) => !originalSelected.includes(user_id)
		);
		if (invited.length > 0) {
			invited.map(async (user_id) => {
				await axios.post(`${apiURL}/attendee/${eventId}/${user_id}`, {
					status: "Invited",
				});
			});
		}
		// navigate back to the event details page?
		  navigation.navigate("EventDetailsHost", {
			upcomingEvent: eventObj})
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
					<Text style={styles.eventInfo}>Selected - {numSelected}</Text>
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
									value={selected.includes(item.user_id)}
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
