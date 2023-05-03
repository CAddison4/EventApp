import {
	StyleSheet,
	View,
	Text,
	Button,
	TextInput,
	Platform,
	KeyboardAvoidingView,
	FlatList,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import axios from "axios";
import { API_END_POINT } from "@env";
import { useEffect, useState } from "react";
import MyDateTimePicker from "../../../components/DateTimePicker";
import { ValidateInputs } from "../../../components/CreateErrorHandling";

export default function CreateEvent({ navigation }) {
	const defaultValue = "Guest List";

	const [selectedEventType, setSelectedEventType] = useState(defaultValue);
	const [inpEvnName, setInpEvnName] = useState("");

	const [inpEvnMax, setInpEvnMax] = useState("");
	const [inpEvnLocation, setInpEvnLocation] = useState("");

	const [eligibilityData, setEligibilityData] = useState([]);
	const [isPickerVisible, setIsPickerVisible] = useState(false);

	const [loyaltyMinimum, setLoyaltyMinimum] = useState(0);

	const [startDateTime, setStartDateTime] = useState(new Date());
	const [endDateTime, setEndDateTime] = useState(new Date());
	const [mode, setMode] = useState("date");
	const [show, setShow] = useState(false);
	const [isStartDateSelected, setIsStartDateSelected] = useState(true);
	const apiURL = API_END_POINT;
	const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const handleDateTimeChange = (selectedDateOrTime, identifier) => {
    if (identifier === 'startDate') {
      setStartDateTime(selectedDateOrTime);
    } else {
      setEndDateTime(selectedDateOrTime);
    }
  };

  const handleEventTypeChange = (itemValue, itemIndex) => {
		setSelectedEventType(itemValue); // Update the state with the selected event type value
	};

	useEffect(() => {
		const geteligibility = async () => {
			// GET eligibility
			const response = await axios.get(`${apiURL}eligibility`);
			const data = response.data;
			setEligibilityData(data);
			setIsPickerVisible(true);
		};
		geteligibility();
	}, []);

	const handleCreateEvent = async () => {
    // error handling for inputs
    console.log(inpEvnName)
    const errors = await ValidateInputs(inpEvnName, inpEvnMax, inpEvnLocation, selectedEventType, loyaltyMinimum, startDateTime, endDateTime);
    console.log(errors);
    // error occured
    if (Object.keys(errors).length > 0) {
      console.log("error occured")
      setErrors(errors);
      return;
    }
      // no errors go to POST
		try {
			const postEventObj = {
				eligibilityType: selectedEventType,
				eventName: inpEvnName,
				capacity: inpEvnMax,
				eventDate: startDateTime.toISOString().slice(0, 10),
				eventStart: startDateTime.toISOString(),
				eventEnd: endDateTime.toISOString(),
				eventLocation: inpEvnLocation,
				loyaltyMax: selectedEventType == "Loyalty" ? loyaltyMinimum : 0,
				reason_cancelled: null,
			  };
			const response = await axios.post(`${apiURL}/event`, postEventObj);
			const newEvent = await axios.get(`${apiURL}/event/${response.data.event,event_id}`);
			if (selectedEventType == "Guest List") {
				// Navigate to InviteList screen
				navigation.navigate("InviteList", {
					eventObj: newEvent,
				});
			} else {
				navigation.navigate("EventDetailsHost", {
					upcomingEvent: {
					  ...newEvent,
					  attendees: [],
					  waitlist: [],
					},
				  });
			}
		} catch (error) {
			console.log("Error creating event:", error);
		}
  }

	return (
		<KeyboardAvoidingView behavior={"padding"} enabled>
		    <FlatList
				data={[{ key: 'eventForm' }]}
				renderItem={({ item }) => (
				<View style={styles.container}>
					{isPickerVisible && (
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
							{selectedEventType == "Loyalty" && (
								<>
                {errors.loyaltyMinimum && <Text style={{ color: "red" }}>{errors.loyaltyMinimum}</Text>}
									<Text>Loyalty Minimum:</Text>
									<TextInput
										style={styles.nameInput}
										onChangeText={(loyaltyMinimum) =>
											setLoyaltyMinimum(parseInt(loyaltyMinimum))
										}
										keyboardType="numeric"
									/>
								</>
							)}
               {errors.inpEvnName && <Text style={{ color: "red" }}>{errors.inpEvnName}</Text>}
              <Text>Event name</Text>
							<TextInput
                required
								style={styles.nameInput}
								onChangeText={(inpEvnName) => setInpEvnName(inpEvnName)}
							/>
               {errors.inpEvnMax && <Text style={{ color: "red" }}>{errors.inpEvnMax}</Text>}
							<Text>Max Participants</Text>
							<TextInput
								style={styles.nameInput}
								onChangeText={(inpEvnMax) => setInpEvnMax(inpEvnMax)}
								keyboardType="numeric"
							/>
							<View style={styles.dateTimeContainer}>
								<View style={styles.dateContainer}>
                {errors.startDateTime && <Text style={{ color: "red" }}>{errors.startDateTime}</Text>}
									<Text>Start Date:</Text>
                  <View>
                  <MyDateTimePicker
                  buttonTitle='Change Date'
                  mode={"date"}
                  date={startDateTime}
                  onDateChange={(selectedDate) => handleDateTimeChange(selectedDate, 'startDate')}
                />
                   </View>
									{/* <Button title="Change Date" onPress={showStartDatepicker} /> */}
									<Text>{startDateTime.toDateString()}</Text>
								</View>
								<View style={styles.timeContainer}>
									<Text>Start Time:</Text>
                  <MyDateTimePicker
                  buttonTitle='Change Time'
                  mode={"time"}
                  date={startDateTime}
                  onDateChange={(selectedTime) => handleDateTimeChange(selectedTime, 'startTime')}
                />
									<Text>
										{startDateTime.toLocaleTimeString("en-US", {
											hour: "2-digit",
											minute: "2-digit",
										})}
									</Text>
								</View>
							</View>
							<View style={styles.dateTimeContainer}>
								<View style={styles.dateContainer}>
									<Text>End Date:</Text>
                  <MyDateTimePicker
                    buttonTitle='Change Date'
                    mode={"date"}
                    date={endDateTime}
                    onDateChange={(selectedDate) => handleDateTimeChange(selectedDate, 'endDate')}
                  />
									<Text>{endDateTime.toDateString()}</Text>
								</View>
								<View style={styles.timeContainer}>
									<Text>End Time:</Text>
                  <MyDateTimePicker
                  buttonTitle='Change Time'
                  mode={"time"}
                  date={endDateTime}
                  onDateChange={(selectedTime) => handleDateTimeChange(selectedTime, 'endTime')}
                />
                <Text>
										{endDateTime.toLocaleTimeString("en-US", {
											hour: "2-digit",
											minute: "2-digit",
										})}
									</Text>
								</View>
							</View>
              {errors.inpEvnLocation && <Text style={{ color: "red" }}>{errors.inpEvnLocation}</Text>}
							<Text>Location</Text>
							<TextInput
								style={styles.nameInput}
								onChangeText={(inpEvnLocation) =>
									setInpEvnLocation(inpEvnLocation)
								}
							/>
							{errors.sameDate && <Text style={{ color: "red" }}>{errors.sameDate}</Text>}
							<Button title="Create" onPress={handleCreateEvent} />
						</>
					)}
				</View>

				)}
			/>
		</KeyboardAvoidingView>
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
	picker: {
		backgroundColor: "#fafafa",
		width: 180,
		height: 50,
		marginBottom: 20,
	},
	dateTimeContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginVertical: 20,
	},
	dateContainer: {
		flex: 1,
		alignItems: "center",
	},
	timeContainer: {
		flex: 1,
		alignItems: "center",
	},
});
