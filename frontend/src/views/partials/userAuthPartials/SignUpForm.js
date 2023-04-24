import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, SafeAreaView } from 'react-native';
import { handleSignUp } from '../../../components/AuthComponents';

const SignUpForm = ({onFormTypeChange}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const [firstName , setFirstName] = useState('');
  const [lastName , setLastName] = useState('');

  const handleSubmit = () => {
    handleSignUp(email, password, passwordConfirmation, firstName, lastName);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
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
      {message ? <Text style={styles.errorMessage}>{message}</Text> : null}
      <Button title="Sign Up" onPress={handleSubmit} />
      <Button
        title="Back to Sign In"
        onPress={() => onFormTypeChange('signIn')}
      />
    </SafeAreaView>
  );
};

export default SignUpForm;

const styles = StyleSheet.create({
    // container: {
    //   flex: 1,
    //   backgroundColor: '#fff',
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
    //   marginVertical: 10,
    //   borderWidth: 1,
    //   borderRadius: 5,
    //   padding: 10,
    // },
    // errorMessage: {
    //   color: 'red',
    //   marginBottom: 10,
    // }
  });

