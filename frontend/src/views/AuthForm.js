import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import SignUpForm from './partials/userAuthPartials/SignUpForm';
import SignInForm from './partials/userAuthPartials/SignInForm';
import ForgotPasswordForm from './partials/userAuthPartials/ForgotPasswordForm';
import ConfirmationForm from './partials/userAuthPartials/ConfirmationForm';

const AuthForm = () => {
  const [formType, setFormType] = useState('signIn');

  const handleFormTypeChange = (newFormType) => {
    setFormType(newFormType);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tab} onPress={() => handleFormTypeChange('signIn')}>
          <Text style={[styles.tabText, formType === 'signIn' && styles.activeTab]}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => handleFormTypeChange('signUp')}>
          <Text style={[styles.tabText, formType === 'signUp' && styles.activeTab]}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => handleFormTypeChange('forgotPassword')}>
          <Text style={[styles.tabText, formType === 'forgotPassword' && styles.activeTab]}>Forgot Password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => handleFormTypeChange('confirmation')}>
          <Text style={[styles.tabText, formType === 'confirmation' && styles.activeTab]}>Confirmation</Text>
        </TouchableOpacity>
      </View>
      {formType === 'signIn' && <SignInForm onFormTypeChange={handleFormTypeChange} />}
      {formType === 'signUp' && <SignUpForm onFormTypeChange={handleFormTypeChange} />}
      {formType === 'forgotPassword' && <ForgotPasswordForm onFormTypeChange={handleFormTypeChange} />}
      {formType === 'confirmation' && <ConfirmationForm onFormTypeChange={handleFormTypeChange} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#eee',
    width: '100%',
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontWeight: 'bold',
  },
  activeTab: {
    color: 'blue',
  },
});

export default AuthForm;
