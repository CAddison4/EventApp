import {
	View,
	Text,
	Button,
	FlatList,
	LogBox,
	SectionList,
	TextInput,
	StyleSheet,
	TouchableOpacity,
	Keyboard,
} from "react-native";

import { ActivityIndicator } from "react-native";
import { Picker } from "@react-native-picker/picker";
import DropDownPicker from "react-native-dropdown-picker";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_END_POINT } from "@env";

import UserDetails from "./UserDetails";
// import SearchButton from "../../partials/hostPartials/SearchButton";
import SearchBar from "../../partials/hostPartials/SearchBar";
import ClearFilterButton from "../../partials/hostPartials/ClearFilterButton";
import UsersListItem from "../../../components/UsersListItem";

LogBox.ignoreLogs([
	"Non-serializable values were found in the navigation state",
]);
// function ClearFilterButton({ onPress }) {
// 	return <Button title="Clear Filter" onPress={onPress} />;
// }

// function SearchButton({ onPress }) {
// 	return <Button title="Search" onPress={onPress} />;
// }

export default function Users({ navigation }) {
	const [searchQuery, setSearchQuery] = useState("");
	const [open, setOpen] = useState(false);
	const [users, setUsers] = useState([]);
	const [editedMemberships, setEditedMemberships] = useState([]);
	const [selectedMembershipStatus, setSelectedMembershipStatus] =
		useState("All");
	const [isPickerVisible, setIsPickerVisible] = useState(false);
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [updateFilter, setUpdateFilter] = useState(false);
	const [selectedRole, setSelectedRole] = useState("Attendee");
	const [icon, setIcon] = useState("close-circle-outline");

	const roles = [{ role_id: "Attendee" }, { role_id: "Host" }];

	const handlePageRefresh = async () => {
		const newUsers = await getUsers();
		setUsers(newUsers);
		setSelectedMembershipStatus("All");
		setSearchQuery("");
		setIcon("close-circle-outline");
	};

	const handleSearchQuery = (query) => {
		setSearchQuery(query);
		setIcon("close-circle");
	};

	const handleSearchSubmit = () => {
		Keyboard.dismiss();
	};

	const handleClearFilter = () => {
		setSearchQuery("");
		setSelectedMembershipStatus("All");
		setIcon("close-circle-outline");
	};

	const handleSelectRole = (itemValue) => {
		setSelectedRole(itemValue);
	};

	const filterUsers = () => {
		if (selectedMembershipStatus === "All") {
			setFilteredUsers(
				users.filter(
					(user) =>
						user.role_id === selectedRole &&
						(user.first_name
							.toLowerCase()
							.includes(searchQuery.toLowerCase()) ||
							user.last_name
								.toLowerCase()
								.includes(searchQuery.toLowerCase()) ||
							user.email.toLowerCase().includes(searchQuery.toLowerCase()))
				)
			);
		} else {
			setIcon("close-circle");
			setFilteredUsers(
				users.filter(
					(user) =>
						user.membership_status_id === selectedMembershipStatus &&
						user.role_id === selectedRole &&
						(user.first_name
							.toLowerCase()
							.includes(searchQuery.toLowerCase()) ||
							user.last_name
								.toLowerCase()
								.includes(searchQuery.toLowerCase()) ||
							user.email.toLowerCase().includes(searchQuery.toLowerCase()))
				)
			);
		}
	};

	const getUsers = async () => {
		const apiURL = API_END_POINT;
		try {
			const usersResponse = await axios.get(`${apiURL}users`);
			return usersResponse.data;
		} catch {
			console.log("error");
			return [];
		}
	};

	const getFilteredMemberships = async () => {
		const apiURL = API_END_POINT;
		try {
			const membershipsResponse = await axios.get(`${apiURL}membership`);
			const membershipStatuses = membershipsResponse.data.membershipStatuses;
			const edited = [{ membership_status_id: "All" }, ...membershipStatuses];
			return edited;
		} catch {
			console.log("error");
			return [{ membership_status_id: "All" }];
		}
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
		// if (itemValue === "All") {
		// 	setFilteredUsers(users);
		// 	return;
		// }
		// setFilteredUsers(
		// 	users.filter((user) => user.membership_status_id === itemValue)
		// );
	};

	useEffect(() => {
		const fetchData = async () => {
			await handleGetEditedMemberships();
			setIsPickerVisible(true);
		};
		fetchData();
	}, []);

	useEffect(() => {
		// const filterUsers = () => {
		// 	if (selectedMembershipStatus === "All") {
		// 		setFilteredUsers(users);
		// 	} else {
		// 		setFilteredUsers(
		// 			users.filter(
		// 				(user) => user.membership_status_id === selectedMembershipStatus
		// 			)
		// 		);
		// 	}
		// };
		filterUsers();
	}, [selectedMembershipStatus, users]);

	useEffect(() => {
		if (updateFilter) {
			handleMembershipFilterChange(selectedMembershipStatus);
			setUpdateFilter(false);
		}
	}, [updateFilter]);

	useEffect(() => {
		console.log("searchQuery", searchQuery);
		filterUsers();
	}, [searchQuery, selectedRole]);

	return (
		<View style={styles.container}>
			{isPickerVisible ? (
				<>
					<View style={styles.header}>
						<Text style={styles.title}>Filter by membership:</Text>
						{console.log("users", users)}
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
								listMode="SCROLLVIEW"
								scrollViewProps={{
									nestedScrollEnabled: true,
								}}
								dropDownContainerStyle={{
									position: "relative",
									top: 0,
									// backgroundColor: "#91C4D9",
								}}
								// style={{ backgroundColor: "#91C4D9" }}
							/>
						</View>
						<View
							style={{
								flexDirection: "row",
								gap: 20,
								justifyContent: "center",
							}}>
							{roles.map((role, index) => (
								<TouchableOpacity
									key={index}
									onPress={() => handleSelectRole(role.role_id)}
									style={[
										styles.radioButton,
										{
											backgroundColor:
												selectedRole === role.role_id ? "#4CAF50" : "#fff",
										},
									]}>
									<Text
										style={{
											color: selectedRole === role.role_id ? "#fff" : "#000",
										}}>
										{`${role.role_id}s`}
									</Text>
								</TouchableOpacity>
							))}
						</View>
						<View
							style={{
								flexDirection: "row",
								marginVertical: 10,
								paddingHorizontal: 20,
							}}>
							<SearchBar
								value={searchQuery}
								onChangeText={(query) => {
									handleSearchQuery(query);
									filterUsers(searchQuery);
								}}
								onSubmitEditing={handleSearchSubmit}
								// color={"#91C4D9"}
								// backgroundColor="#4A738C"
							/>
							<ClearFilterButton
								onPress={handleClearFilter}
								icon={icon}
								// color={"#91C4D9"}
							/>
						</View>
					</View>
					<FlatList
						style={styles.list}
						data={filteredUsers}
						keyExtractor={(item) => `${item.user_id}`}
						renderItem={({ item }) => (
							<View>
								<TouchableOpacity
									onPress={() =>
										navigation.navigate("UserDetails", {
											user: item,
											handleRefresh: handlePageRefresh,
										})
									}>
									<UsersListItem userObj={item} />
								</TouchableOpacity>
							</View>
						)}
					/>
				</>
			) : (
				<View style={styles.container}>
					<ActivityIndicator
						size="large"
						color="#0000ff"
						animating={true}
						style={styles.activityIndicator}
					/>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingLeft: 5,
		paddingRight: 5,
		backgroundColor: "#fff",
		width: "100%",
		maxWidth: 400,
		justifyContent: "center",
		paddingTop: 20,
	},
	header: {
		flexDirection: "column",
		rowGap: 10,
		paddingLeft: 10,
		paddingRight: 10,
	},

	list: {
		paddingTop: 10,
	},

	title: {
		marginVertical: 10,
		fontWeight: "bold",
	},

	radioButton: {
		padding: 10,
		marginVertical: 5,
		borderRadius: 5,
		borderWidth: 1,
		borderColor: "#ccc",
		width: 100,
		alignItems: "center",
		color: "#fff",
	},
});
