import axios from "axios";
import { store } from "../redux/store";
import { updateAccessToken, logout } from "../redux/slice/authSlice";
import { baseURL } from "../constant";

const api = axios.create({
  baseURL,
});

api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const state = store.getState();
    const refreshToken = state.auth.refreshToken;

    if (
      error.response &&
      error.response.status === 401 &&
      refreshToken &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(`${baseURL}/user/refresh-token`, {
          refreshToken,
        });
        const newAccessToken = response.data.accessToken;

        store.dispatch(updateAccessToken(newAccessToken));

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
