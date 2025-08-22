// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define a service using a base URL and expected endpoints
export const Api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: 'include',
  }),
  endpoints: () => ({}),
  tagTypes: ['User', 'Ticket', 'Task', 'Commet', 'Important Docs', 'Role','Departments'],
});
