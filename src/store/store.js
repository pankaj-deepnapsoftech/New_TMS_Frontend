import { configureStore } from "@reduxjs/toolkit";
import { Api } from "./api";



export const store = configureStore({
    reducer:{
        [Api.reducerPath]:Api.reducer
    },
    middleware:(getdefaultMiddleware) => getdefaultMiddleware().concat(Api.middleware)
})