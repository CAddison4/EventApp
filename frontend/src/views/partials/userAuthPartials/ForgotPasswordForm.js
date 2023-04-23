import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { handleForgotPassword } from '../../../components/AuthComponents';

const ForgotPasswordForm = ({ onFormTypeChange }) => {
  const [username, setUsername] = useState('');
  const [codeSent, setCodeSent] = useState(false);
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
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Email"
        keyboardType="email-address"
      />
      {message ? <Text>{message}</Text> : null}
      <Button title="Reset Password" onPress={handleSubmit} />
      <Button
        title="Back to Sign In"
        onPress={() => onFormTypeChange('signIn')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   justifyContent: 'center',
  // },
  // tabBar: {
  //   flexDirection: 'row',
  //   backgroundColor: '#eee',
  //   height: 50,
  //   position: 'absolute',
  //   bottom: 0,
  //   width: '100%',
  //   borderTopWidth: 1,
  //   borderTopColor: '#ddd',
  // },
  // tab: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  // tabText: {
  //   fontWeight: 'bold',
  // },
  // activeTab: {
  //   color: 'blue',
  // },
});

export default ForgotPasswordForm;
