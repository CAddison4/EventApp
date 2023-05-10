import * as React from "react";
import { useState, useEffect } from "react";
import {
	StyleSheet,
	Text,
	View,
	Button,
	FlatList,
	TouchableOpacity,
} from "react-native";
import { formatDate, formatDateTime } from "../../../utilities/dates";
import UsersListItem from "../../../components/UsersListItem";
import axios from "axios";
import { API_END_POINT } from "@env";

//this page could possibly be removed...
export default function EventWaitlist({ navigation, route }) {
	const [waitlist, setWaitlist] = React.useState([]);
	const eventObj = route.params.eventObj;
	const eventName = eventObj.event_name;
	const eventWaitlist = eventObj.waitlist;

	const getData = async () => {
		const apiURL = API_END_POINT;
		try {
			const response = await axios.get(
				`${apiURL}waitlist/users/${eventObj.event_id}`
			);
			const data = response.data;
			setWaitlist(
				data.sort((a, b) => {
					const dateA = new Date(a.date_signed_up);
					const dateB = new Date(b.date_signed_up);

					if (dateA.getTime() < dateB.getTime()) {
						return -1;
					} else if (dateA.getTime() > dateB.getTime()) {
						return 1;
					} else {
						// If the dates are equal, compare by time
						const timeA = dateA.getTime();
						const timeB = dateB.getTime();

						if (timeA < timeB) {
							return -1;
						} else if (timeA > timeB) {
							return 1;
						} else {
							return 0;
						}
					}
				})
			);
		} catch (error) {
			setWaitlist([]);
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			await getData();
		};
		fetchData();
	}, []);

	// const event = JSON.parse(eventObj);
	return (
		<View style={styles.container}>
			<Text style={styles.title}>{eventName}</Text>
			<FlatList
				data={waitlist}
				keyExtractor={(item) => `${item.event_id}${item.user_id}`}
				renderItem={({ item }) => (
					<View>
						{/* <TouchableOpacity
							onPress={() =>
								navigation.navigate("UserDetails", {
									eventObj: item.user_id,
								})
							}
							style={{ paddingTop: 20 }}></TouchableOpacity> */}
						<UsersListItem userObj={item} />
						{/* <Text
							onPress={() =>
								navigation.navigate("UserDetails", { user: item })
							}>
							{item.first_name} {item.last_name} - {item.email}
						</Text> */}
					</View>
				)}
			/>
		</View>
	);
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
		paddingTop: 20,
		paddingBottom: 20,
	},
});
