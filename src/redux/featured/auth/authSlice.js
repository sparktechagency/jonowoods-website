import { createSlice } from "@reduxjs/toolkit";

// Helper functions for localStorage operations
const getTokenFromStorage = () => {
  if (typeof window !== 'undefined') {
    try {
      const token = localStorage.getItem("token");
      return token && token !== 'undefined' && token !== 'null' ? token : null;
    } catch (error) {
      console.error('Error getting token from localStorage:', error);
      localStorage.removeItem("token");
      return null;
    }
  }
  return null;
};

const getUserFromStorage = () => {
  if (typeof window !== 'undefined') {
    try {
      const userData = localStorage.getItem("user");
      return userData && userData !== 'undefined' ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      localStorage.removeItem("user");
      return null;
    }
  }
  return null;
};

// Initialize state with data from localStorage
const initialState = {
  user: getUserFromStorage(),
  token: getTokenFromStorage(),
  isAuthenticated: Boolean(getTokenFromStorage()),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { user, accessToken } = action.payload;
      state.user = user;
      state.token = accessToken;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      
      // Store in localStorage
      localStorage.setItem("token", accessToken);
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }
    },
    
    registerSuccess: (state, action) => {
      const { user, accessToken } = action.payload;
      state.user = user;
      state.token = accessToken;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      
      // Store in localStorage
      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(user));
    },
    
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      
      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    
    // Add deleteAccountSuccess reducer
    deleteAccountSuccess: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      
      // Clear all localStorage data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.clear(); // Clear everything if needed
    },
    
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    // Add this to refresh token from localStorage
    refreshAuthState: (state) => {
      const token = getTokenFromStorage();
      const user = getUserFromStorage();
      
      if (token && user) {
        state.token = token;
        state.user = user;
        state.isAuthenticated = true;
      } else {
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
      }
    },
  },
});

export const {
  loginSuccess,
  registerSuccess,
  logout,
  deleteAccountSuccess,
  setLoading,
  setError,
  clearError,
  refreshAuthState,
} = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;