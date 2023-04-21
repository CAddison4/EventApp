import { StyleSheet, Text, View, Button } from "react-native";

//Upcoming is Tier & Loyalty Events

export default function Upcoming() {
	return (
		<View style={styles.container}>
			<Text>Upcoming Screen</Text>
		</View>
	);
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
});
