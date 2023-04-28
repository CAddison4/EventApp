import { StyleSheet, View, Text, Button, TextInput, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import DropDownPicker from "react-native-dropdown-picker";
import { useState, useEffect } from "react";
// import SelectDropdown from "react-native-select-dropdown";
import axios from "axios";
import { API_END_POINT } from "@env";

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
			<Text>
				{user.first_name} {user.last_name} {user.email}
			</Text>
			<>
				{isPickerVisible && ( // check if the eligibility data is fetched
					<>
						<Text>Membership Status</Text>
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
						{/* <Picker
							selectedValue={selectedMembershipStatus}
							onValueChange={handleMembershipStatusChange}>
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
						</Picker> */}
						<Button
							title="Update Member Status"
							onPress={handleUpdateUserMembershipStatus}
						/>
					</>
				)}
			</>
		</View>
	);
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: "#fff",
	},
	nameInput: {
		paddingBottom: 8,
		fontSize: 24,
		borderBottomWidth: 1,
		borderBottomColor: "#000",
	},
});
