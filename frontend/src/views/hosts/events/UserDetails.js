import { View, Text, Button } from "react-native";
export default function UserDetails({ navigation, route }) {
	const userId = route.params.user.user_id;
	return (
		<View>
			<Text>User Details for user {userId}</Text>
		</View>
	);
}
