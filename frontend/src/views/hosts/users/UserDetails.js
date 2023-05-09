import {
	StyleSheet,
	View,
	Text,
	Button,
	TextInput,
	Alert,
	TouchableOpacity,
	Touchable,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import DropDownPicker from "react-native-dropdown-picker";
import { useState, useEffect } from "react";
// import SelectDropdown from "react-native-select-dropdown";
import axios from "axios";
import { API_END_POINT } from "@env";
import { formatLongDate, formatTime } from "../../../utilities/dates";

export default function UserDetails({ navigation, route }) {
	const user = route.params.user;
	const handleRefresh = route.params.handleRefresh;

	const [memberships, setMemberships] = useState([]);

	const [selectedMembershipStatus, setSelectedMembershipStatus] = useState(
		user.membership_status_id
	);
	const [isPickerVisible, setIsPickerVisible] = useState(false);
	const [open, setOpen] = useState(false);

	const handleMembershipStatusChange = (itemValue, itemIndex) => {
		setSelectedMembershipStatus(itemValue); // Update the state with the selected membership status value
	};

	const handleGetMemberships = async () => {
		const apiURL = API_END_POINT;
		const response = await axios.get(`${apiURL}membership`);
		const data = response.data;
		setMemberships(data);
		setIsPickerVisible(true);
	};

	const handleUpdateUserMembershipStatus = async () => {
		const apiURL = API_END_POINT;
		const response = await axios.put(`${apiURL}/user/${user.user_id}`, {
			firstName: user.first_name,
			lastName: user.last_name,
			membershipStatusId: selectedMembershipStatus,
		});
		const data = response.data;
		Alert.alert("Membership Status Updated");
		try {
			handleRefresh();
		} catch (error) {
			console.log(error);
		}

		navigation.goBack();
	};

	useEffect(() => {
		// handleGetUpdatedUser();
		handleGetMemberships();
	}, [user]);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>
				{user.first_name} {user.last_name}
			</Text>
			<View style={[styles.userInfoContainer, { zIndex: 2000 }]}>
				<View style={styles.userInfoItem}>
					<Text style={styles.label}>User type:</Text>
					<Text style={styles.value}>{user.role_id}</Text>
				</View>

				<View style={styles.userInfoItem}>
					<Text style={styles.label}>User since:</Text>
					<Text style={styles.value}>
						{formatLongDate(user.date_signed_up, true)}
					</Text>
				</View>
				<View>
					<Text style={[styles.label, { marginVertical: 10 }]}>
						Membership Status:
					</Text>
					{isPickerVisible && ( // check if the eligibility data is fetched
						<>
							<View style={{ zIndex: 2000 }}>
								<DropDownPicker
									open={open}
									value={selectedMembershipStatus}
									items={memberships.membershipStatuses.map((item) => ({
										label: item.membership_status_id,
										value: item.membership_status_id,
									}))}
									setOpen={setOpen}
									setValue={handleMembershipStatusChange}
									// setItems={setItems}
								/>
							</View>

							<TouchableOpacity
								style={styles.button}
								onPress={handleUpdateUserMembershipStatus}>
								<Text style={styles.buttonText}>Update Membership Status</Text>
							</TouchableOpacity>
						</>
					)}
					{/* <View style={styles.card}>
						<TouchableOpacity
							style={styles.eventInfoContainer}
							onPress={() =>
								navigation.navigate("AttendanceRecords", { user: user })
							}>
							<View style={styles.eventInfoItem}>
								<Text style={styles.title}>Event Attendance</Text>
								<Ionicons
									name="chevron-forward-outline"
									size={24}
									color="grey"
									style={styles.title}
								/>
							</View>
						</TouchableOpacity>
					</View> */}
					
					<TouchableOpacity
						style={styles.button}
						onPress={() =>
							navigation.navigate("AttendanceRecords", { user: user })
						}>
						<Text style={styles.buttonText}>Event Attendance</Text>
					</TouchableOpacity>

				</View>

				{/* <View style={{ zIndex: -1 }}>
					<AttendanceRecords
						user={user}
						// navigation={navigation}
					/>
				</View> */}
			</View>
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
		textAlign: "center",
		marginBottom: 20,
	},
	userInfoContainer: {
		width: "100%",
		backgroundColor: "#eee",
		borderRadius: 10,
		padding: 20,
	},
	userInfoItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginVertical: 10,
	},
	label: {
		fontWeight: "bold",
	},
	value: {},
	underline: {
		textDecorationLine: "underline",
	},
	button: {
		marginTop: 20,
        height: 60,
        backgroundColor: "#159E31",
        justifyContent:"center",
        textAlign:"center",
		color: "#fff",
	},
	buttonText: {
        color:"white",
        textAlign:"center",
        fontWeight:500,
        fontSize:18,
    },
});
