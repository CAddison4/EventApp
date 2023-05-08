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
 
      const { success, message } = await handleForgotPassword(username);
      if (success === false) {
        console.log("Error sending reset password email:", message);
        setMessage(message);
        return;
      }
      navigation.navigate("ResetPasswordForm", { initialUsername: username });  
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
          <Text style={styles.title}>Forgot Password</Text>
          {message ? <Text style={styles.errorMessage}>{message}</Text> : null}
          <TextInput
            style={styles.input}
            defaultValue={initialUsername ? initialUsername : ""}
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
              title="Send Reset Code"
              onPress={handleSubmit}
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
    alignItems: "center",
  },
  primaryButton: {
    width: 150,
    fontSize: 16,
  },
  secondaryButtonText: {
    width: "100%",
    fontSize: 13,
    textDecorationLine: "underline",
    color: "#888",
    alignSelf: "center",
  },
  errorMessage: {
    color: "red",
    marginBottom: 20,
  },
  
});

export default ForgotPasswordForm;
