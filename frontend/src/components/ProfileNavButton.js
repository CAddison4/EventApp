import { StyleSheet, Text, View, Button } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import EventCal from "../views/users/events/EventsCal";

import * as React from "react";

export default function ProfileNavButton({ navigation }) {
	console.log("navigation: ", navigation);
	return (
		<View>
			<Ionicons name="person" size={24} color="white" />
		</View>
	);
}
