import { configureStore } from '@reduxjs/toolkit'
import authSlice from './reducers/authSlice'
import api from './api/api';
import miscSlice from './reducers/miscSlice';
import chatSlice from './reducers/chatSlice';

const store = configureStore({
    reducer: {
        [authSlice.name]: authSlice.reducer,
        [miscSlice.name]: miscSlice.reducer,
        [chatSlice.name]: chatSlice.reducer,
        [api.reducerPath]: api.reducer
    },
    middleware: (mid) => [...mid(), api.middleware]
})

export default store;