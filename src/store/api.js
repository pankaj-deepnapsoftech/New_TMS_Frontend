// Need to use the React-specific entry point to import createApi
import { config } from '@/config/env.config';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define a service using a base URL and expected endpoints
export const Api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: config.Dev === "development" ? config.LOCAL_API_URL  : config.API_URL,
    credentials: 'include',
  }),
  endpoints: () => ({}),
  tagTypes: ['User', 'Ticket', 'Task', 'Comment', 'Important Docs', 'Role', 'Departments','Status',"Notification","Dashboard"], 
});
