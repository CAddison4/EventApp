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

// View imports
import MainProfile from "../../src/views/users/profile/MainProfile";
import AuthForm from "../../src/views/AuthForm";
import EventDetails from "../../src/views/users/events/EventDetails";
import Confirmation from "../../src/views/users/events/Confirmation";
import QRCode from "../../src/views/users/events/QRCode";
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

import InviteList from "../../src/views/hosts/events/InviteList";
import Users from "../views/hosts/users/Users";
import UserDetails from "../views/hosts/users/UserDetails";

// Component imports
import store from "../../src/components/store/index";
import EventListItem from "../../src/components/EventListItem";
import ProfileNavButton from "../../src/components/ProfileNavButton";
import axios from "axios";
import { getUserData } from "../components/UserApiComponents";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Amplify imports
import { Amplify, Hub, Auth } from "aws-amplify";
import config from "../../src/aws-exports";
Amplify.configure(config);

// Navigation stack
const Stack = createNativeStackNavigator();

const Navigation = () => {
  const [authenticated, setAuthenticated] = React.useState(false);
  const [user, setUser] = React.useState(null);
  const [userStatus, setUserStatus] = React.useState("None");
  const [userStatusLoaded, setUserStatusLoaded] = React.useState(false);
  const dispatch = useDispatch();

  const [userRetrieved, setUserRetrieved] = React.useState(false);

  // Get user data from database
  const [loginErrorObj, setLoginErrorObj] = React.useState(null);

  useEffect(() => {
    // Listen to "auth" events using Amplify Hub
    Hub.listen("auth", (data) => {
      switch (data.payload.event) {
        case "signIn":
          // Get user data from database

          try {

            const fetchData = async () => {
              const userAuth = await Auth.currentSession();
              const userEmail = userAuth.idToken.payload.email;
              const userAccessToken = userAuth.accessToken.jwtToken;
              const userData = await getUserData(
                userEmail,
                userAccessToken,
                dispatch
              );
              if (userData.success == true){
                const userToken = await AsyncStorage.getItem("accessToken");
                console.log("USER DATA", userData);
                axios.defaults.headers.common['Authorization'] = 'Bearer ' + userToken;
                setAuthenticated(true);
                setUserRetrieved(true);
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
          // When user signs out, set authenticated to false
          setAuthenticated(false);
          break;
      }
    });
  }, []);

  const contextUser = useSelector((state) => state.user);
  
  useEffect(() => {
    console.log("USER Context", user);
    console.log("USER Context", contextUser);
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
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerRight: () => <ProfileNavButton />,
        }}
      >
        {authenticated == false && userRetrieved == false ? (
          <Stack.Screen name="AuthForm" options={{ headerRight: () => "" }}>
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
                <Stack.Screen name="QRCode" component={QRCode} />
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
              </>
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
