import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, Button, SafeAreaView, View } from 'react-native';
import { handleConfirmation } from '../../../components/AuthComponents';

const ConfirmationForm = ({ onFormTypeChange, message }) => {

  const [username, setUsername] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [formMessage, setFormMessage] = useState(message ? message : '');

  const handleSubmit = async () => {
    try {
      await handleConfirmation(username, confirmationCode);
    } catch (error) {
      console.log('Error confirming sign up:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Confirmation Code</Text>
      {formMessage ? <Text style={styles.errorMessage}>{formMessage}</Text> : null}
      <TextInput value={username} onChangeText={setUsername} placeholder="Email" keyboardType='email-address' style={styles.input} />
      <TextInput value={confirmationCode} onChangeText={setConfirmationCode} placeholder="Confirmation Code" style={styles.input} />
      <View style={styles.buttonContainer}>
      <Text
          onPress={() => onFormTypeChange("signIn")}
          style={styles.secondaryButton}
        >
          Back to Sign In
        </Text>
        <Button title="Confirm" onPress={handleSubmit} style={styles.button} />
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
  secondaryButton: {
    fontSize: 13,
    textDecorationLine: "underline",
    color: "#888",
  },
  errorMessage: {
    color: "red",
    marginBottom: 10,
  },
});

export default ConfirmationForm;
