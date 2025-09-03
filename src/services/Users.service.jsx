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
    putUserData: build.mutation({
      query: ({ id,body }) => ({
        url: `/user/update-user/${id}`,
        method: 'PUT',
        body
      }),
      invalidatesTags: ['user'],
    }),
  }),
});

// ---------------------- all queries here --------------------
export const { useGetUserQuery, useGetAssigneUserQuery } = UserService;

// --------------------- all mutations here --------------------
export const { usePutUserDataMutation } = UserService;
