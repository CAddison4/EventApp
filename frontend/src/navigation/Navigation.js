import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import * as React from "react";
import { useEffect } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Ionicons from "@expo/vector-icons/Ionicons";
import { CommonActions } from "@react-navigation/native";

import MainProfile from "../../src/views/users/profile/MainProfile";

import AuthForm from "../../src/views/AuthForm";
import EventDetails from "../../src/views/users/events/EventDetails";
import Confirmation from "../../src/views/users/events/Confirmation";
import QRCode from "../../src/views/users/events/QRCode";
import EventsList from "../../src/views/users/events/EventsList";
import EventListItem from "../../src/components/EventListItem";
import ProfileNavButton from "../../src/components/ProfileNavButton";
import EventsCal from "../../src/views/users/events/EventsCal";

import { Provider, useDispatch, useSelector } from "react-redux";

import store from "../../src/components/store/index";

import { Amplify, Hub } from "aws-amplify";
import config from "../../src/aws-exports";
Amplify.configure(config);

import eventObjs from "../../src/views/users/events/Invited";
import Events from "../../src/views/users/events/Events";
import PendingMembership from "../views/users/profile/PendingMembership";

const Stack = createNativeStackNavigator();

const Navigation = () => {
    
  const [authenticated, setAuthenticated] = React.useState(false);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    Hub.listen("auth", (data) => {
      switch (data.payload.event) {
        case "signIn":
          console.log("user", user);
          console.log("signed in", data.payload.data);
          setAuthenticated(true);
          console.log("user In Hub", user)
          break;
        case "signOut":
          console.log("signed out", data.payload.data);
          setAuthenticated(false);
          break;
      }
    });
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Events"
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
        {authenticated == false ? (
          <Stack.Screen name="AuthForm">{() => <AuthForm />}</Stack.Screen>
        ) : (
          <>
            {user && user.membership_status_id === "None" ? (
              <Stack.Screen
                name="PendingMembership"
                component={PendingMembership}
              />
            ) : (
              <>
                <Stack.Screen name="EventsList" component={EventsList} />
                <Stack.Screen name="EventsCal" component={EventsCal} />
                <Stack.Screen name="MainProfile" component={MainProfile} />
                <Stack.Screen
                  name="Events"
                  component={Events}
                  options={{
                    title: "Event App",
                    headerRight: () => <ProfileNavButton />,
                  }}
                />
                <Stack.Screen name="EventListItem" component={EventListItem} />
                <Stack.Screen name="EventDetails" component={EventDetails} />
                <Stack.Screen name="Confirmation" component={Confirmation} />
                <Stack.Screen name="QRCode" component={QRCode} />
                <Stack.Screen
                  name="ProfileNavButton"
                  component={ProfileNavButton}
                />
              </>
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Navigation;
