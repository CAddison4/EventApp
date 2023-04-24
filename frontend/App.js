import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import * as React from "react";
import { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Ionicons from "@expo/vector-icons/Ionicons";
import { CommonActions } from '@react-navigation/native';

import eventObjs from "./src/views/users/events/Invited";
import Events from "./src/views/users/events/Events";
import { requireAuth } from "./src/components/middleware/AuthMiddleware";
import AuthForm from "./src/views/AuthForm";
import EventDetails from "./src/views/users/events/EventDetails";
import Confirmation from "./src/views/users/events/Confirmation";
import QRCode from "./src/views/users/events/QRCode";
import EventsList from "./src/views/users/events/EventsList";
import EventListItem from "./src/components/EventListItem";
import MainProfile from "./src/views/users/profile/MainProfile";

import { Provider, useDispatch } from "react-redux";

import store  from "./src/components/store/index";

import { Amplify, Hub } from "aws-amplify";
import config from "./src/aws-exports";
Amplify.configure(config);

const Stack = createNativeStackNavigator();

const App = () => {

  const [authenticated, setAuthenticated] = React.useState(false);

  useEffect(() => {
    Hub.listen("auth", (data) => {
      switch (data.payload.event) {
        case "signIn":
          console.log("signed in", data.payload.data);
          setAuthenticated(true);
          break;
        case "signOut":
          console.log("signed out", data.payload.data);
          setAuthenticated(false);
          break;
      }
    });
  }, []);


  return (
    <Provider store={store}>
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="MainProfile"
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
          <Stack.Screen name="AuthForm" component={AuthForm} 
          options=
          {
            {
              title: "Event App"
            }
          }/>
        ) : (
          <>
            <Stack.Screen name="EventsList" component={EventsList} />
            <Stack.Screen
              name="Events"
              component={Events}
              options={{
                title: "Event App",
				headerRight: () => (
					<Button
					onPress={() => {
					  navigation.navigate('MainProfile');
					}}
					title="Info"
					color="#fff"
				  />
                ),
              }}
            />
            <Stack.Screen name="EventListItem" component={EventListItem} />
            <Stack.Screen name="EventDetails" component={EventDetails} />
            <Stack.Screen name="Confirmation" component={Confirmation} />
            <Stack.Screen name="QRCode" component={QRCode} />
			<Stack.Screen name="MainProfile" component={MainProfile} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
    </Provider>
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

export default App;
