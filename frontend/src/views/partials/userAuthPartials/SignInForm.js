import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, Button, SafeAreaView, View } from 'react-native';
import { handleSignIn } from '../../../components/AuthComponents';

const SignInForm = ({ onFormTypeChange }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    try {
      await handleSignIn(username, password);
      onAuthChange(true);
    } catch (error) {
      console.log('Error signing in:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Email"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <Button title="Sign In" onPress={handleSubmit} />
      <View style={styles.buttonContainer}>
      <Button title="Sign Up" onPress={() => onFormTypeChange('signUp')} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Forgot Password" onPress={() => onFormTypeChange('forgotPassword')} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingHorizontal: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   input: {
//     width: '100%',
//     height: 40,
//     marginVertical: 10,
//     borderWidth: 1,
//     borderRadius: 5,
//     padding: 10,
//   },
//   buttonContainer: {
//     marginTop: 10,
//   },
});

export default SignInForm;
