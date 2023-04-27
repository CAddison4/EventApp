
import * as React from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./src/components/store/index";
import Navigation from "./src/navigation/Navigation";
import { Amplify} from "aws-amplify";
import config from "./src/aws-exports";
Amplify.configure(config);


const App = () => {

  return (
    <Provider store={store}>
      <Navigation />
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
          {authenticated == true ? (
            <Stack.Screen name="AuthForm" component={AuthForm} />
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
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};


export default App;
