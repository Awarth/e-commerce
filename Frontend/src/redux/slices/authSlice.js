import { createSlice } from "@reduxjs/toolkit";

const saveUserToLocalStorage = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
  if (user?.accessToken) {
    localStorage.setItem("accessToken", user.accessToken);
  }
  if (user?.refreshToken) {
    localStorage.setItem("refreshToken", user.refreshToken);
  }
};

const clearUserFromLocalStorage = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

const getUserFromLocalStorage = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

const getAccessToken = () => {
  return localStorage.getItem("accessToken") || null;
};

const getRefreshToken = () => {
  return localStorage.getItem("refreshToken") || null;
};

const initialState = {
  isAuthenticated: !!getUserFromLocalStorage(),
  user: getUserFromLocalStorage(),
  accessToken: getAccessToken(),
  refreshToken: getRefreshToken(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      saveUserToLocalStorage(action.payload);
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      clearUserFromLocalStorage();
    },
    updateAccessToken(state, action) {
      state.accessToken = action.payload;
      localStorage.setItem("accessToken", action.payload);
    },
  },
});

export const { login, logout, updateAccessToken } = authSlice.actions;
export default authSlice.reducer;
