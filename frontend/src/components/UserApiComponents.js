import { Auth } from "aws-amplify";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./store/userSlice";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_END_POINT } from "@env";

export const removeCognitoTokens = async () => {
  try {
    await AsyncStorage.removeItem("refreshToken");
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("idToken");
  } catch (error) {
    console.log("Error removing cognito tokens", error);
  }
};

export const amplifyRefreshTokens = async () => {
  try {
    const userAuth = Auth.currentSession();
    const refreshToken = await userAuth.getRefreshToken().getToken();
    const accessToken = await userAuth.getAccessToken().getJwtToken();
    const idToken = await userAuth.getIdToken().getJwtToken();

    AsyncStorage.setItem("refreshToken", refreshToken);
    AsyncStorage.setItem("accessToken", accessToken);
    AsyncStorage.setItem("idToken", idToken);

    return {
      success: true,
      message: "Successfully refreshed tokens",
    };
  } catch (error) {
    if(error.code === "NotAuthorizedException") {
      return{
        success: false,
        message: "NotAuthorizedException"
      }
    }
    return {
      success: false,
      message: "Error refreshing tokens",
    };
  }
};



export const getCognitoTokens = async () => {
  try {
    const session = await Auth.currentSession();
    const refreshToken = await session.getRefreshToken().getToken();
    const accessToken = await session.getAccessToken().getJwtToken();
    const idToken = await session.getIdToken().getJwtToken();

    // console.log("refreshToken", refreshToken);
    console.log("accessToken", accessToken);
    // console.log("idToken", idToken);

    //ASYNC STORAGE
    AsyncStorage.setItem("refreshToken", refreshToken);
    AsyncStorage.setItem("accessToken", accessToken);
    AsyncStorage.setItem("idToken", idToken);

    const testApiEndpoint = await fetch(`${API_END_POINT}loyalty/0e019b95-65a3-4740-acbc-5b433f99d5ea`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        },
        });
    const testApiEndpointJson = await testApiEndpoint.json();
    console.log("TEST API ENDPOINT JSON", testApiEndpointJson);

    const test = await AsyncStorage.getItem("refreshToken");
    console.log("test", test);

    return {
      success: true,
      message: "Successfully stored tokens",
    };
  } catch (error) {
    return {
      success: false,
      message: "Error retrieving tokens",
    };
  }
};



export const getUserData = async (username, accessToken, dispatch) => {
  console.log("ACCESS TOKEN", accessToken);
  try {
    const apiEndpoint = `${API_END_POINT}user/email/${username}`;

    const apiResponse = await fetch(apiEndpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!apiResponse.ok) {
      return {
        success: false,
        message: "Failed to retrieve user data, Check your email and try again",
      };
    }

    const apiResponseJson = await apiResponse.json();
    console.log("API Response", apiResponseJson)

    const loyalty = await fetch(
      `${API_END_POINT}loyalty/${apiResponseJson.user_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const loyaltyJson = await loyalty.json();

    const mergedUserData = {
      ...apiResponseJson,
      ...loyaltyJson,
    };

    dispatch(setUser(mergedUserData));

    const tokens = await getCognitoTokens();
    console.log("TOKENS", tokens);

    return {
      success: true,
      message: "Successfully signed in",
    };
  } catch (error) {
    let message = "Error signing in: " + error.message;
    return {
      success: false,
      message: message,
    };
  }
};
