import { createSlice } from "@reduxjs/toolkit";


const langSlice = createSlice({
    name: 'langState',
    initialState: { langState: 'vi' },
    reducers: {
        setLangState: (state, action) => {
            const supportedLangs = ['en', 'vi'];
            state.langState = supportedLangs.includes(action.payload) 
                ? action.payload 
                : 'vi'; // Giá trị mặc định
        },
    },
});


export const { setLangState } = langSlice.actions;
export default langSlice.reducer;