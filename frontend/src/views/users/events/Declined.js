import { StyleSheet, Text, View, Button } from "react-native";

export default function Declined() {
	return (
		<View style={styles.container}>
			<Text>Declined Screen</Text>
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
