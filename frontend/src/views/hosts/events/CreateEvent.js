import {
  StyleSheet,
  View,
  Text,
  Button,
  TextInput,
  Platform,
  ScrollView,
} from "react-native";

import DropDownPicker from "react-native-dropdown-picker";
import InviteList from "./InviteList";
import axios from "axios";
import { API_END_POINT } from "@env";
import { useEffect, useState } from "react";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";

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
    try {
      const response = await axios.get(
        `${apiURL}event/date/${startDateTime.toISOString().slice(0, 10)}`
      );
      // record exists
      console.log(response);
      if (response.status == 200) {
        return alert("Event already exists on that date!");
      }
    } catch (error) {
      console.log("No events on this date:", error);
    }

    // POST
    try {
      const response = await axios.post(`${apiURL}/event`, {
        eligibilityType: selectedEventType,
        eventName: inpEvnName,
        capacity: inpEvnMax,
        eventDate: startDateTime.toISOString().slice(0, 10),
        eventStart: startDateTime.toISOString(),
        eventEnd: endDateTime.toISOString(),
        eventLocation: inpEvnLocation,
        loyaltyMax: selectedEventType == "Loyalty" ? loyaltyMinimum : 0,
      });
      console.log("Event created successfully!", response.data.event);

      if (selectedEventType == "Guest List") {
        // Navigate to InviteList screen
        navigation.navigate("InviteList", {
          eventObj: response.data.event,
        });
      } else {
        navigation.navigate("EventDetails", {
          eventObj: response.data.event,
        });
      }
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  //Start of Date Picker
  const handleStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDateTime;
    setStartDateTime(currentDate);
    setIsStartDateSelected(true);
  };

  const handleEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDateTime;
    setEndDateTime(currentDate);
    setIsStartDateSelected(false);
  };

  const showStartDatepicker = () => {
    setMode("date");
    setShow(true);
    setIsStartDateSelected(true);
  };

  const showStartTimepicker = () => {
    setMode("time");
    setShow(true);
    setIsStartDateSelected(true);
  };

  const showEndDatepicker = () => {
    setMode("date");
    setShow(true);
    setIsStartDateSelected(false);
  };

  const showEndTimepicker = () => {
    setMode("time");
    setShow(true);
    setIsStartDateSelected(false);
  };
  // End of Date Picker

  return (
    <View style={styles.container}>
      {isPickerVisible && (
        <>
          {show && (
            <DateTimePicker
              value={isStartDateSelected == true ? startDateTime : endDateTime}
              mode={mode}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedDate) => {
                setShow(false);
                if (isStartDateSelected == true) {
                  handleStartDateChange(event, selectedDate);
                } else {
                  handleEndDateChange(event, selectedDate);
                }
              }}
            />
          )}
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
              <Text>Loyalty Minimum:</Text>
              <TextInput
                style={styles.nameInput}
                onChangeText={(loyaltyMinimum) =>
                  setLoyaltyMinimum(parseInt(loyaltyMinimum))
                }
				defaultValue="0"
                keyboardType="numeric"
              />
            </>
          )}
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
          <View style={styles.dateTimeContainer}>
            <View style={styles.dateContainer}>
              <Text>Start Date:</Text>
              <Button title="Change Date" onPress={showStartDatepicker} />
              <Text>{startDateTime.toDateString()}</Text>
            </View>
            <View style={styles.timeContainer}>
              <Text>Start Time:</Text>
              <Button title="Change Time" onPress={showStartTimepicker} />
              <Text>{startDateTime.toLocaleTimeString()}</Text>
            </View>
          </View>
          <View style={styles.dateTimeContainer}>
            <View style={styles.dateContainer}>
              <Text>End Date:</Text>
              <Button title="Change Date" onPress={showEndDatepicker} />
              <Text>{endDateTime.toDateString()}</Text>
            </View>
            <View style={styles.timeContainer}>
              <Text>End Time:</Text>
              <Button title="Change Time" onPress={showEndTimepicker} />
              <Text>{endDateTime.toLocaleTimeString()}</Text>
            </View>
          </View>
          <Text>Location</Text>
          <TextInput
            style={styles.nameInput}
            onChangeText={(inpEvnLocation) => setInpEvnLocation(inpEvnLocation)}
          />
          <Button title="Create" onPress={handleCreateEvent} />
        </>
      )}
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
