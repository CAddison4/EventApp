import {
	View,
	Text,
	Button,
	StyleSheet,
	ActivityIndicator,
} from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import UpcomingEvents from "./UpcomingEvents";
import PastEvents from "./PastEvents";
import { useEffect, useState } from "react";
import { getEventsWithAttendees } from "../HostComponents";

const Tab = createMaterialTopTabNavigator();

export default function EventsHost({ navigation }) {
	const [refresh, setRefresh] = useState(false);
	const [loading, setLoading] = useState(true);
	const [eventObjs, setEventObjs] = useState([]);
	const [pastEvents, setPastEvents] = useState([]);
	const [upcomingEvents, setUpcomingEvents] = useState([]);

	useEffect(() => {
		const getData = async () => {
			const eventsWithAttendees = await getEventsWithAttendees();

			const eventData = eventsWithAttendees.sort(
				(a, b) => new Date(a.event_date) - new Date(b.event_date)
			);

			setEventObjs(eventData);
			setLoading(false);
			setRefresh(false);
		};
		getData();
	}, [refresh]);

	useEffect(() => {
		filterEvents();
	}, [eventObjs]);

	const filterEvents = () => {
		setPastEvents(
			eventObjs.filter((eventObj) => {
				return eventObj.type === "past";
			})
		);
		setUpcomingEvents(
			eventObjs.filter((eventObj) => {
				return eventObj.type === "upcoming";
			})
		);
	};

	const handleRefresh = () => {
		setRefresh(true);
		setLoading(true);
		setEventObjs([]);
		setPastEvents([]);
		setUpcomingEvents([]);
	};

	return (
		<>
			{loading ? (
				<View style={styles.container}>
					<ActivityIndicator
						size="large"
						color="#0000ff"
						animating={true}
						style={styles.activityIndicator}
					/>
				</View>
			) : (
				<Tab.Navigator
					initialRouteName="Upcoming"
					screenOptions={({ route }) => ({
						tabBarActiveTintColor: "tomato",
						tabBarInactiveTintColor: "gray",
						headerShown: false,
					})}
					style={{ flex: 1 }}>
					<Tab.Screen
						name="Upcoming"
						component={UpcomingEvents}
						initialParams={{
							eventObjs: upcomingEvents,
							handleRefresh: handleRefresh,
						}}
					/>
					<Tab.Screen
						name="Past"
						component={PastEvents}
						initialParams={{
							eventObjs: pastEvents,
							handleRefresh: handleRefresh,
						}}
					/>
				</Tab.Navigator>
			)}
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
