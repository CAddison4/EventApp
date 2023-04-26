import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Pressable } from 'react-native';
import { handleForgotPassword } from '../../../components/AuthComponents';

const ForgotPasswordForm = ({ onFormTypeChange }) => {
  const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async () => {
        try {
          console.log(username)  
          await handleForgotPassword(username);
          onFormTypeChange('resetPassword', username);
        } catch (error) {
          console.log(error);
          setMessage(error.message);
        }
      };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      {message ? <Text>{message}</Text> : null}
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Email"
        keyboardType="email-address"
      />
      <View style={styles.buttonContainer}>
      <Pressable
        onPress={() => onFormTypeChange('signIn')}
        style={styles.secondaryButton}
      >
        <Text style={styles.secondaryButtonText}>Back to Sign In</Text>
      </Pressable>
      <Button title="Reset Password" onPress={handleSubmit} 
      style={styles.primaryButton}/>

      </View>
    </View>
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
    fontSize: 16,
    textDecorationLine: "underline",
  },
});

export default ForgotPasswordForm;
