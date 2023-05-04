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
} from "react-native";
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

	const handlePageRefresh = async () => {
		const newUsers = await getUsers();
		setUsers(newUsers);
		setSelectedMembershipStatus("All");
		setSearchQuery("");
	};

	const filterUsers = () => {
		if (selectedMembershipStatus === "All") {
			setFilteredUsers(
				users.filter(
					(user) =>
						user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
						user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
						user.email.toLowerCase().includes(searchQuery.toLowerCase())
				)
			);
		} else {
			setFilteredUsers(
				users.filter(
					(user) =>
						user.membership_status_id === selectedMembershipStatus &&
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
		<View style={styles.container}>
			{isPickerVisible && (
				<>
					<View style={styles.header}>
						<SearchBar
							value={searchQuery}
							onChangeText={setSearchQuery}
							onSubmitEditing={filterUsers}
							onPress={filterUsers}
						/>

						<ClearFilterButton
							onPress={() => {
								setSearchQuery("");
								setSelectedMembershipStatus("All");
								setFilteredUsers(users);
							}}
						/>
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
								listMode="SCROLLVIEW"
								scrollViewProps={{
									nestedScrollEnabled: true,
								}}
								dropDownContainerStyle={{
									position: "relative",
									top: 0,
								}}
							/>
						</View>
					</View>
					<FlatList style={styles.list}
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
									<UsersListItem userObj={item}/>
								</TouchableOpacity>
							</View>
						)}
					/>
				</>
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
		marginBottom: 5,
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
});
