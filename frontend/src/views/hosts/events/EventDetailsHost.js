import { View, Text, Button, TextInput, StyleSheet } from "react-native"
import React, { useState } from "react";
import axios from "axios";
import { API_END_POINT } from "@env";

export default function EventDetailsHost({ navigation, route }) {
  const eventObj = route.params.upcomingEvent;
  const eventId = eventObj.event_id;
  const [isEdit, setIsEdit] = useState(false);
  const [editedName, setEditedName] = useState(eventObj.event_name);
  const [editedStartDate, setEditedStartDate] = useState(eventObj.event_start);
  const [editedEndDate, setEditedEndDate] = useState(eventObj.event_end);
  const [editedLocation, setEditedLocation] = useState(eventObj.event_location);
  const [editedCapacity, setEditedCapacity] = useState(eventObj.capacity);

  const handleSubmit = async () => {
    // formart setInpEvnStartDatetime with just date
		const eventDate = editedStartDate.slice(0, 10);

    try{
        // send editedName, editedDate, editedLocation, editedCapacity to backend
        const response = await axios.put(`${API_END_POINT}/event/${eventId}`, {
          eventName: editedName,
          eventDate: eventDate,
          eventStart: editedStartDate,
          eventEnd: editedEndDate,
          eventLocation: editedLocation,
          capacity: editedCapacity,
          eligibilityType: eventObj.type_id,
          loyaltyMax : eventObj.loyalty_max,
          cancelled : eventObj.cancelled,
          reasonCancelled : eventObj.reason_cancelled,
        });
        const data = response.data;
        setIsEdit(false);
        // push to event details page
        navigation.push("EventDetailsHost", { upcomingEvent: data });
    }catch(error){
      alert("An error occurred while updating event");
      console.error("Error updating event:", error);
    }

  };

  const handleDelete = async () => {
    try {
      const response = await axios.put(`${API_END_POINT}/event/${eventId}`, {
        eventName: eventObj.event_name,
        eventDate: eventObj.event_date,
        eventStart: eventObj.event_start,
        eventEnd: eventObj.event_end,
        eventLocation: eventObj.event_location,
        capacity: eventObj.capacity,
        eligibilityType: eventObj.type_id,
        loyaltyMax: eventObj.loyalty_max,
        cancelled: true,
      });
      // check if the request was successful
      if (response.status === 200) {
        console.log("Event successfully cancelled");
        // go back to event list
        navigation.navigate("EventsHost");
      } else {
        console.log("Error cancelling event");
      }
    } catch (error) {
      console.log("Error cancelling event:", error.message);
    }
    
  };
  return (
    <View style={styles.container}>
      {isEdit ? (
        <>
          <TextInput
            value={editedName}
            onChangeText={setEditedName}
            placeholder="Event name"
            style={styles.textInput}
          />
          <TextInput
            value={editedStartDate}
            onChangeText={setEditedStartDate}
            placeholder="Event date"
            style={styles.textInput}
          />
          <TextInput
            value={editedEndDate}
            onChangeText={setEditedEndDate}
            placeholder="Event date"
            style={styles.textInput}
          />
          <TextInput
            value={editedLocation}
            onChangeText={setEditedLocation}
            placeholder="Event location"
            style={styles.textInput}
          />
          <TextInput
            value={editedCapacity}
            onChangeText={setEditedCapacity}
            placeholder="Event capacity"
            keyboardType="numeric"
            style={styles.textInput}
          />
          <Button title="Cancel" onPress={() => setIsEdit(false)} style={styles.button}></Button>
          <Button title="Save" onPress={() => handleSubmit()} style={styles.button}></Button>
        </>
      ) : (
        eventObj && (
          <>
            <Text style={styles.title}>Event Details for event {eventId}</Text>
            <Text>Name: {eventObj.event_name}</Text>
            <Text>Date: {eventObj.event_date}</Text>
            <Text>Location: {eventObj.event_location}</Text>
            <Text>Capacity: {eventObj.capacity}</Text>

            {eventObj.type_id === "Guest List" && (
              <Button
                title="Set Invites"
                onPress={() => navigation.navigate("InviteList", { eventObj })}
              />
            )}
            <Button title="Edit" onPress={() => setIsEdit(true)} style={styles.button}></Button>
            <Button title="Delete" onPress={() => handleDelete()} style={styles.button}></Button>
          </>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff"
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10
  },
  textInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10
  },
  button: {
    marginTop: 20
  }
});
