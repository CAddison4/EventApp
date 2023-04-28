import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Button } from "react-native";
import SignUpForm from "./partials/userAuthPartials/SignUpForm";
import SignInForm from "./partials/userAuthPartials/SignInForm";
import ForgotPasswordForm from "./partials/userAuthPartials/ForgotPasswordForm";
import ConfirmationForm from "./partials/userAuthPartials/ConfirmationForm";
import ResetPasswordForm from "./partials/userAuthPartials/ResetPasswordForm";
import { HideWithKeyboard } from "react-native-hide-with-keyboard";
import { SafeAreaView } from "react-navigation";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

const AuthForm = ({}) => {
	const [formType, setFormType] = useState("signIn");
	const [username, setUsername] = useState("");

	const navigation = useNavigation();

	const Stack = createNativeStackNavigator();

	const handleFormTypeChange = (username) => {
		setUsername(username);
	};

	return (
		<>
			<Stack.Navigator>
				<Stack.Screen
					name="SignInForm"
					component={SignInForm}
					options={{
						headerShown: false,
					}}
					initialParams={{ initialUsername: "", initialMessage: "" }}
				/>
				<Stack.Screen
					name="SignUpForm"
					component={SignUpForm}
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name="ForgotPasswordForm"
					component={ForgotPasswordForm}
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name="ConfirmationForm"
					component={ConfirmationForm}
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name="ResetPasswordForm"
					component={ResetPasswordForm}
					options={{ headerShown: false }}
				/>
			</Stack.Navigator>
			<HideWithKeyboard style={styles.tabBar}>
				<TouchableOpacity
					style={styles.tab}
					onPress={() =>
						navigation.navigate("ConfirmationForm", {
							initialUsername: username,
						})
					}>
					<Text
						style={[
							styles.tabText,
							formType === "confirmation" && styles.activeTabText,
						]}>
						Confirmation
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[
						styles.tab,
						formType === "ResetPasswordForm" && styles.activeTab,
					]}
					onPress={() =>
						navigation.navigate("ResetPasswordForm", {
							initialUsername: username,
						})
					}>
					<Text
						style={[
							styles.tabText,
							formType === "resetPassword" && styles.activeTabText,
						]}>
						Reset Password
					</Text>
				</TouchableOpacity>
			</HideWithKeyboard>
		</>
	);
};

const styles = StyleSheet.create({
	formView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#fff",
	},

	tabBar: {
		flex: 1,
		position: "absolute",
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: "center",
		flexDirection: "row",
		height: 60,
		marginTop: 20,
	},
	tab: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "center",
		backgroundColor: "#eee",
		width: 100,
	},
	tabText: {
		display: "flex",
		alignSelf: "center",
		justifyContent: "center",
		fontWeight: "bold",
	},
	activeTab: {
		backgroundColor: "#fff",
	},
	activeTabText: {
		color: "blue",
	},
});

export default AuthForm;
