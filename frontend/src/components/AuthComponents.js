import { Auth } from 'aws-amplify';
import { useDispatch } from "react-redux";
import { setUser } from "./store/userSlice";
// import { API_URL } from '@env';
import { API_END_POINT } from '@env'

export const handleSignUp = async (email, password, password_confirmation, firstName, lastName) => {

    if(password === password_confirmation) {
        try {
            await Auth.signUp({
              username: email,
              password: password,
              attributes: {
                email: email,
              },
            });
            const apiEndpoint =  `${API_END_POINT}/user`;
            const apiResponse = await fetch(apiEndpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                "email": email,
                "firstName": firstName,
                "lastName": lastName,
                "roleId": "Attendee",
                "membershipStatusId": "None"
              })
            });
            console.log('API response:', apiResponse);
            console.log('Successfully signed up');
          } catch (error) {
            console.log('Error signing up:', error);
          }
    }
  };



export const handleSignIn = async (username, password, dispatch) => {
    try {
      const apiEndpoint = `${API_END_POINT}/${username}`;
      const apiResponse = await fetch(apiEndpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const apiResponseJson = await apiResponse.json();
      dispatch(setUser(apiResponseJson));
      console.log('API response:', apiResponseJson);
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
      throw new Error('There was an error sending the password reset request.');
    }
  };

  export const handleResetPassword = async (username, code, newPassword, password_confirmation) => {
    if(newPassword !== password_confirmation) {
      console.log('Passwords do not match');
        return 'Passwords do not match';
    }
    try {
      await Auth.forgotPasswordSubmit(username, code, newPassword);
      console.log('Password reset successfully');
      return 'Password reset successfully';
    } catch (error) {
      console.log('Error resetting password:', error);
      return 'Error resetting password: ' + error.message;
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
  