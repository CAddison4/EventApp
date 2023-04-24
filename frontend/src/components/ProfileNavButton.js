import { StyleSheet, Text, View, Button } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import EventsCal from "../views/users/events/EventsCal";
import { useNavigation } from "@react-navigation/native";
import MainProfile from "../views/users/profile/MainProfile";

import * as React from "react";

export default function ProfileNavButton() {
	const navigation = useNavigation();
	console.log("navigation: ", navigation);
	return (
		<View>
			<Ionicons
				name="person"
				size={24}
				color="white"
				onPress={() => navigation.navigate("MainProfile")}
			/>
		</View>
	);
}
