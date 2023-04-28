import { Auth } from 'aws-amplify';
import { useDispatch } from "react-redux";
import { setUser } from "./store/userSlice";
// import { API_URL } from '@env';
import { API_END_POINT } from '@env'



export const handleSignUp = async (email, password, password_confirmation, firstName, lastName) => {
  String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();});
  };

  if (password !== password_confirmation) {
    return {
      success: false,
      message: "Passwords do not match",
    };
  }

  try {
    await Auth.signUp({
      username: email,
      password: password,
      attributes: {
        email: email,
      },
    });

    const cockroachEmail = email.toLowerCase();
    const cockroachFirstName = firstName.toProperCase()
    const cockroachLastName = lastName.toProperCase()

    const apiEndpoint = `${API_END_POINT}/user`;
    const apiResponse = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "email": cockroachEmail,
        "firstName": cockroachFirstName,
        "lastName": cockroachLastName,
        "roleId": "Attendee",
        "membershipStatusId": "None"
      })
    });
    return {
      success: true,
      message: "Successfully signed up",
    };
  } catch (error) {
    console.log('Error signing up:', error);

    let message = "Error signing up: " + error.message;

    if (error.code === "UsernameExistsException") {
      message = "This email address is already in use";
    }

    if (error.code === "InvalidPasswordException") {
      message = "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character";
    }
    return {
      success: false,
      message: message,
    };
  }
};


export const handleSignIn = async (username, password, dispatch) => {
  try {
    username = username.toLowerCase();
    const apiEndpoint = `${API_END_POINT}user/email/${username}`;
    const apiResponse = await fetch(apiEndpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!apiResponse.ok) {
      throw new Error("Failed to retrieve user data");
    }

    const apiResponseJson = await apiResponse.json();

    if (!apiResponseJson) {
      throw new Error("User data not found");
    }

    await dispatch(setUser(apiResponseJson));
    await Auth.signIn(username, password);

    return {
      success: true,
      message: "Successfully signed in",
    };

  } catch (error) {

    let message = "Error signing in: " + error.message;

    if (error.code === "UserNotFoundException") {
      message = "The email address or password you entered is incorrect. Please try again.";
    }

    return {
      success: false,
      message: message,
    };
  }
};
  
  export const handleConfirmation = async (username, code) => {
    try {
      await Auth.confirmSignUp(username, code);
      return {
        success: true,
        message: "Successfully confirmed account",
      };
    } catch (error) {
      console.log("Error confirming sign up:", error);
  
      let message = "Error confirming sign up: " + error.message;
  
      if (error.code === "CodeMismatchException") {
        message = "Confirmation code does not match";
      }
  
      if (error.code === "ExpiredCodeException") {
        message = "Confirmation code has expired. Please request a new one.";
      }
  
      if (error.code === "UserNotFoundException") {
        message = "User not found. Please check your email and try again.";
      }
  
      return {
        success: false,
        message: message,
      };
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
  
