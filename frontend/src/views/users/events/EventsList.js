import { StyleSheet, View, FlatList, TouchableOpacity } from "react-native";

import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigation } from '@react-navigation/native';
import DropDownPicker from "react-native-dropdown-picker";

import { useDispatch, useSelector } from "react-redux";
import { setEvent } from "../../../components/store/eventSlice";

import EventListItem from "../../../components/EventListItem";

export default function EventsList({ route }) {

	const user = useSelector((state) => state.user);
	const { user_id, ...userData } = user;

	const { eventObjs, handleFilterChange, type, filterValueU, filterValueM, handleRefresh, handleSetDisplayTab } = route.params;

	const [filteredEvents, setFilteredEvents] = useState(eventObjs);

	const [filterU, setFilterU] = useState(filterValueU);
	const [filterM, setFilterM] = useState(filterValueM);
	
	const [open, setOpen] = useState(false);

	const navigation = useNavigation();

	const [filterItemsM, setFilterItemsM] = useState([
		{label: 'All', value: 'All'},
		{label: 'Registered', value: 'Registered'},
		{label: 'Waitlisted', value: 'Waitlisted'}]);
	const [filterItemsU, setFilterItemsU] = useState([
		{label: 'All', value: 'All'},
		{label: 'Eligible', value: 'Eligible'}]);

	const handleFilterSelect = (value) => {
        if (type === "upcoming") {
            setFilterU(value);
            handleFilterChange(value, type);
        } else {
            setFilterM(value);
            handleFilterChange(value, type);
        }
    };

	return (
		<View style={styles.container}>
			{type && type === "upcoming" ? (
				<View style={styles.picker}>
					<DropDownPicker 
						open={open}
						value={filterU}
						items={filterItemsU}
						setOpen={setOpen}
						setValue={(val) => {
                            handleFilterSelect(val);
                            handleSetDisplayTab("Upcoming");
                        }}
					/> 
				</View>
			) : (
				<View style={styles.picker}>
					<DropDownPicker 
						open={open}
						value={filterM}
						items={filterItemsM}
						setOpen={setOpen}
						setValue={(val) => {
                            handleFilterSelect(val);
                            handleSetDisplayTab("My Events");
                        }}
					/> 
				</View>
			)}
			<FlatList style={styles.list}
				data={filteredEvents}
				keyExtractor={(item) => `${item.event_id}${item.user_id}`}
				renderItem={({ item }) => (
					<View>
						<TouchableOpacity
							onPress={() =>
								navigation.navigate("EventDetails", {
									eventObj: item,
									userId: user_id,
									navigation: navigation,
									handleRefresh: handleRefresh,
								})
							}>
							<EventListItem
								eventObj={item}/>
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
		width: "100%",
    	maxWidth: 400,
		backgroundColor: "#fff",
		paddingLeft: 5,
		paddingRight: 5,
	},
	activityIndicator: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		height: 80
	},
	picker: {
    	alignItems: "center",
		width: 180,
		top: 10,
		height: 50,
		marginBottom: 10,
		zIndex: 2000,
	},
	list: {
		paddingTop: 10,
	},
});
