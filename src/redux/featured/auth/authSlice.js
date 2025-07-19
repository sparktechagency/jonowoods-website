import { createSlice } from "@reduxjs/toolkit";
// Removing circular import
// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { loginSuccess } from "src/redux/featured/auth/authSlice";

const initialState = {
  user: null,
  token: null, // Don't read from localStorage here!
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const accessToken = action.payload;
      state.token = accessToken;
      state.isAuthenticated = true;
      localStorage.setItem("token", accessToken);
    },
    registerSuccess: (state, action) => {
      const { user, accessToken } = action.payload;
      state.user = user;
      state.token = accessToken;
      state.isAuthenticated = true;
      localStorage.setItem("token", accessToken);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginSuccess,
  registerSuccess,
  logout,
  setLoading,
  setError,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
