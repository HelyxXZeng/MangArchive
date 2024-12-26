import { createSlice } from "@reduxjs/toolkit";

const sessionSlice = createSlice({
  name: "sessionState",
  initialState: {
    isSignOut: true,
    current_userID: null,
    current_userName: "",
  },
  reducers: {
    setSessionState: (state, action) => {
      state.isSignOut = action.payload;
    },
    setUserID: (state, action) => {
      state.current_userID = action.payload;
    },
    setUserName: (state, action) => {
      state.current_userName = action.payload;
    },
  },
});
export const { setSessionState, setUserID, setUserName } = sessionSlice.actions;
export default sessionSlice.reducer;
