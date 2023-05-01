import { StyleSheet, View, Text, Button, TextInput } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import InviteList from "./InviteList";
import axios from "axios";
import { API_END_POINT } from "@env";
import { useEffect, useState } from "react";
export default function CreateEvent({ navigation }) {
	// const eventId = 1;
	const defaultValue = "Guest List";

	const [selectedEventType, setSelectedEventType] = useState(defaultValue);
	const [inpEvnName, setInpEvnName] = useState("");

	const [inpEvnMax, setInpEvnMax] = useState("");
	const [inpEvnStartDateTime, setInpEvnStartDatetime] = useState("");
	const [inpEvnEndDateTime, setInpEvnEndDatetime] = useState("");
	const [inpEvnLocation, setInpEvnLocation] = useState("");

	const [eligibilityData, setEligibilityData] = useState([]);
	const [isPickerVisible, setIsPickerVisible] = useState(false);

	const [open, setOpen] = useState(false);

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
			setEligibilityData(data);
			setIsPickerVisible(true);
		};
		geteligibility();
	}, []);

	const handleCreateEvent = async () => {
		// API
		const apiURL = API_END_POINT;
		
		// formart setInpEvnStartDatetime with just date
		//const eventDate = inpEvnStartDateTime.slice(0, 10);

		// test with dummy date
		const eventDate = "2023-09-21";

		try {
			const response = await axios.get(`${apiURL}event/date/${eventDate}`);
			const data = response.data;
			// record exists
			if(response.status == 200){
				return alert("An event already exists on this date");
			}
		  } catch (error) {
			console.error("Error retrieving events:", error);
		  }
		
		// POST
		try {
		  const response = await axios.post(`${apiURL}/event`, {
			eligibilityType: selectedEventType,
			eventName: inpEvnName,
			capacity: inpEvnMax,
			eventDate: "2023-09-21",
			eventStart:  '2023-09-21 10:10:10',
			eventEnd:  '2023-09-23 10:10:10',
			eventLocation: inpEvnLocation,
			loyaltyMax: 0,
		  });
		  console.log("Event created successfully!", response.data.event.event_id);
		  
		if(selectedEventType == "Guest List")
		{
		  // Navigate to InviteList screen
		  navigation.navigate("InviteList", {
			eventObj: response.data.event})
		}else{
			navigation.navigate("EventDetails", {
			eventObj: response.data.event})
		}

		} catch (error) {
		  console.error("Error creating event:", error);
		}
	};

	return (
		<View style={styles.container}>
			<>
				{isPickerVisible && ( // check if the eligibility data is fetched
					<>
					<Text>Event Type</Text>
					<View style={{ zIndex: 2000 }}>
					<DropDownPicker 
						open={open}
						value={selectedEventType}
						items={eligibilityData.eligibilityTypes.map((item) => ({
							label: item.type_id,
							value: item.type_id,
						}))}
						setOpen={setOpen}
						setValue={handleEventTypeChange}
						/> 

					</View>
						<Text>Event Name</Text>
						<TextInput
							style={styles.nameInput}
							onChangeText={(inpEvnName) => setInpEvnName(inpEvnName)}
						/>
						<Text>Max Participants</Text>
						<TextInput
							style={styles.nameInput}
							onChangeText={(inpEvnMax) => setInpEvnMax(inpEvnMax)}
							keyboardType="numeric"
						/>
						<Text>Start Date</Text>
						<TextInput
							style={styles.nameInput}
							onChangeText={(inpEvnStartTime) =>
								setInpEvnStartDatetime(inpEvnStartTime)
							}
						/>
						<Text>End Date</Text>
						<TextInput
							style={styles.nameInput}
							onChangeText={(inpEvnEndTime) =>
								setInpEvnEndDatetime(inpEvnEndTime)
							}
						/>
						<Text>Location</Text>
						<TextInput
							style={styles.nameInput}
							onChangeText={(inpEvnLocation) => setInpEvnLocation(inpEvnLocation)} />
						<Button title="Create" onPress={handleCreateEvent} />
					</>
				)}
			</>
	  </View>
 	);
};

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
	picker: {
		backgroundColor: '#fafafa',
		width: 180, 
		height: 50, 
		marginBottom: 20 , 
	}
});
