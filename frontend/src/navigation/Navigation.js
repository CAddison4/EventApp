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


import HostMenu from "../../src/views/hosts/events/HostMenu";
import CreateEvent from "../../src/views/hosts/events/CreateEvent";
import EventsHost from "../../src/views/hosts/events/EventsHost";
import EventDetailsHost from "../../src/views/hosts/events/EventDetailsHost";
import UpcomingEventsHost from "../../src/views/hosts/events/UpcomingEvents";
import PastEventsHost from "../../src/views/hosts/events/PastEvents";

import InviteList from "../../src/views/hosts/events/InviteList";
import Users from "../../src/views/hosts/events/Users";
import UserDetails from "../../src/views/hosts/events/UserDetails";

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

const testUserRole = { role_id: "Host" };
// const testUserRole = { role_id: "Attendee" };

//   const testUserStatus = { membership_status_id: "None" };
  const testUserStatus = { membership_status_id: "Gold" };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={testUserRole.role_id == "Host" ? "HostMenu" : "Events"}
        screenOptions={{
          headerStyle: {
            backgroundColor: "#607D8B",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        {authenticated == true ? (
          <Stack.Screen name="AuthForm">{() => <AuthForm />}</Stack.Screen>
        ) : (
          <>
            {user && testUserStatus.membership_status_id === "None" ? (
              <Stack.Screen
                name="PendingMembership"
                component={PendingMembership}
              />
            ) : (
              <>
                <Stack.Screen name="MainProfile" component={MainProfile} />
                <Stack.Screen
                  name="Events"
                  component={Events}
                  options={{
                    title: "Event App",
                    headerRight: () => <ProfileNavButton />,
                  }}
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

                <Stack.Screen name="HostMenu" component={HostMenu} />
                <Stack.Screen name="CreateEvent" component={CreateEvent} />
                <Stack.Screen name="EventsHost" component={EventsHost} />
                <Stack.Screen
                  name="EventDetailsHost"
                  component={EventDetailsHost}
                />
                {/* <Stack.Screen
								name="UpcomingEventsHost"
								component={UpcomingEventsHost}
							/>
							<Stack.Screen name="PastEventsHost" component={PastEventsHost} /> */}

                <Stack.Screen name="InviteList" component={InviteList} />
                <Stack.Screen name="Users" component={Users} />
                <Stack.Screen name="UserDetails" component={UserDetails} />
              </>
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
