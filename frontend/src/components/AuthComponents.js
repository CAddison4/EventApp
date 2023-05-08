<<<<<<< HEAD
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
  
=======
import { Auth } from "aws-amplify";
import { useDispatch } from "react-redux";
import { setUser } from "./store/userSlice";
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { API_URL } from '@env';
import { API_END_POINT } from "@env";
import {
  getUserData,
  generateToken,
  handleSignUpApi,
} from "./UserApiComponents";

import { Hub } from "aws-amplify";
import jwt_decode from "jwt-decode";


export const handleSignUp = async (
  email,
  password,
  password_confirmation,
  firstName,
  lastName
  ) => {
  String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
    });
  };
  if (password !== password_confirmation) {
    return {
      success: false,
      message: "Passwords do not match",
    };
  }
  try {
    const userJwtToken = await generateToken();
    const response = await fetch(`${API_END_POINT}users/email/${email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userJwtToken.token}`,
      },
    });
    console.log("RESPONSE USER LOOKUP", response);
  } catch (error) {
    console.log("ERROR", error);
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
    const cockroachFirstName = firstName.toProperCase();
    const cockroachLastName = lastName.toProperCase();

    const apiResponse = await handleSignUpApi(
      cockroachEmail,
      cockroachFirstName,
      cockroachLastName
    );
    console.log("API RESPONSE", apiResponse);

    if (!apiResponse.success) {
      return {
        success: false,
        message: apiResponse.message,
      };
    }
    return {
      success: true,
      message: "Successfully signed up",
    };
  } catch (error) {
    let message = "Error signing up: " + error.message;

    if (error.code === "UsernameExistsException") {
      message = "This email address is already in use";
    }

    if (error.code === "InvalidPasswordException") {
      message =
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character";
    }

    return {
      success: false,
      message: message,
    };
  }
};

export const handleAutoSignIn = async (dispatch) => {
  console.log("HANDLE AUTO SIGN IN")
  try {
    const accessToken = await AsyncStorage.getItem('accessToken');
    if (accessToken) {
      const decodedAccessToken = jwt_decode(accessToken);
      const currentTime = Date.now()/1000;
      
      if (decodedAccessToken.exp < currentTime) {   
           
        const newTokens = await Auth.currentSession();
        const newAccessToken = newTokens.getAccessToken().getJwtToken();
        const newIdToken = newTokens.getIdToken().getJwtToken();

        await AsyncStorage.setItem('accessToken', newAccessToken);
        await AsyncStorage.setItem('idToken', newIdToken);

        const idToken =  await AsyncStorage.getItem('idToken');
        const userData = await getUserData(jwt_decode(idToken).email, dispatch);
        return { 
          success: true ,
          message: "tokens Updated",
        };
      } else
      {
        const idToken =  await AsyncStorage.getItem('idToken');
        const userData = await getUserData(jwt_decode(idToken).email, dispatch);

        if (!userData.success) {
          return {
            success: false,
            message: userData.message,
          };
        }
        
        return {
          success: true,
          message: "Access token valid",
          userData: userData,
        };
      }
      

    }
  } catch (error) {
    console.log("ERROR", error);
    return {
      success: false,
      message: "",
    };
  }
};


export const handleSignIn = async (username, password, dispatch) => {
  try {
    username = username.toLowerCase();
    const user = await Auth.signIn(username, password);
    return {
      success: true,
      message: "",
    }
  } catch (error) {
    let message = "Error signing in: " + error.message;
    if (error.code === "UserNotFoundException") {
      message =
        "The email address or password you entered is incorrect. Please try again.";
    }
    if (error.code === "NotAuthorizedException") {
      message =
        "The email address or password you entered is incorrect. Please try again.";
    }
    if (error.code === "UserNotConfirmedException") {
      // Auth.resendSignUp(username);
      message =
        "This account has not been confirmed. Please check your email for a confirmation link.";
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
    return {
      success: true,
      message: "Forgot password request successfully sent",
    };
  } catch (error) {
    console.log("Error requesting new password:", error);
    let message = "There was an error sending the password reset request.";

    if (error.code === "UserNotFoundException") {
      message = "User not found. Please check your email and try again.";
    }
    if (error.code === "LimitExceededException") {
      message = "Attempt limit exceeded, please try again later.";
    }
    return {
      success: false,
      message: message,
    };
  }
};

export const handleResetPassword = async (
  username,
  code,
  newPassword,
  password_confirmation
) => {
  if (newPassword !== password_confirmation) {
    console.log("Passwords do not match");
    return {
      success: false,
      message: "Passwords do not match",
    };
  }
  try {
    await Auth.forgotPasswordSubmit(username, code, newPassword);
    console.log("Password reset successfully");
    return {
      success: true,
      message: "Password reset successfully",
    };
  } catch (error) {
    console.log("Error resetting password:", error);
    let message = "Error resetting password: " + error.message;

    if (error.code === "CodeMismatchException") {
      message =
        "The confirmation code you entered is incorrect. Please try again.";
    }

    if (error.code === "ExpiredCodeException") {
      message =
        "The confirmation code you entered has expired. Please request a new one.";
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

export const handleSignOut = async () => {
  //CLEAR ASYNC STORAGE
  try {
    await Auth.signOut();
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("idToken");
    await AsyncStorage.removeItem("refreshToken");
    console.log("Successfully signed out");
  } catch (error) {
    console.log("Error signing out:", error);
  }
};
>>>>>>> 7f014411315ea860cfe34ff50256e01929ab7b90
