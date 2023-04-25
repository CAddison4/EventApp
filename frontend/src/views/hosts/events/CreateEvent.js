import { View, Text, Button } from "react-native";
import InviteList from "./InviteList";
export default function CreateEvent({ navigation }) {
	const eventId = 1;
	return (
		<View>
			<Button
				title="Set Invite List"
				onPress={() =>
					navigation.navigate("InviteList", {
						eventId: eventId,
					})
				}></Button>
		</View>
	);
}
