import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "./slices/searchSlice";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";

export const store = configureStore({
  reducer: {
    search: searchReducer,
    auth: authReducer,
    cart: cartReducer,
  },
});
