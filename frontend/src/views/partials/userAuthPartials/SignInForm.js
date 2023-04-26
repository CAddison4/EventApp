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

const SignInForm = ({ onFormTypeChange }) => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    try {
      await handleSignIn(username, password, dispatch);
    } catch (error) {
      console.log("Error signing in:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
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
          // title="Forgot Password"
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
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
  },
});

export default SignInForm;
