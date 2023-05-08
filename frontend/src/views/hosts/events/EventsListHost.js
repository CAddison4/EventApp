import {
	StyleSheet,
	View,
	Text,
	Button,
	FlatList,
	Keyboard,
	ActivityIndicator,
	TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useState, useEffect, memo } from "react";
import axios from "axios";
import { API_END_POINT } from "@env";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import SearchBar from "../../partials/hostPartials/SearchBar";
import ClearFilterButton from "../../partials/hostPartials/ClearFilterButton";
import EventListItem from "../../../components/EventListItem";

// export default function EventsListHost({ route })
export default function EventsListHost({ eventObjs, handleRefresh }) {
	const [searchQuery, setSearchQuery] = useState("");
	// const { eventObjs, handleRefresh } = route.params;
	const navigation = useNavigation();

	const [selectedColor, setSelectedColor] = useState("green");

	const colors = [{ color: "green" }, { color: "orange" }];

	const handleSelectColor = (itemValue) => {
		setSelectedColor(itemValue);
	};

	const handleSearchQuery = (query) => {
		setSearchQuery(query);
	};

	const handleSearchSubmit = () => {
		Keyboard.dismiss();
	};

	const handleClearFilter = () => {
		setSearchQuery("");
	};

	//add hasRoom and capacityAvailable params to each eventObj
	const updatedEventObjs = eventObjs.map((eventObj) => {
		return {
			...eventObj,
			hasRoom: eventObj.numberOfAttendees >= eventObj.capacity ? false : true,
			capacityAvailable: eventObj.capacity - eventObj.numberOfAttendees,
			color:
				eventObj.type === "past"
					? "red"
					: eventObj.capacity - eventObj.numberOfAttendees <= 0
					? "orange"
					: "green",
		};
	});

	return (
		<View style={styles.container}>
			{eventObjs[0].type === "upcoming" && (
				<View
					style={{
						flexDirection: "row",
						gap: 20,
						justifyContent: "center",
					}}>
					{colors.map((color, index) => (
						<TouchableOpacity
							key={index}
							onPress={() => handleSelectColor(color.color)}
							style={{
								backgroundColor:
									selectedColor === color.color ? "#4CAF50" : "#fff",
								padding: 10,
								marginVertical: 5,
								borderRadius: 5,
								borderWidth: 1,
								borderColor: "#ccc",
								width: 100,
								alignItems: "center",
							}}>
							<Text
								style={{
									color: selectedColor === color.color ? "#fff" : "#000",
								}}>
								{`${color.color === "green" ? "Open" : "Full"}`}
							</Text>
						</TouchableOpacity>
					))}
				</View>
			)}
			<View
				style={{
					flexDirection: "row",
					marginVertical: 10,
					paddingHorizontal: 20,
				}}>
				<SearchBar
					value={searchQuery}
					onChangeText={handleSearchQuery}
					onSubmitEditing={handleSearchSubmit}
					// onPress={handleSearchSubmit}
				/>
				<ClearFilterButton onPress={handleClearFilter} />
			</View>

			<FlatList
				data={updatedEventObjs.filter((eventObj) =>
					eventObj.type === "upcoming"
						? eventObj.color === selectedColor &&
						  eventObj.event_name
								.toLowerCase()
								.includes(searchQuery.toLowerCase())
						: eventObj.event_name
								.toLowerCase()
								.includes(searchQuery.toLowerCase())
				)}
				renderItem={({ item }) => (
					<View>
						{console.log("event", item)}
						{/* something about this is broken - all showing full. */}
						{/* {console.log("item", item)} */}
						<TouchableOpacity
							onPress={() =>
								navigation.navigate("EventDetailsHost", {
									upcomingEvent: item,
									handleRefresh: handleRefresh,
								})
							}>
							<EventListItem eventObj={item} />
						</TouchableOpacity>
					</View>
				)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingLeft: 5,
		paddingRight: 5,
		backgroundColor: "#fff",
		width: "100%",
		maxWidth: 400,
		justifyContent: "center",
		paddingTop: 20,
	},
});

// export default memo(EventsListHost);
