import { useState, useEffect } from "react";
import axios from "axios";
import { API_END_POINT } from "@env";
import { View, Text, Button, FlatList, StyleSheet } from "react-native";

export default function Attendancce({ navigation, route }) {
  const eventObj = route.params.eventObj;
  const [attendees, setAttendees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [editAttendance, setEditAttendance] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);  
  
  useEffect(() => {
    // get event attendees
    const getAttendees = async () => {
      const response = await axios.get(
        `${API_END_POINT}attendee/users/${eventObj.event_id}`
      );
      const data = response.data;

      // if the attendance status is Attended, add to attendance array
      if (data) {
        data.map((attendee) => {
          if (attendee.attendance_status_id === "Attended") {
            setAttendance(prevAttendance => [...prevAttendance, attendee.user_id]);
            setEditAttendance(prevEditAttendance => [...prevEditAttendance, attendee.user_id]);
          }
        })
        setInitialLoad(false);
        setAttendees(data);
      } else {
        setInitialLoad(false);
      }
    };
    getAttendees();
  }, []);
  
  const handleAttendance = async (userId) => {
    if (editAttendance.includes(userId)) {
        //toggle editAttendance array
      setEditAttendance(editAttendance.filter((id) => id !== userId));
    } else {
      setEditAttendance([...editAttendance, userId]);
    } 
  };

  const handleSubmit = async () => {
    try{
        // compare editAttendance array to attendance array
        // if the user is in attendance array but not in editAttendance array, update database to "UnKnown"
        attendance.map(async (userId) => {
            if (!editAttendance.includes(userId)) {
                const response = await axios.put(`${API_END_POINT}attendee/${eventObj.event_id}/${userId}`
                ,{ attendance_status: "Unknown" });
            }
        })
        // // if the user is in editAttendance array but not in attendance array, update database to "Attended"
        editAttendance.map(async (userId) => {
            if (!attendance.includes(userId)) {
                const response = await axios.put(`${API_END_POINT}attendee/${eventObj.event_id}/${userId}`
                ,{ attendance_status: "Attended" });
            }
        })
        // update attendance array
        setAttendance(editAttendance);
        navigation.navigate("EventDetailsHost", { upcomingEvent: eventObj });
    }
    catch (error) {
        console.log(error);
    }
  };

  return (
        <>
        <Text>{eventObj.event_name}</Text>
        {!initialLoad && attendees &&
            attendees.map((attendee) => (
            <View style={styles.item} key={attendee.user_id}>
                <Text style={styles.itemText}>
                {attendee.first_name} {attendee.last_name}  {attendee.attendance_status_id}
                </Text>
                <Button
                title={
                    editAttendance.includes(attendee.user_id.toString()) ? "NO SHOW" : "ATTENDED"
                }
                onPress={() => {
                    handleAttendance(attendee.user_id);
                }}
                buttonStyle={styles.button}
                />
            </View>
            ))}
        <Button title="Save" onPress={handleSubmit} />
        </>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#f194ff",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    margin: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  buttonWrapper: {
    margin: 10,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemText: {
    fontSize: 16,
  },
});
