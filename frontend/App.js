
import * as React from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./src/components/store/index";
import Navigation from "./src/navigation/Navigation";
import { Amplify} from "aws-amplify";
import config from "./src/aws-exports";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";


//Configuring Amplify
Amplify.configure(config);



const App = () => {

  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
};


export default App;
