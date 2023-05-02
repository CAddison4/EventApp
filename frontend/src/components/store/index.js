import { configureStore, applyMiddleware } from "@reduxjs/toolkit";
import thunk from "redux-thunk";

import userSliceReducer from "./userSlice";
import eventSliceReducer from "./eventSlice";
import filtersSliceReducer from "./filtersSlice";


const middleware = [thunk];

const store = configureStore({
  reducer: {
    user: userSliceReducer,
    event: eventSliceReducer,
    filters: filtersSliceReducer,
  },
  middleware: middleware,
});

export default store;
