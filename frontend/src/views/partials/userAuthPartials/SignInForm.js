import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  Button,
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { handleSignIn } from "../../../components/AuthComponents";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";

const SignInForm = ({ route }) => {
  
  const { initialUsername, initialMessage } = route?.params ?? {};

  const [password, setPassword] = useState("");
  
  const [username, setUsername] = useState(initialUsername ?? "");
  const [formMessage, setFormMessage] = useState(initialMessage ?? "");

  // const { initialUsername, initialMessage } = route.params;
  
  const dispatch = useDispatch();
  
  // const [password, setPassword] = useState("");

  // const [username, setUsername] = useState(initialUsername ? initialUsername : "");
  // const [formMessage, setFormMessage] = useState(initialMessage ? initialMessage : "");

  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (!username || !password) {
      setFormMessage("Please enter a username and password");
      return;
    }
    try {
      const { success, message } = await handleSignIn(username, password, dispatch);
      if (success === false) {
      setFormMessage(message);
      }
    } catch (error) {
      console.log("Error signing in:", error);
      setFormMessage("Error signing in. Please try again.");
    }
  };

  const handleAttendeeSignIn = async () => {
    try {
      const attendeeUserName = "scott.c19@live.com";
      const attendeePassword = "td3j5FnhiLHRa$KA";
      await handleSignIn(attendeeUserName, attendeePassword, dispatch);
    } catch (error) {
      console.log("Error signing in:", error);
    }
  };
  const handleHostSignIn = async () => {
    try {
      const hostUserName = "scroin@my.bcit.ca";
      const hostPassword = "s&PrpDLBAG94rY3$";
      await handleSignIn(hostUserName, hostPassword, dispatch);
    } catch (error) {
      console.log("Error signing in:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      enabled={true}
      onPress={Keyboard.dismiss}
    >
        <SafeAreaView>
          <View>
            <Text style={styles.title}>Sign In</Text>
            <Text style={styles.errorMessage}>
            {!!formMessage ? (
              formMessage
            ) : null}
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                defaultValue={initialUsername ? initialUsername : username}
                onChangeText={setUsername}
                placeholder="Email"
                keyboardType="email-address"
              />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry
              />
              <Text
                onPress={() =>
                  navigation.navigate("ForgotPasswordForm", {
                    initialUsername: username,
                  })
                }
                style={styles.secondaryButton}
              >
                Forgot Password{" "}
              </Text>
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title="Sign Up"
                onPress={() => navigation.navigate("SignUpForm")}
                style={styles.primaryButton}
              />
              <Button
                title="Sign In"
                onPress={handleSubmit}
                style={styles.primaryButton}
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title="Sign In as Attendee"
                onPress={handleAttendeeSignIn}
                style={styles.primaryButton}
              />
              <Button
                title="Sign In as Host"
                onPress={handleHostSignIn}
                style={styles.primaryButton}
              />
            </View>
          </View>
        </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 3,
    width: "100%",
    maxWidth: 400,

    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginVertical: 30,
  },
  inputContainer: {
    marginBottom: 40,
  },

  input: {
    width: "100%",
    height: 40,
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  primaryButton: {
    width: 150,
    fontSize: 16,
  },
  secondaryButton: {
    width: "100%",
    fontSize: 13,
    textDecorationLine: "underline",
    color: "#888",
  },
  errorMessage: {
    color: "red",
    marginBottom: 20,
  },
});

export default SignInForm;
