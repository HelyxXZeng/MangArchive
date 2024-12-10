import { configureStore } from "@reduxjs/toolkit";
import langReducer from './reducer/langReducer'
import messageReducer from './reducer/messageReducer'
import sessionReducer from './reducer/sessionReducer'

 const store = configureStore({
    reducer:{
        message: messageReducer,
        langState: langReducer,
        sessionState: sessionReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store