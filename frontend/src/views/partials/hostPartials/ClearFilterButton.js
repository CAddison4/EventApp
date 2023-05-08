import { Button } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Ionicons from "react-native-vector-icons/Ionicons";
export default function ClearFilterButton({ onPress, color = "#000" }) {
	return (
		<TouchableOpacity onPress={onPress}>
			<Ionicons name={"refresh-outline"} size={24} color={color} />
		</TouchableOpacity>
	);
}
