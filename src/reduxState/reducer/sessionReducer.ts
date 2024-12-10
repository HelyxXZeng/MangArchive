import { createSlice } from "@reduxjs/toolkit";


const sessionSlice = createSlice({
    name: 'sessionState',
    initialState: { isLogin: false },
    reducers: {
        setSessionState: (state, action) => {
            state.isLogin = action.payload
        },
    },
});


export const { setSessionState } = sessionSlice.actions;
export default sessionSlice.reducer;