import { StyleSheet, View, Text, Button, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import InviteList from "./InviteList";
import axios from "axios";
import { API_END_POINT } from "@env";
import { useEffect, useState } from "react";
export default function CreateEvent({ navigation }) {
	const eventId = 1;
	const defaultValue = "Guest List";

	const [selectedEventType, setSelectedEventType] = useState(defaultValue);
	const [inpEvnName, setInpEvnName] = useState("");

	const [inpEvnMax, setInpEvnMax] = useState("");
	const [inpEvnStartDateTime, setInpEvnStartDatetime] = useState("");
	const [inpEvnEndDateTime, setInpEvnEndDatetime] = useState("");
	const [inpEvnLocation, setInpEvnLocation] = useState("");

	const [eligibilityData, setEligibilityData] = useState([]);
	const [isPickerVisible, setIsPickerVisible] = useState(false);

	const handleEventTypeChange = (itemValue, itemIndex) => {
		setSelectedEventType(itemValue); // Update the state with the selected event type value
	};

	useEffect(() => {
		const geteligibility = async () => {
			// API
			const apiURL = API_END_POINT;
			// GET eligibility
			const response = await axios.get(`${apiURL}eligibility`);
			const data = response.data;
			setEligibilityData(response.data);
			setIsPickerVisible(true);
			console.log("Eligibility", data.eligibilityTypes);
		};
		geteligibility();
	}, []);

	const handleCreateEvent = async () => {
		// API
		const apiURL = API_END_POINT;
		// POST
		try {
			const response = await axios.post(`${apiURL}event`, {
				eligibilityType: selectedEventType,
				eventName: inpEvnName,
				capacity: inpEvnMax,
				eventDate: "2021-10-10",
				eventStart: "2016-01-25 10:10:10",
				eventEnd: "2016-01-25 10:10:10",
				eventLocation: inpEvnLocation,
				loyaltyMax: 0,
			});

			console.log("Event created successfully!", response.data);
		} catch (error) {
			console.error("Error creating event:", error);
		}
	};

	return (
		<View style={styles.container}>
			<>
				{isPickerVisible && ( // check if the eligibility data is fetched
					<>
						<Picker
							selectedValue={selectedEventType}
							onValueChange={handleEventTypeChange}>
							{eligibilityData.eligibilityTypes.map(
								(
									item,
									index // map the eligibility types
								) => (
									<Picker.Item
										value={item.type_id}
										key={index}
										label={item.type_id}
									/>
								)
							)}
						</Picker>
						<TextInput
							placeholder="Event Name"
							style={styles.nameInput}
							onChangeText={(inpEvnName) => setInpEvnName(inpEvnName)}
						/>
						<TextInput
							placeholder="Max Participants"
							style={styles.nameInput}
							onChangeText={(inpEvnMax) => setInpEvnMax(inpEvnMax)}
							keyboardType="numeric"
						/>
						<TextInput
							placeholder="Start Date"
							style={styles.nameInput}
							onChangeText={(inpEvnStartTime) =>
								setInpEvnStartDatetime(inpEvnStartTime)
							}
						/>
						<TextInput
							placeholder="End Date"
							style={styles.nameInput}
							onChangeText={(inpEvnEndTime) =>
								setInpEvnEndDatetime(inpEvnEndTime)
							}
						/>
						<TextInput
							placeholder="Location"
							style={styles.nameInput}
							onChangeText={(inpEvnLocation) =>
								setInpEvnLocation(inpEvnLocation)
							}
						/>
						<Button title="Proceed" onPress={handleCreateEvent} />
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
