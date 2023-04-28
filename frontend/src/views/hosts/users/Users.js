import { View, Text, Button, FlatList } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_END_POINT } from "@env";

import UserDetails from "./UserDetails";

export default function Users({ navigation }) {
	const [users, setUsers] = useState([]);
	const [memberships, setMemberships] = useState([]);
	//const [updatedUser, setUpdatedUser] = useState(user); // This is the user object that will be updated with the new membership status
	const [selectedMembershipStatus, setSelectedMembershipStatus] = useState("");
	const [isPickerVisible, setIsPickerVisible] = useState(false);
	const [testMemberships, setTestMemberships] = useState([]);
	const [filteredUsers, setFilteredUsers] = useState(users); // This is the user object that will be updated with the new membership status

	const handleMembershipFilterChange = (itemValue, itemIndex) => {
		setSelectedMembershipStatus(itemValue); // Update the state with the selected membership status value
	};

	const handleGetMemberships = async () => {
		const apiURL = API_END_POINT;
		const response = await axios.get(`${apiURL}membership`);
		const data = response.data;
		setMemberships(data);
		setIsPickerVisible(true);
	};

	const handleUpdateMembershipFilter = async () => {
		setFilteredUsers(
			users.filter(
				(user) => user.membership_status_id == selectedMembershipStatus
			)
		);
	};

	const getUsers = async () => {
		const apiURL = API_END_POINT;
		const response = await axios.get(`${apiURL}users`);
		const data = response.data;
		setUsers(data);
	};

	useEffect(() => {
		//This page should default to users whose Membership Status is "None" so they are flagged to update their membership status.
		getUsers();
		// filterUsers();
		handleGetMemberships();
	}, [users, navigation]);
	return (
		<View>
			<>
				{isPickerVisible && ( // check if the eligibility data is fetched
					<>
						<Text>Membership Status</Text>
						<Picker
							selectedValue={selectedMembershipStatus}
							onValueChange={handleMembershipFilterChange}>
							{memberships.membershipStatuses.map(
								(
									item,
									index // map the eligibility types
								) => (
									<Picker.Item
										value={item.membership_status_id}
										key={index}
										label={item.membership_status_id}
									/>
								)
							)}
						</Picker>
						<Button
							title="Filter Users"
							onPress={handleUpdateMembershipFilter}
						/>
					</>
				)}
				<Text>All Users</Text>
				{!selectedMembershipStatus ? (
					<FlatList
						data={users}
						renderItem={({ item }) => (
							<Text
								onPress={() =>
									navigation.navigate("UserDetails", { user: item })
								}>
								{item.first_name} {item.last_name} {item.membership_status_id}
							</Text>
						)}
					/>
				) : (
					<FlatList
						data={filteredUsers}
						renderItem={({ item }) => (
							<Text
								onPress={() =>
									navigation.navigate("UserDetails", { user: item })
								}>
								{item.first_name} {item.last_name} {item.membership_status_id}
							</Text>
						)}
					/>
				)}
				{/* <FlatList
					data={filteredUsers}
					renderItem={({ item }) => (
						<Text
							onPress={() =>
								navigation.navigate("UserDetails", { user: item })
							}>
							{item.first_name} {item.last_name} {item.membership_status_id}
						</Text>
					)}
				/> */}
			</>
		</View>
	);
}
