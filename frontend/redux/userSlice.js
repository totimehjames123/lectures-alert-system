import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null, // Initial state for user data
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload; // Set user data
    },
    clearUser: (state) => {
      state.user = null; // Clear user data
    },
  },
});

// Export action creators
export const { setUser, clearUser } = userSlice.actions;

// Selector to get user data
export const selectUser = (state) => state.user.user;
export const selectUserRole = (state) => state.user.user?.role;


export default userSlice.reducer;
