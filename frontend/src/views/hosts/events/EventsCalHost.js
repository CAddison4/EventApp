import { Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEvent } from "../../../components/store/eventSlice";

export default function EventsCalHost({ route }) {
	const { eventObjs, handleRefresh } = route.params;

	return (
		<View>
			<Text>Events Calendar Host</Text>
			{eventObjs.map((eventObj) => {
				return <Text>{eventObj.event_name}</Text>;
			})}
		</View>
	);
}
