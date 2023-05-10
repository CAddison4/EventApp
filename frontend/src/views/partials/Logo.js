import { Image, View, StyleSheet } from "react-native";

export const Logo = () => {
	return (
		<Image
			source={require("../../../assets/logo-no-background.png")}
			style={styles.logo}
		/>
	);
};

const styles = StyleSheet.create({
	logo: {
		width: 90,
		height: 45,
		marginTop: 10,
		marginBottom: 10,
		marginLeft: 10,
	},
});
