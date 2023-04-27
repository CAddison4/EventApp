import { View, Text, Button, FlatList } from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_END_POINT } from "@env";

import UserDetails from "./UserDetails";

export default function Users({ navigation }) {
	const [users, setUsers] = useState([]);
	useEffect(() => {
		const getUsers = async () => {
			const apiURL = API_END_POINT;
			const response = await axios.get(`${apiURL}users`);
			const data = response.data;
			setUsers(data);
		};
		//This page should default to users whose Membership Status is "None" so they are flagged to update their membership status.
		getUsers();
	}, [users]);
	return (
		<View>
			<Text>All Users</Text>
			<FlatList
				data={users}
				renderItem={({ item }) => (
					<Text
						onPress={() => navigation.navigate("UserDetails", { user: item })}>
						{item.first_name} {item.last_name} {item.membership_status_id}
					</Text>
				)}
			/>
		</View>
	);
}
