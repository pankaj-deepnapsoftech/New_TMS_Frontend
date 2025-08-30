import { Api } from '../store/api';

const UserService = Api.injectEndpoints({
  endpoints: (build) => ({
    // --------------- Users service here ------------
    getUser: build.query({
      query: () => `/user/all-users`,
      providesTags: ['user'],
    }),
    getAssigneUser: build.query({
      query: () => `/user/get-all-users`,
      providesTags: ['user'],
    }),
    
  }),
});

// ---------------------- all queries here --------------------
export const { useGetUserQuery,useGetAssigneUserQuery } = UserService;
