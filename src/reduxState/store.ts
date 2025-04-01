import { configureStore } from "@reduxjs/toolkit";
import langReducer from "./reducer/langReducer";
import messageReducer from "./reducer/messageReducer";
import sessionReducer from "./reducer/sessionReducer";
import notificationReducer from "./reducer/notificationReducer";
import keyReducer from "./reducer/keyReducer";

const store = configureStore({
  reducer: {
    message: messageReducer,
    langState: langReducer,
    sessionState: sessionReducer,
    notification: notificationReducer,
    key: keyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
