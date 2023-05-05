import {
	StyleSheet,
	View,
	Text,
	Button,
	FlatList,
	Keyboard,
	ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useState, useEffect, memo } from "react";
import axios from "axios";
import { API_END_POINT } from "@env";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import SearchBar from "../../partials/hostPartials/SearchBar";
import ClearFilterButton from "../../partials/hostPartials/ClearFilterButton";

import { setEvent } from "../../../components/store/eventSlice";
import { useDispatch, useSelector } from "react-redux";

export default function EventsListHost({ route }) {
	const {
		eventObjs,
		// searchQuery,
		// submittedSearchQuery,
		handleRefresh,
		// handleSearchQuery,
		// handleSearchSubmit,
		// handleClearFilter,
	} = route.params;

	const [searchQuery, setSearchQuery] = useState("");

	const navigation = useNavigation();

	const handleSearchQuery = (query) => {
		setSearchQuery(query);
	};

	const handleSearchSubmit = () => {
		Keyboard.dismiss();
	};

	const handleClearFilter = () => {
		setSearchQuery("");
		console.log("clear filter");
	};

	return (
		<>
			<SearchBar
				value={searchQuery}
				onChangeText={handleSearchQuery}
				onSubmitEditing={handleSearchSubmit}
				// onPress={handleSearchSubmit}
			/>
			<ClearFilterButton onPress={handleClearFilter} />

			<FlatList
				data={eventObjs.filter((eventObj) =>
					eventObj.event_name.toLowerCase().includes(searchQuery.toLowerCase())
				)}
				renderItem={({ item }) => (
					<View>
						<Text style={styles.headerTxt} key={`${item.event_id}`}>
							{item.event_date}
						</Text>
						<Text
							onPress={() =>
								navigation.navigate("EventDetailsHost", {
									upcomingEvent: item,
									handleRefresh: handleRefresh,
									// eventView: eventView,
								})
							}
							style={styles.bodyTxt}>
							{item.event_name}
						</Text>

						<Text>
							<Text>
								Status:{" "}
								{item.attendees.length >= item.capacity
									? `Full | Waitlist: ${item.waitlist.length}`
									: (new Date(item.event_date) < new Date() && "Closed") ||
									  `Open | Spots Available: ${
											item.capacity - item.attendees.length
									  }`}
							</Text>
						</Text>
					</View>
				)}
			/>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
		paddingTop: 80,
	},
	tableHeader: {
		flexDirection: "row",
		justifyContent: "space-evenly",
		alignItems: "center",
		backgroundColor: "#37C2D0",
		borderTopEndRadius: 10,
		borderTopStartRadius: 10,
		height: 50,
	},
	tableRow: {
		flexDirection: "row",
		height: 40,
		alignItems: "center",
	},
	columnHeader: {
		// width: "20%",
		justifyContent: "space-evenly",
		alignItems: "center",
	},
	columnHeaderTxt: {
		color: "white",
		fontWeight: "bold",
	},
	columnRowTxt: {
		width: "30%",
		justifyContent: "space-evenly",
		textAlign: "left",
	},

	headerTxt: {
		fontSize: 20,
		fontWeight: "bold",
	},

	bodyTxt: {
		fontSize: 16,
		fontWeight: "regular",
	},

	listItemLayout: {
		display: "flex",
		flexDirection: "column",
	},
});

// export default memo(EventsListHost);
