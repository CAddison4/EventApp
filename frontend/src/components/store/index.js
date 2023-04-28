import { configureStore, applyMiddleware } from "@reduxjs/toolkit";
import thunk from "redux-thunk";

import userSliceReducer from "./userSlice";
import eventSliceReducer from "./eventSlice";


const middleware = [thunk];

const store = configureStore({
  reducer: {
    user: userSliceReducer,
    event: eventSliceReducer,
  },
  middleware: middleware,
});

export default store;
