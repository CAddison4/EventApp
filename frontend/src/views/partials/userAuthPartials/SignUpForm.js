import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { handleSignUp } from "../../../components/AuthComponents";
import { useNavigation } from "@react-navigation/native";

const SignUpForm = ({}) => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleSubmit = async () => {
    if (
      !email ||
      !password ||
      !passwordConfirmation ||
      !firstName ||
      !lastName
    ) {
      setFormMessage("All fields are required");
      return;
    }

    if (!/^[a-zA-Z]+$/.test(firstName)) {
      setFormMessage("First name should only contain alphabetic characters");
      return;
    }
  
    if (!/^[a-zA-Z]+$/.test(lastName)) {
      setFormMessage("Last name should only contain alphabetic characters");
      return;
    }

    const { success, message } = await handleSignUp(
      email,
      password,
      passwordConfirmation,
      firstName,
      lastName
    );

    if (success === true) {
      console.log("Successfully signed up");
      // Handle successful sign-up here
      navigation.navigate("ConfirmationForm", { initialUsername: email });
    } else
     {
      console.log(`Error signing up: ${message}`);
      setFormMessage(message);
    }
      // Handle sign-up error here
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      enabled={true}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView>
        <ScrollView style={styles.scrollView}>
          <View style={styles.inner}>
            <Text style={styles.title}>Sign Up</Text>
            {formMessage ? (
              <Text style={styles.errorMessage}>{formMessage}</Text>
            ) : null}
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={(text) => setEmail(text)}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="First Name"
              value={firstName}
              onChangeText={(text) => setFirstName(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              value={lastName}
              onChangeText={(text) => setLastName(text)}
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={passwordConfirmation}
              onChangeText={(text) => setPasswordConfirmation(text)}
              secureTextEntry
            />
            <View style={styles.buttonContainer}>
              <Button
                title="Sign Up"
                onPress={handleSubmit}
                style={styles.primaryButton}
              />
            </View>
            <View style={styles.secondaryButtonContainer}>
              <Text style={{ textAlign: "center" }}>
                Already have an account?
              </Text>
              <Button
                title="Back to Sign In"
                onPress={() =>
                  navigation.navigate("SignInForm", { initialUsername: email })
                }
                style={styles.secondaryButton}
              />
            </View>
          </View>
        </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignUpForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: "space-around",
    backgroundColor: "#fff",
    width: "100%",
    maxWidth: 400,
  },
  
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginVertical: 30,
  },
  inputContainer: {
    // marginBottom: 40,
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
    justifyContent: "flex-end",
  },
  primaryButton: {
    width: 150,
    fontSize: 16,
  },
  secondaryButtonContainer: {
    marginTop: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  secondaryButton: {
    width: "50%",
    fontSize: 13,
    textDecorationLine: "underline",
    color: "#888",
  },
  errorMessage: {
    color: "red",
    marginBottom: 20,
  },
});
