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
          <Stack.Screen name="AuthForm" options={{ headerRight: () => "" }}>
            {() => <AuthForm />}
          </Stack.Screen>
        ) : (
          <>
            {(user &&
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
                <Stack.Screen name="AttendeeQRCode" component={AttendeeQRCode} />
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
