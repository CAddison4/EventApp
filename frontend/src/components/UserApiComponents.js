import { Auth } from "aws-amplify";
import { useDispatch } from "react-redux";
import { setUser } from "./store/userSlice";
// import { API_URL } from '@env';
import { API_END_POINT } from "@env";

export const getUserData = async (username, accessToken, dispatch) => {
  try {

    const apiEndpoint = `${API_END_POINT}user/email/${username}`;
    const apiResponse = await fetch(apiEndpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
    });
    console.log("apiResponse", apiResponse);
    if (!apiResponse.ok) {
      return {
        success: false,
        message: "Failed to retrieve user data, Check your email and try again",
      };
    }
    const apiResponseJson = await apiResponse.json();
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
    await dispatch(setUser(mergedUserData));
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
