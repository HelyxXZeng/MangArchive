import { configureStore } from "@reduxjs/toolkit";
import langReducer from './reducer/langReducer'

 const store = configureStore({
    reducer:{
        langState: langReducer,
    }
})
export default store