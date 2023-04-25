import { Text, View, Button } from "react-native";
import CreateEvent from "./CreateEvent";
import Users from "./Users";
import EventsHost from "./EventsHost";
export default function HostMenu({ navigation }) {
	return (
		<View>
			<Text>Host Menu</Text>
			<Button
				title="Events List"
				onPress={() => {
					navigation.navigate("EventsHost");
				}}></Button>
			<Button
				title="Create Event"
				onPress={() => {
					navigation.navigate("CreateEvent");
				}}></Button>
			<Button
				title="Users List"
				onPress={() => {
					navigation.navigate("Users");
				}}></Button>
		</View>
	);
}
