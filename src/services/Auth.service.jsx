import { Api } from '../store/api';

const AuthService = Api.injectEndpoints({
  endpoints: (build) => ({
    // --------------- login service here ------------
    login: build.mutation({
      query: (body) => ({
        url: '/user/login',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),
    // --------------- register api here ----------------
    register: build.mutation({
      query: (body) => ({
        url: '/user/register',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),
    // --------------- logout api here -------------------
    logout: build.mutation({
      query: (body) => ({
        url: '/user/logout-user',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),

    // --------------- user update api ------------------
    UpdateUser: build.mutation({
      query: ({ id, data }) => ({
        url: `/user/update-user/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),

    // --------------- get current user api ------------------
    getCurrentUser: build.query({
      query: () => ({
        url: '/user/loged-in-user',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
  }),
});

// ---------------------- all mutations here --------------------
export const { useLoginMutation, useRegisterMutation, useLogoutMutation, useUpdateUserMutation, useGetCurrentUserQuery } = AuthService;
