import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, Button, SafeAreaView } from 'react-native';
import { handleConfirmation } from '../../../components/AuthComponents';

const ConfirmationForm = ({ onFormTypeChange }) => {
  const [username, setUsername] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');

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
      <TextInput value={username} onChangeText={setUsername} placeholder="Email" keyboardType='email-address' style={styles.input} />
      <TextInput value={confirmationCode} onChangeText={setConfirmationCode} placeholder="Confirmation Code" style={styles.input} />
      <Button title="Confirm" onPress={handleSubmit} style={styles.button} />
      <Button title="Back to Sign In" onPress={() => onFormTypeChange('signIn')} style={styles.button} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   paddingHorizontal: 20,
  // },
  // title: {
  //   fontSize: 24,
  //   fontWeight: 'bold',
  //   marginBottom: 20,
  // },
  // input: {
  //   width: '100%',
  //   height: 40,
  //   borderWidth: 1,
  //   borderColor: 'gray',
  //   borderRadius: 5,
  //   padding: 10,
  //   marginBottom: 10,
  // },
  // button: {
  //   marginVertical: 10,
  //   width: '100%',
  // },
});

export default ConfirmationForm;
