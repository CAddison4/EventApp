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
      {message ? <Text style={styles.errorMessage}>{message}</Text> : null}
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
      <Button title="Sign Up" onPress={handleSubmit} style={styles.primaryButton}/>
      </View>
      <View style={styles.secondaryButtonContainer}>
      <Text style={{textAlign: 'center'}}>Already have an account?</Text>
      <Button
        title="Back to Sign In"
        onPress={() => onFormTypeChange('signIn')}
        style={styles.secondaryButton}
      />
      </View>
    </SafeAreaView>
  );
};

export default SignUpForm;

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
    alignItems: 'center',
  },

  secondaryButton: {
    width: "50%",
    fontSize: 13,
    textDecorationLine: "underline",
    color: "#888",
  },
  });

