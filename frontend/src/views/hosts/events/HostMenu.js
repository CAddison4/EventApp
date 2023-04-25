import { Text, View, Button } from "react-native";
import CreateEvent from "./CreateEvent";
export default function HostMenu({ navigation }) {
	return (
		<View>
			<Text>Host Menu</Text>
			<Button title="Events List"></Button>
			<Button
				title="Create Event"
				onPress={() => {
					navigation.navigate("CreateEvent");
				}}></Button>
			<Button title="Users List"></Button>
		</View>
	);
}
