import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import searchReducer from "./slice/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    search: searchReducer,
  },
});
