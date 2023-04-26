import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  Button,
  SafeAreaView,
  View,
} from "react-native";
import { handleResetPassword } from '../../../components/AuthComponents';

const ResetPasswordForm = ({ onFormTypeChange, username, message }) => {
  const [usernameInput, setUsernameInput] = useState(username? username : "");  
  console.log(usernameInput)
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [formMessage, setFormMessage] = useState(message ? message : "");

  const handleSubmit = async () => {
    try {
      const handleError = await handleResetPassword(usernameInput, code, password, passwordConfirmation)
      if (handleError == "SUCCESS") {
        onFormTypeChange("signIn");
        return
      }
      setFormMessage(handleError);
    }
    catch (error) {
      console.log("Error signing in:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      {formMessage ? <Text style={styles.errorMessage}>{formMessage}</Text> : null}
      <TextInput 
        style={styles.input}
        value={username? username : usernameInput}
        onChangeText={setUsernameInput}
        placeholder="Email"
        keyboardType="email-address"
        />
      <TextInput
        style={styles.input}
        value={code}
        onChangeText={setCode}
        placeholder="Verification Code"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="New Password"
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        value={passwordConfirmation}
        onChangeText={setPasswordConfirmation}
        placeholder="Confirm Password"
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
      <Text
          onPress={() => onFormTypeChange("signIn")}
          style={styles.secondaryButton}
        >
          Back to Sign In
        </Text>
      <Button title="Reset Password" onPress={handleSubmit} />
      </View>

    </SafeAreaView>
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
    marginTop: 20,
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
    alignSelf: "center",
    fontSize: 13,
    textDecorationLine: "underline",
    color: "#888",
  },
  errorMessage: {
    color: "red",
    marginBottom: 10,
  },
  
});

export default ResetPasswordForm;
