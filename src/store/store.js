import { configureStore } from '@reduxjs/toolkit';
import { Api } from './api';
import { AuthStore } from './slice/AuthSlice';

export const store = configureStore({
  reducer: {
    [Api.reducerPath]: Api.reducer,
    [AuthStore.name] : AuthStore.reducer,
  },
  middleware: (getdefaultMiddleware) => getdefaultMiddleware().concat(Api.middleware),
});
