import { View, Text, StyleSheet, FlatList } from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_END_POINT } from "@env";
import DropDownPicker from "react-native-dropdown-picker";

export default function AttendanceRecords({ navigation, user }) {
	const [attendanceRecords, setAttendanceRecords] = useState([]);
	const [selectedFilter, setSelectedFilter] = useState("");
	const [filteredRecords, setFilteredRecords] = useState([]);
	const [open, setOpen] = useState(false);

	const handleGetAttendanceRecords = async () => {
		const apiURL = API_END_POINT;
		console.log(user.user_id);
		const response = await axios.get(
			`${apiURL}attendee/events/${user.user_id}`
		);
		const data = response.data;
		console.log("data", data);
		setAttendanceRecords(data);
	};

	const filterRecords = () => {
		if (selectedFilter === "Attended") {
			setFilteredRecords(
				attendanceRecords.filter(
					(event) => event.attendance_status_id === "Attended"
				)
			);
		} else if (selectedFilter === "Upcoming") {
			setFilteredRecords(
				attendanceRecords.filter(
					(event) => event.attendance_status_id === "Unknown"
				)
			);
		} else if (selectedFilter === "No Show") {
			setFilteredRecords(
				attendanceRecords.filter(
					(event) => event.attendance_status_id === "No Show"
				)
			);
		}
	};

	const handleFilterChange = (value) => {
		setSelectedFilter(value);
	};

	useEffect(() => {
		const fetchData = async () => {
			await handleGetAttendanceRecords();
		};
		fetchData();
	}, [user]);

	useEffect(() => {
		filterRecords();
		// setSelectedFilter()
	}, [selectedFilter, attendanceRecords]);

	return (
		<View>
			<Text>Attendance Records for {user.first_name}</Text>

			<DropDownPicker
				open={open}
				items={[
					{ label: "Attended", value: "Attended" },
					{ label: "Upcoming", value: "Upcoming" },
					{ label: "No Show", value: "No Show" },
				]}
				value={selectedFilter}
				// defaultValue={selectedFilter}
				containerStyle={{ height: 40 }}
				style={{ backgroundColor: "#fafafa" }}
				itemStyle={{ justifyContent: "flex-start" }}
				dropDownStyle={{ backgroundColor: "#fafafa" }}
				onChangeItem={(item) => handleFilterChange(item.value)}
				setOpen={setOpen}
				setValue={setSelectedFilter}
			/>

			<FlatList
				data={filteredRecords}
				keyExtractor={(attendanceRecord) => attendanceRecord.event_id}
				renderItem={({ item }) => (
					<Text
						style={styles.text}
						onPress={() => {
							navigation.navigate("EventDetailsHost", {
								upcomingEvent: item,
							});
						}}>
						{item.event_name} {item.date} {item.attendance_status}
					</Text>
				)}
				ListHeaderComponent={
					<Text style={styles.header}>
						{selectedFilter === "Upcoming"
							? "Upcoming Events"
							: `${selectedFilter} Events`}
					</Text>
				}
			/>
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

	header: {
		fontSize: 24,
		fontWeight: "bold",
		textAlign: "center",
		padding: 20,
	},
	text: {
		fontSize: 16,
		textAlign: "center",
		padding: 10,
	},
});
