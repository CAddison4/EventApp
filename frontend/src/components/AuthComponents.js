import { Auth } from 'aws-amplify';

export const handleSignUp = async (email, password) => {
    try {
      await Auth.signUp({
        username: email,
        password: password,
        attributes: {
          email: email,
        },
      });
      console.log('Successfully signed up');
    } catch (error) {
      console.log('Error signing up:', error);
    }
  };

export const handleSignIn = async (username, password) => {
    try {
      await Auth.signIn(username, password);
      console.log('Successfully signed in');
    } catch (error) {
      console.log('Error signing in:', error);
    }
  };
  
  export const handleConfirmation = async (username, confirmationCode) => {
    try {
      await Auth.confirmSignUp(username, confirmationCode);
      console.log('Successfully confirmed sign up');
    } catch (error) {
      console.log('Error confirming sign up:', error);
    }
  };
  
  export const handleForgotPassword = async (username) => {
    try {
      await Auth.forgotPassword(username);
      console.log('Forgot password request successfully sent');
    } catch (error) {
      console.log('Error sending forgot password request:', error);
    }
  };
  
  export const handleSignOut = async () => {
    try {
      await Auth.signOut();
      console.log('Successfully signed out');
    } catch (error) {
      console.log('Error signing out:', error);
    }
  };
  