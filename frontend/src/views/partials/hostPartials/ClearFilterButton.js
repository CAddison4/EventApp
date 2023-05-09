import { Button, TouchableOpacity } from "react-native";
// import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
// import { TouchableOpacity } from "react-native-gesture-handler";
import Ionicons from "react-native-vector-icons/Ionicons";
export default function ClearFilterButton({
	onPress,
	color = "#000",
	icon = "filter-outline",
}) {
	return (
		<TouchableOpacity onPress={onPress}>
			<Ionicons name={icon} size={24} color={color} />
		</TouchableOpacity>
	);
}
