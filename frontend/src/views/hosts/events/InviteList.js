import Checkbox from "expo-checkbox";
import axios from "axios";
import { View, Text, Button, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { API_END_POINT } from "@env";
import SearchBar from "../../partials/hostPartials/SearchBar";
import ClearFilterButton from "../../partials/hostPartials/ClearFilterButton";
import DropDownPicker from "react-native-dropdown-picker";
export default function InviteList({ navigation, route }) {
	const eventObj = route.params.eventObj;
	const eventId = eventObj.event_id;

	// fetch user list from backend
	const [users, setUsers] = useState([]);
	const [selected, setSelected] = useState([]);
	const [originalSelected, setoriginalSelected] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedMembershipStatus, setSelectedMembershipStatus] = useState("All");
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [updateFilter, setUpdateFilter] = useState(false);
	const [isPickerVisible, setIsPickerVisible] = useState(false);
	const [loading, setLoading] = useState(true);
	const [open, setOpen] = useState(false);
	const [memberships, setMemberships] = useState([]);



	const filterUsers = () => {
		const filteredUsers = users.filter((user) =>
			user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			user.email.toLowerCase().includes(searchQuery.toLowerCase())
		);
		return filteredUsers;
	};

	const filterMembership = async (status) => {
		// filter users based on search query
		const filteredUsersByQuery = filterUsers();
		if (status !== "All") {
			const dropdownFiltered = filteredUsersByQuery.filter(
				user => user.membership_status_id === status
			);
			setFilteredUsers(dropdownFiltered);
		} else {
			setFilteredUsers(filteredUsersByQuery);
		}
	};

	const handleSearchPress = () => {
		filterMembership(selectedMembershipStatus);
	};

	const handleMembershipFilterChange = (item) => {
		setSelectedMembershipStatus(item);
	};

	useEffect(() => {
		filterMembership(selectedMembershipStatus);
	}, [selectedMembershipStatus]);

	// fetch all the users and also fetch the list of users that are already invited
	// check if the userid is in the list of invited users
	useEffect(() => {
		const getUsers = async () => {
			const apiURL = API_END_POINT;
			const response = await axios.get(`${apiURL}/users`);
			const data = response.data;
			// get rid of Rejected and None users and host
			const filteredData = await data.filter((user) => user.membership_status_id !== "Rejected"
				&& user.membership_status_id !== "None"
				&& user.role_id === "Attendee");
			setUsers(filteredData);
			setFilteredUsers(filteredData);
		};

		const getFilteredMemberships = async () => {
			const apiURL = API_END_POINT;
			const membershipsResponse = await axios.get(`${apiURL}membership`);
			const membershipStatuses = membershipsResponse.data.membershipStatuses;
			// get rid of Rejected and None and add All
			const removed = membershipStatuses.filter((membership) => membership.membership_status_id !== "Rejected"
				&& membership.membership_status_id !== "None");
			const edited = [{ membership_status_id: "All" }, ...removed];
			setMemberships(edited);
		};

		const getInvitedUsers = async () => {
			const apiURL = API_END_POINT;
			const response = await axios.get(`${apiURL}/attendee/users/${eventId}`);
			const data = response.data;
			// create a list of user_ids that are already invited
			const users = data.map((user) => user.user_id);
			if (users) {
				setSelected(users);
				setoriginalSelected(users);
			} else {
				setSelected([]);
				setoriginalSelected([]);
			}
		};

		getUsers();
		getFilteredMemberships();
		getInvitedUsers();

		setIsPickerVisible(true);
		setLoading(false);
	}, []);

	// count how many users are selected
	const numSelected = selected.length;
	const handleSelect = (user_id) => {
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

		// navigate back to the event details page
		const attendeesResponse = await axios.get(
			`${apiURL}attendee/users/${eventObj.event_id}`
		);
		const waitlistResponse = await axios.get(
			`${apiURL}waitlist/users/${eventObj.event_id}`
		);
		const attendees = attendeesResponse.data;
		const waitlist = waitlistResponse.data;
		navigation.navigate("EventDetailsHost", {
			upcomingEvent: {
				...eventObj,
				attendees,
				waitlist,
			}
		});
	};

	// if users or eventObj is not loaded, show loading indicator
	if (loading) {
		return (
			<ActivityIndicator
				size="large"
				color="#0000ff"
				animating={true}
				style={styles.activityIndicator}
			/>
		)
	}

	return (
		<View style={styles.container}>
			{isPickerVisible && (
				<View style={styles.header}>
					{/* <Text style={styles.filterTitle}>Filter & Search </Text> */}

					<Text style={styles.title}>Membership Status</Text>
					<View style={{ zIndex: 2000 }}>
						<DropDownPicker
							style={styles.dropdown}
							open={open}
							value={selectedMembershipStatus}
							items={memberships.map((item) => ({
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


					<View style={styles.searchBar}>
						<SearchBar
							value={searchQuery}
							onChangeText={setSearchQuery}
							onSubmitEditing={handleSearchPress}
							onPress={handleSearchPress}
						/>

						<ClearFilterButton
							onPress={() => {
								setSearchQuery("");
								setSelectedMembershipStatus("All");
								setFilteredUsers(users);
							}}
						/>
					</View>
				</View>
			)}

			<View style={styles.eventInfoContainer}>
				<Text style={styles.eventTitle}>{eventObj.event_name}</Text>
				<Text style={styles.listNums}>Capacity  {numSelected}/{eventObj.capacity}</Text>
			</View>

			<Text style={styles.title}>Invite the following:</Text>
			<FlatList
				data={filteredUsers}
				renderItem={({ item }) => (
					<View style={styles.userContainer}>
						<Text
							onPress={() =>
								navigation.navigate("UserDetails", { user: item })
							}
							style={styles.userName}
						>
							{item.first_name} {item.last_name}
						</Text>
						<Checkbox
							value={selected.includes(item.user_id)}
							onValueChange={() => handleSelect(item.user_id)}
							style={styles.checkbox}
						/>
					</View>
				)}
			/>
			<View style={styles.buttonContainer}>
				<Button title="Save" onPress={handleSubmit} />
			</View>
		</View>
	);

}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		paddingHorizontal: 20,
		paddingTop: 20,
	},

	filterTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		marginBottom: 20,
	},
	memberShipContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10,
	},
	title: {
		fontSize: 16,
		fontWeight: 'bold',
		marginBottom: 5,
	},
	dropdown: {
		width: 150,
		marginBottom: 5,
	},
	searchBar: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginVertical: 5,
		marginRight: 10,
	},
	eventInfoContainer: {
		marginBottom: 5,
	},
	eventTitle: {
		fontSize: 20,
		fontWeight: 'bold',	
	},
	listNums: {
		fontSize: 16,
		fontWeight: 'bold',
		marginBottom: 20,
	},
	
	userContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 10,
	},
	userName: {
		flex: 1,
		fontSize: 16,
	},
	checkbox: {
		marginRight: 10,
	},
	buttonContainer: {
		marginTop: 20,
	},
	header: {
		marginBottom: 20,
	},
});