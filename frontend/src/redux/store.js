import {configureStore}  from '@reduxjs/toolkit'
import authSlice from './reducers/authSlice'
import api from './api/api';
import miscSlice from './reducers/miscSlice';

const store = configureStore({
    reducer:{
        [authSlice.name] : authSlice.reducer,
        [miscSlice.name] : miscSlice.reducer,
        [api.reducerPath] : api.reducer
    }, 
    middleware : (mid) => [...mid(), api.middleware]
})

export default store;