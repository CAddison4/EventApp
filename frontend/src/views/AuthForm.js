import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Button } from "react-native";
import SignUpForm from "./partials/userAuthPartials/SignUpForm";
import SignInForm from "./partials/userAuthPartials/SignInForm";
import ForgotPasswordForm from "./partials/userAuthPartials/ForgotPasswordForm";
import ConfirmationForm from "./partials/userAuthPartials/ConfirmationForm";
import ResetPasswordForm from "./partials/userAuthPartials/ResetPasswordForm";
import { HideWithKeyboard } from "react-native-hide-with-keyboard";
import { SafeAreaView } from "react-navigation";

const AuthForm = () => {
  const [formType, setFormType] = useState("signIn");
  const [username, setUsername] = useState("");

  const handleFormTypeChange = (newFormType, username) => {
    setFormType(newFormType);
    setUsername(username);
  };

  return (
    <View style={styles.formView}>
      {formType === "signIn" && (
        <SignInForm onFormTypeChange={handleFormTypeChange} />
      )}
      {formType === "signUp" && (
        <SignUpForm onFormTypeChange={handleFormTypeChange} />
      )}
      {formType === "confirmation" && (
        <ConfirmationForm
          onFormTypeChange={handleFormTypeChange}
          username={username}
        />
      )}
      {formType === "forgotPassword" && (
        <ForgotPasswordForm onFormTypeChange={handleFormTypeChange} />
      )}
      {formType === "resetPassword" && (
        <ResetPasswordForm
          onFormTypeChange={handleFormTypeChange}
          username={username}
        />
      )}

      <HideWithKeyboard style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => handleFormTypeChange("confirmation", username)}
        >
          <Text
            style={[
              styles.tabText,
              formType === "confirmation" && styles.activeTabText,
            ]}
          >
            Confirmation
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, formType === "resetPassword" && styles.activeTab]}
          onPress={() => handleFormTypeChange("resetPassword", username)}
        >
          <Text
            style={[
              styles.tabText,
              formType === "resetPassword" && styles.activeTabText,
            ]}
          >
            Reset Password
          </Text>
        </TouchableOpacity>
      </HideWithKeyboard>
    </View>
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
