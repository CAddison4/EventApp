// Main navigation file for the app. This file contains the navigation stack for the app.

// Imports
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import * as React from "react";
import { useEffect } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider, useDispatch, useSelector } from "react-redux";
import Ionicons from "@expo/vector-icons/Ionicons";
import { CommonActions } from "@react-navigation/native";
import jwt_decode from "jwt-decode";
// View imports
import MainProfile from "../../src/views/users/profile/MainProfile";
import AuthForm from "../../src/views/AuthForm";
import EventDetails from "../../src/views/users/events/EventDetails";
import Confirmation from "../../src/views/users/events/Confirmation";
import AttendeeQRCode from "../../src/views/users/events/AttendeeQRCode";
import EventsList from "../../src/views/users/events/EventsList";
import EventsCal from "../../src/views/users/events/EventsCal";
import eventObjs from "../../src/views/users/events/Invited";
import Events from "../../src/views/users/events/Events";
import PendingMembership from "../views/users/profile/PendingMembership";
import RejectedMembership from "../views/users/profile/RejectedMembership";

import HostMenu from "../../src/views/hosts/events/HostMenu";
import CreateEvent from "../../src/views/hosts/events/CreateEvent";
import EventsHost from "../../src/views/hosts/events/EventsHost";
import EventDetailsHost from "../../src/views/hosts/events/EventDetailsHost";
import UpcomingEvents from "../../src/views/hosts/events/UpcomingEvents";
import PastEvents from "../../src/views/hosts/events/PastEvents";
import AttendeeList from "../views/hosts/events/AttendeeList";
import Attendance from "../views/hosts/events/Attendance";

import InviteList from "../../src/views/hosts/events/InviteList";
import Users from "../views/hosts/users/Users";
import UserDetails from "../views/hosts/users/UserDetails";

// Component imports
import store from "../../src/components/store/index";
import EventListItem from "../../src/components/EventListItem";
import ProfileNavButton from "../../src/components/ProfileNavButton";
import axios from "axios";
import {
  getUserData,
  removeCognitoTokens,
  amplifyRefreshTokens,
} from "../components/UserApiComponents";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Amplify imports
import { Amplify, Hub, Auth } from "aws-amplify";
import config from "../../src/aws-exports";
Amplify.configure(config);
import { handleAutoSignIn } from "../components/AuthComponents";
// Navigation stack
const Stack = createNativeStackNavigator();

const Navigation = () => {
  const [authenticated, setAuthenticated] = React.useState(false);
  const [user, setUser] = React.useState(null);
  const [userStatus, setUserStatus] = React.useState("None");
  const [userStatusLoaded, setUserStatusLoaded] = React.useState(false);
  const dispatch = useDispatch();

  const [refreshMessage, setRefreshMessage] = React.useState("");

  // const awaitAsync = AsyncStorage.getItem("accessToken");


  axios.interceptors.request.use( async (config)  => {
      let expiration = 0;
      // Do something before request is sent
      const userToken = await AsyncStorage.getItem("accessToken");
      if (userToken) {
        try {
          expiration = await jwt_decode(userToken).exp;
          //compare expiration to now If expiration is in 10 minutes or less, refresh token
          if (
            (expiration !== 0 && expiration - Date.now() / 1000 < 600) ||
            expiration - Date.now() / 1000 < 0
          ) {
            const refreshResult = amplifyRefreshTokens(); 
            if (
              refreshResult.success == false &&
              refreshResult.message == "NotAuthorizedException"
            ) {
              removeCognitoTokens();
              setRefreshMessage(
                "Your session has expired. Please log in again."
              );
              setAuthenticated(false);
            }
          }
        } catch (error) {
          console.log("ERROR", error);
        }
      }
      
      return  config;
    },
    (error) => {
      console.log("ERROR", error);
      return  Promise.reject(error);
    }
  );

  useEffect(() => {
    
    // Check if user is signed in async
    const checkAuth = async () => {
      
      try {
        const autoSignIn = await handleAutoSignIn(dispatch);
        if (autoSignIn.success == true) {
        
        const userToken = await AsyncStorage.getItem("accessToken");
        axios.defaults.headers.common["Authorization"] =
        `Bearer ${userToken}`;
        setAuthenticated(true);
          
        }
      } catch (e) {
        console.log("ERROR NAVIGATION", e);
      }
    };
    checkAuth();
    // Listen to "auth" events using Amplify Hub
    Hub.listen("auth", (data) => {
      switch (data.payload.event) {
        case "signIn":
          // Get user data from database
          try {
            const fetchData = async () => {
              const userAuth = await Auth.currentSession();
              // console.log("USER AUTH", userAuth)
              const userEmail = userAuth.idToken.payload.email;
              const userData = await getUserData(
                userEmail,
                dispatch
              );

              if (userData.success == true) {
                const userToken = await AsyncStorage.getItem("accessToken");
                axios.defaults.headers.common["Authorization"] =
                `Bearer ${userToken}`;
                setAuthenticated(true);
              }
              else{
                setAuthenticated(false);
                setRefreshMessage("Error Retrieving User Data. Please try again, Or contact support.")
              }
            };
            fetchData();
          } catch (e) {
            console.log("ERROR NAVIGATION", e);
          }
          // When user signs in, set authenticated to true
          break;
        case "signOut":
          //CLEAR ASYNC STORAGE
          removeCognitoTokens();
          // When user signs out, set authenticated to false
          setAuthenticated(false);
          break;
      }
    });
  }, []);

  const contextUser = useSelector((state) => state.user);

  useEffect(() => {
    if (contextUser) {
      setUser(contextUser);
    }
  }, [contextUser]);

  // const testUserStatus = { membership_status_id: "None" };
  // const testUserStatus = { membership_status_id: "Gold" };

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#607D8B",
            //    backgroundColor: "#f6d5a7",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerRight: () => <ProfileNavButton />,
        }}
      >
        {authenticated == false ? (
          <Stack.Screen
            name="AuthForm"
            options={{ headerRight: () => "" }}
            initialParams={{
              refreshMessage: refreshMessage !== "" ? refreshMessage : "",
            }}
          >
            {() => <AuthForm />}
          </Stack.Screen>
        ) : (
          <>
            {(user &&
              user !== null &&
              user.role_id !== "Host" &&
              user.membership_status_id === "None") ||
            user.membership_status_id === "Rejected" ? (
              <Stack.Screen
                name={
                  user.membership_status_id === "None"
                    ? "PendingMembership"
                    : "RejectedMembership"
                }
                component={
                  user.membership_status_id === "None"
                    ? PendingMembership
                    : RejectedMembership
                }
                options={{ headerRight: () => "" }}
              />
            ) : (
              <>
                {user.role_id === "Host" ? (
                  <Stack.Screen
                    name="HostMenu"
                    component={HostMenu}
                    options={{
                      title: "Event App",
                      // headerRight: () => <ProfileNavButton />,
                    }}
                  />
                ) : (
                  <Stack.Screen
                    name="Events"
                    component={Events}
                    options={{
                      title: "Event App",
                      // headerRight: () => <ProfileNavButton />,
                    }}
                  />
                )}
                {/* Attendee Screens */}
                <Stack.Screen
                  name="MainProfile"
                  component={MainProfile}
                  options={{ headerRight: () => "" }}
                />
                <Stack.Screen name="EventsList" component={EventsList} />
                <Stack.Screen name="EventsCal" component={EventsCal} />
                <Stack.Screen name="EventListItem" component={EventListItem} />
                <Stack.Screen name="EventDetails" component={EventDetails} />
                <Stack.Screen name="Confirmation" component={Confirmation} />
                <Stack.Screen
                  name="AttendeeQRCode"
                  component={AttendeeQRCode}
                />
                <Stack.Screen
                  name="ProfileNavButton"
                  component={ProfileNavButton}
                />
                {/* Host Screens */}
                <Stack.Screen name="CreateEvent" component={CreateEvent} />
                <Stack.Screen name="EventsHost" component={EventsHost} />
                <Stack.Screen
                  name="EventDetailsHost"
                  component={EventDetailsHost}
                />
                <Stack.Screen name="InviteList" component={InviteList} />
                <Stack.Screen name="Users" component={Users} />
                <Stack.Screen name="UserDetails" component={UserDetails} />
                <Stack.Screen name="AttendeeList" component={AttendeeList} />
                <Stack.Screen name="Attendance" component={Attendance} />
              </>
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
