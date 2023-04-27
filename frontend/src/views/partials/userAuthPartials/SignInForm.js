import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  Button,
  SafeAreaView,
  View,
} from "react-native";
import { handleSignIn } from "../../../components/AuthComponents";
import { useDispatch } from "react-redux";

const SignInForm = ({ onFormTypeChange, message }) => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [formMessage, setFormMessage] = useState(message ? message : "" );

  const handleSubmit = async () => {
    try {
      const errorMessage = await handleSignIn(username, password, dispatch);
      if (errorMessage) {
        setFormMessage(errorMessage);
      }
    } catch (error) {
      console.log("Error signing in:", error);r
    }
  };

  const handleAttendeeSignIn = async () => {
    try {
      const attendeeUserName = "sholmes47@my.bcit.ca";
      const attendeePassword = "P@ssw0rd!";
      await handleSignIn(attendeeUserName, attendeePassword, dispatch);
    } catch (error) {
      console.log("Error signing in:", error);
    }
  };
  const handleHostSignIn = async () => {
    try {
      const hostUserName = "shmglade@gmail.com";
      const hostPassword = "P@ssw0rd!";
      await handleSignIn(hostUserName, hostPassword, dispatch);
    } catch (error) {
      console.log("Error signing in:", error);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>

      {formMessage ? <Text style={styles.errorMessage}>{formMessage}</Text> : null}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={username}
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
          onPress={() => onFormTypeChange("forgotPassword")}
          style={styles.secondaryButton}
        >
          Forgot Password{" "}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Sign Up"
          onPress={() => onFormTypeChange("signUp")}
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
