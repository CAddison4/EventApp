import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  Button,
  SafeAreaView,
} from "react-native";
import { handleResetPassword } from '../../../components/AuthComponents';

const ResetPasswordForm = ({ onFormTypeChange, username }) => {
  const [usernameInput, setUsernameInput] = useState(username? username : "");  
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    try {
      await handleResetPassword(usernameInput, code, password, passwordConfirmation)

      onFormTypeChange("signIn");
    } catch (error) {
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <TextInput 
        style={styles.input}
        value={usernameInput}
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
      {message ? <Text>{message}</Text> : null}
      <Button title="Reset Password" onPress={handleSubmit} />
      <Button
        title="Back to Sign In"
        onPress={() => onFormTypeChange("signIn")}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   backgroundColor: "#fff",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   paddingHorizontal: 20,
  // },
  // title: {
  //   fontSize: 24,
  //   fontWeight: "bold",
  //   marginBottom: 20,
  // },
  // input: {
  //   width: "100%",
  //   height: 40,
  //   marginVertical: 10,
  //   borderWidth: 1,
  //   borderRadius: 5,
  //   padding: 10,
  // },
});

export default ResetPasswordForm;
