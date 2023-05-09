import { useState, useEffect } from "react";
import axios from "axios";
import { API_END_POINT } from "@env";
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";

export default function Attendancce({ navigation, route }) {
  const eventObj = route.params.eventObj;
  const today = new Date().toISOString().slice(0, 10);
  const [attendees, setAttendees] = useState([]);
  const [editAttendance, setEditAttendance] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // get event attendees
    const getAttendees = async () => {
      const response = await axios.get(
        `${API_END_POINT}attendee/users/${eventObj.event_id}`
      );
      const data = response.data;
      // filter it to only registered attendees
      const registeredAttendees = data.filter(
        (attendee) => attendee.attendee_status_id == "Registered"
      );

      // if there is registered attendees, set editAttendance object
      // to have the user_id as key and attendance status as value
      if (registeredAttendees.length > 0) {
        const editAttendanceObj = {};
        registeredAttendees.map((attendee) => {
          editAttendanceObj[attendee.user_id] = attendee.attendance_status_id;
        });
        setEditAttendance(editAttendanceObj);
      }
      setAttendees(registeredAttendees);
      setLoading(false);
    };
    getAttendees();
  }, []);

  // toggle the editAttendance array
  const handleAttendanceButton = (userId) => {
    setEditAttendance((editAttendance) => ({
      ...editAttendance,
      [userId]: editAttendance[userId] === "Attended" ? "No Show" : "Attended",
    }));
  };


  const handleSubmit = async () => {
    try {
      // check if there is value in the editattendance array
      // if there is value, then update the database by put request
      // if there is no value, then do nothing
      if (Object.keys(editAttendance).length > 0) {
        const editAttendanceArray = Object.entries(editAttendance);
        editAttendanceArray.map(async (attendee) => {
          const userId = attendee[0];
          const attendanceStatus = attendee[1];
          const response = await axios.put(
            `${API_END_POINT}attendee/${eventObj.event_id}/${userId}`,
            { attendance_status: attendanceStatus }
          );
        });

        // fetch the updated attendees list
        setTimeout(async () => {
          setLoading(true);
          const response = await axios.get(
            `${API_END_POINT}attendee/users/${eventObj.event_id}`
          );
          const attendees = response.data;
          // add it to the upcomming event object and push it back to detail
          navigation.navigate("EventDetailsHost", {
            upcomingEvent: {
              ...eventObj,
              attendees,
            }
          });
        }, 500);

      }

    }
    catch (error) {
      console.log(error);
    }
  };


  return (

    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.eventInfoContainer}>
          <Text style={styles.eventTitle}>{eventObj.event_name}</Text>
          <View style={styles.labelContainer}>
            <Text style={styles.title}>Attendees</Text>
            <View style={styles.statusContainer}>
              <Text style={styles.label}>ATTENDED</Text>
              <Text style={styles.label}>NO SHOW</Text>
            </View>
          </View>
        </View>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            animating={true}
            style={styles.activityIndicator}
          />
        ) : (
          <FlatList
            data={attendees}
            keyExtractor={(attendee) => attendee.user_id.toString()}
            renderItem={({ item: attendee }) => (
              <View style={styles.item} key={attendee.user_id}>
                <Text style={styles.itemText}>
                  {attendee.first_name} {attendee.last_name}
                </Text>
                {eventObj.event_date <= today && (
                  <View style={styles.attendanceButtons}>
                    <TouchableOpacity
                      style={[
                        styles.attendedButton,
                        editAttendance[attendee.user_id] === "Attended" && styles.attended,
                      ]}
                      onPress={() => handleAttendanceButton(attendee.user_id)}
                    ></TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.noshowButton,
                        editAttendance[attendee.user_id] === "No Show" && styles.noShow,
                      ]}
                      onPress={() => handleAttendanceButton(attendee.user_id)}
                    ></TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          />
        )}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit} >
          <Text style={styles.submitButtonText}> Save </Text>
        </TouchableOpacity>
      </View>
    </View>

  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    margin: 5,
  },
  eventInfoContainer: {
    justifyContent: "center",
    height: 100,
  },
  eventTitle: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    margin: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 5,
  },
  statusContainer: {
    width: 180,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 16,
    margin: 5,
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
    marginVertical: 3,
    marginHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemText: {
    fontSize: 16,
  },
  attendanceButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 160,
  },
  attendedButton: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 15,
    elevation: 2,
    margin: 10,
  },
  noshowButton: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 15,
    elevation: 2,
    margin: 10,
  },
  attended: {
    backgroundColor: "#159E31",
  },
  noShow: {
    backgroundColor: "#E31E1E",
  },
  submitButton: {
    backgroundColor: "#159E31",
    height: 50,
    justifyContent: "center",
    alignContent: "center",
  },
  submitButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});
