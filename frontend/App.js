import React from 'react';
import { View, StyleSheet } from 'react-native';
import AuthForm from './src/views/AuthForm';

const App = () => {
  return (
    <View style={styles.container}>
      <AuthForm />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
