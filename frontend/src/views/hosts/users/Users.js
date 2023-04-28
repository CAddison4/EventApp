import { View, Text, Button, FlatList, LogBox } from "react-native";
import { Picker } from "@react-native-picker/picker";
import DropDownPicker from "react-native-dropdown-picker";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_END_POINT } from "@env";

import UserDetails from "./UserDetails";

LogBox.ignoreLogs([
	"Non-serializable values were found in the navigation state",
]);

export default function Users({ navigation }) {
	const [open, setOpen] = useState(false);
	const [users, setUsers] = useState([]);
	const [editedMemberships, setEditedMemberships] = useState([]);
	const [selectedMembershipStatus, setSelectedMembershipStatus] =
		useState("All");
	const [isPickerVisible, setIsPickerVisible] = useState(false);
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [updateFilter, setUpdateFilter] = useState(false);

	const handlePageRefresh = async () => {
		const newUsers = await getUsers();
		setUsers(newUsers);
		setSelectedMembershipStatus("All");
	};

	const getUsers = async () => {
		const apiURL = API_END_POINT;
		const usersResponse = await axios.get(`${apiURL}users`);
		return usersResponse.data;
	};

	const getFilteredMemberships = async () => {
		const apiURL = API_END_POINT;
		const membershipsResponse = await axios.get(`${apiURL}membership`);
		const membershipStatuses = membershipsResponse.data.membershipStatuses;
		const edited = [{ membership_status_id: "All" }, ...membershipStatuses];
		return edited;
	};

	const handleGetEditedMemberships = async () => {
		const [edited, users] = await Promise.all([
			getFilteredMemberships(),
			getUsers(),
		]);
		setEditedMemberships(edited);
		setUsers(users);
		setUpdateFilter(true); // set the flag to trigger the useEffect
	};

	const handleMembershipFilterChange = (itemValue, itemIndex) => {
		setSelectedMembershipStatus(itemValue);
		if (itemValue === "All") {
			setFilteredUsers(users);
			return;
		}
		setFilteredUsers(
			users.filter((user) => user.membership_status_id === itemValue)
		);
	};

	useEffect(() => {
		const fetchData = async () => {
			await handleGetEditedMemberships();
			setIsPickerVisible(true);
		};
		fetchData();
	}, []);

	useEffect(() => {
		const filterUsers = () => {
			if (selectedMembershipStatus === "All") {
				setFilteredUsers(users);
			} else {
				setFilteredUsers(
					users.filter(
						(user) => user.membership_status_id === selectedMembershipStatus
					)
				);
			}
		};
		filterUsers();
	}, [selectedMembershipStatus, users]);

	useEffect(() => {
		if (updateFilter) {
			handleMembershipFilterChange(selectedMembershipStatus);
			setUpdateFilter(false);
		}
	}, [updateFilter]);

	return (
		<View>
			<>
				{isPickerVisible && (
					<>
						<Text>Membership Status</Text>

						<View style={{ zIndex: 2000 }}>
                            <DropDownPicker
                                open={open}
                                value={selectedMembershipStatus}
                                items={editedMemberships.map((item) => ({
                                    label: item.membership_status_id,
                                    value: item.membership_status_id,
                                }))}
                                setOpen={setOpen}
                                setValue={handleMembershipFilterChange}
                                zIndex={5000}
                                // setItems={setItems}
                            />
                        </View>
						{/* <Picker
							selectedValue={selectedMembershipStatus}
							onValueChange={handleMembershipFilterChange}>
							{editedMemberships.map((item, index) => (
								<Picker.Item
									value={item.membership_status_id}
									key={index}
									label={item.membership_status_id}
								/>
							))}
						</Picker> */}
						<Text>{selectedMembershipStatus} Users</Text>
						<FlatList
							data={filteredUsers}
							renderItem={({ item }) => (
								<Text
									onPress={() =>
										navigation.navigate("UserDetails", {
											user: item,
											handleRefresh: handlePageRefresh,
										})
									}>
									{item.first_name} {item.last_name} {item.membership_status_id}{" "}
									{item.email}
								</Text>
							)}
						/>
					</>
				)}
			</>
		</View>
	);
}
