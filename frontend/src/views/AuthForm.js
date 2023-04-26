import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Button } from "react-native";
import SignUpForm from "./partials/userAuthPartials/SignUpForm";
import SignInForm from "./partials/userAuthPartials/SignInForm";
import ForgotPasswordForm from "./partials/userAuthPartials/ForgotPasswordForm";
import ConfirmationForm from "./partials/userAuthPartials/ConfirmationForm";
import ResetPasswordForm from "./partials/userAuthPartials/ResetPasswordForm";
import { Auth } from "aws-amplify";

const AuthForm = ( ) => {
  const [formType, setFormType] = useState('signIn');
  const [username, setUsername] = useState('');


  const handleFormTypeChange = (newFormType, username) => {
    setFormType(newFormType);
    setUsername(username);

  };

  return (
    <View style={styles.formView}>

      {formType === 'signIn' && <SignInForm onFormTypeChange={handleFormTypeChange}  />}
      {formType === 'signUp' && <SignUpForm onFormTypeChange={handleFormTypeChange}  />}
      {formType === 'confirmation' && <ConfirmationForm onFormTypeChange={handleFormTypeChange } username={username} />}
      {formType === 'forgotPassword' && <ForgotPasswordForm onFormTypeChange={handleFormTypeChange} />}
      {formType === 'resetPassword' && <ResetPasswordForm onFormTypeChange={handleFormTypeChange} username={username} />}

      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tab} onPress={() => handleFormTypeChange('confirmation', username)}>
          <Text style={[styles.tabText, formType === 'confirmation' && styles.activeTab]}>Confirmation</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => handleFormTypeChange('resetPassword', username)}>
          <Text style={[styles.tabText, formType === 'resetPassword' && styles.activeTab]}>Reset Password</Text>
        </TouchableOpacity>
      </View>


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
		justifyContent: "center",
		flexDirection: "row",
		height: 100,
		marginTop: 20,
	},
	tab: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#eee",
    width: 100,
	},
	tabText: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		fontWeight: "bold",
		height: 50,
		width: 110,
	},
	activeTab: {
		color: "blue",
	},

});

export default AuthForm;
