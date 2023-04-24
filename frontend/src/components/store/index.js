import { configureStore, applyMiddleware } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import userSliceReducer from "./userSlice";


const middleware = [thunk];

const store = configureStore({
  reducer: {
    user: userSliceReducer,
  },
  middleware: middleware,
});

export default store;
