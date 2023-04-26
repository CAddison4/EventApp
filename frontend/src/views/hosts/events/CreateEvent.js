import { StyleSheet, View, Text, Button, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import InviteList from "./InviteList";
import axios from "axios";
import { API_END_POINT } from "@env";
import { useEffect, useState } from "react";
export default function CreateEvent({ navigation }) {
	const eventId = 1;
	const defaultValue = "Guest List";
	const [inpEvnType, setInpEvnType] = useState('');
	const [inpEvnName, setInpEvnName] = useState('');
	const [inpEvnDate, setInpEvnDate] = useState('');
	const [inpEvnMax, setInpEvnMax] = useState('');
	const [inpEvnStartTime, setInpEvnStartTime] = useState('');
	const [inpEvnEndTime, setInpEvnEndTime] = useState('');
	const [inpEvnLocation, setInpEvnLocation] = useState('');
	const [eligibilityData, setEligibilityData] = useState([]); 

	 const [selectedEventType, setSelectedEventType] = useState(defaultValue); 
	useEffect(() => {
		const geteligibility = async () => {
			// API
			const apiURL = API_END_POINT;
			// GET eligibility
			const response = await axios.get(`${apiURL}/eligibility`);
			const data = response.data;
			setEligibilityData(response.data);
			console.log(data);
		};
		geteligibility();
	}, []);
	
	const handleCreateEvent = async () => {
		// API
		const apiURL = API_END_POINT;
	  
		// POST
		try {
		  const response = await axios.post(`${apiURL}/event`, {
			eventType: inpEvnType,
			eventName: inpEvnName,
			eventDate: inpEvnDate,
			maxParticipants: inpEvnMax,
			startTime: inpEvnStartTime,
			endTime: inpEvnEndTime,
			location: inpEvnLocation,
		  });
	  
		  console.log("Event created successfully!", response.data);
		  
		} catch (error) {
		  console.error("Error creating event:", error);
		  
		}
	  };

	return (
		<View style={styles.container}>
			<Picker
				selectedValue={selectedEventType}
				onValueChange={(itemValue, itemIndex) => setSelectedEventType(itemValue)}
			>
				{eligibilityData.map((item, index) => {
					return (
						<Picker.Item

							label={item.eventType}
							value={item.eventType}
							key={index}
						/>
					);
				})}
			</Picker>


		<TextInput
		  placeholder="Event Type"
		  style={styles.nameInput}
		  onChangeText={(inpEvnType) => setInpEvnType(inpEvnType)}
		/>
		<TextInput
		  placeholder="Event Name"
		  style={styles.nameInput}
		  onChangeText={(inpEvnName) => setInpEvnName(inpEvnName)}
		/>
		
		<TextInput
		  placeholder="Event Date"
		  style={styles.nameInput}
		  onChangeText={(inpEvnDate) => setInpEvnDate(inpEvnDate)}
		  keyboardType="numeric"
		/>
		<TextInput
		  placeholder="Max Participants"
		  style={styles.nameInput}
		  onChangeText={(inpEvnMax) => setInpEvnMax(inpEvnMax)}
		  keyboardType="numeric"
		/>

		<TextInput
		  placeholder="Start Time"
		  style={styles.nameInput}
		  onChangeText={(inpEvnStartTime) => setInpEvnStartTime(inpEvnStartTime)}
		/>

		<TextInput
		  placeholder="End Time"
		  style={styles.nameInput}
		  onChangeText={(inpEvnEndTime) => setInpEvnEndTime(inpEvnEndTime)}
		/>
		<TextInput
		  placeholder="Location"
		  style={styles.nameInput}
		  onChangeText={(inpEvnLocation) => setInpEvnLocation(inpEvnLocation)}
		/>
		<Button title="Proceed" onPress={handleCreateEvent} />
	  </View>
  );
};


const styles = StyleSheet.create({
	container: {
	  flex: 1,
	  padding: 16,
	  backgroundColor: '#fff',
	},
	nameInput: {
	  paddingBottom: 8,
	  fontSize: 24,
	  borderBottomWidth: 1,
	  borderBottomColor: '#000',
	},
  });
  