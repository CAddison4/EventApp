import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { handleForgotPassword } from '../../../components/AuthComponents';

const ForgotPasswordForm = ({ onFormTypeChange }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = async () => {
    try {
      await handleForgotPassword(username);
      onFormTypeChange('signIn');
    } catch (error) {
      console.log('Error sending forgot password request:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <TextInput style={styles.input} value={username} onChangeText={setUsername} placeholder="Email" keyboardType='email-address'  />
      <Button title="Reset Password" onPress={handleSubmit} />
      <Button title="Back to Sign In" onPress={() => onFormTypeChange('signIn')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: '100%',
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
  },
});

export default ForgotPasswordForm;
