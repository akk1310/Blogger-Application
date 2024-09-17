import {configureStore} from '@reduxjs/toolkit'
import authSlice,{postReducer} from './authSlice'


const store=configureStore({
    reducer:{
        auth:authSlice,
    posts:postReducer}
})

export default store;

