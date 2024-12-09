import { configureStore } from "@reduxjs/toolkit";
import langReducer from './reducer/langReducer'
import messageReducer from './reducer/messageReducer'

 const store = configureStore({
    reducer:{
        message: messageReducer,
        langState: langReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store