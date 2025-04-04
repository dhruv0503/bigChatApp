import { configureStore } from '@reduxjs/toolkit'
import authSlice from './reducers/authSlice'
import api from './api/api';
import miscSlice from './reducers/miscSlice';
import chatSlice from './reducers/chatSlice';
import adminApi from './api/adminApi';

const store = configureStore({
    reducer: {
        [authSlice.name]: authSlice.reducer,
        [miscSlice.name]: miscSlice.reducer,
        [chatSlice.name]: chatSlice.reducer,
        [api.reducerPath]: api.reducer,
        [adminApi.reducerPath]: adminApi.reducer
    },
    middleware: (mid) => [...mid(), api.middleware, adminApi.middleware],
    devTools : import.meta.env.VITE_NODE_ENV !== 'production'
})

export default store;