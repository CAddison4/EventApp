import { View, Text, Button } from "react-native";
export default function InviteList({ navigation, route }) {
	const eventId = route.params.eventId;
	return (
		<View>
			<Text>Invite List for event {eventId}</Text>
		</View>
	);
}
