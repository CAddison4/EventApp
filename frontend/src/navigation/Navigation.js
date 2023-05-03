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

import { getUserData } from "../components/UserApiComponents";

// Amplify imports
import { Amplify, Hub } from "aws-amplify";
import config from "../../src/aws-exports";
Amplify.configure(config);

// Navigation stack
const Stack = createNativeStackNavigator();

const Navigation = () => {
  const [authenticated, setAuthenticated] = React.useState(false);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    // Listen to "auth" events using Amplify Hub
    Hub.listen("auth", (data) => {
      switch (data.payload.event) {
        case "signIn":

          // When user signs in, set authenticated to true
          setAuthenticated(true);
          break;
        case "signOut":
          // When user signs out, set authenticated to false
          setAuthenticated(false);
          break;
      }
    });
  }, []);

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
        {authenticated == false ? (
          <Stack.Screen name="AuthForm" options={{ headerRight: () => "" }}>
            {() => <AuthForm />}
          </Stack.Screen>
        ) : (
          <>
          <Stack.Screen name="AuthForm" options={{ headerRight: () => "" }}>
            {() => <AuthForm />}
          </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
