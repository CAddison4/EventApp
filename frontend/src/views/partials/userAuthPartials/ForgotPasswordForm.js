import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { handleForgotPassword } from "../../../components/AuthComponents";
import { useNavigation } from "@react-navigation/native";

const ForgotPasswordForm = ({ route }) => {
  const { initialUsername } = route.params;
  const navigation = useNavigation();
  const [username, setUsername] = useState(
    initialUsername ? initialUsername : ""
  );
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    try {
      await handleForgotPassword(username);
      navigation.navigate("ResetPasswordForm", { initialUsername: username });
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={styles.container}
    enabled={true}
  >
        <SafeAreaView>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

    <View >
      <Text style={styles.title}>Forgot Password</Text>
      {message ? <Text>{message}</Text> : null}
      <TextInput
        style={styles.input}
        value={initialUsername ? initialUsername : username}
        onChangeText={setUsername}
        placeholder="Email"
        keyboardType="email-address"
      />
      <View style={styles.buttonContainer}>
        <Pressable
          onPress={() => navigation.navigate("SignInForm")}
          style={styles.secondaryButton}
        >
          <Text style={styles.secondaryButtonText}>Back to Sign In</Text>
        </Pressable>
        <Button
          title="Reset Password"
          onPress={handleSubmit}
          style={styles.primaryButton}
        />
      </View>
    </View>
   
    </TouchableWithoutFeedback>
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
  secondaryButtonText: {
    alignSelf: "center",
    fontSize: 13,
    textDecorationLine: "underline",
    color: "#888",
  },
});

export default ForgotPasswordForm;
