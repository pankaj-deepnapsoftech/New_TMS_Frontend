import { Api } from '../store/api';

const RolesService = Api.injectEndpoints({
  endpoints: (build) => ({
    // --------------- create role here ------------
    createRole: build.mutation({
      query: (body) => ({
        url: '/role/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Role'],
    }),

    // --------------- get role here --------------
    getRole: build.query({
      query: (creator) => `/role/get/${creator}`,
      providesTags: ['role'],
    }),

    // --------------- update role ----------------
    updateRole: build.mutation({
      query: ({ id, data }) => ({
        url: `/role/update/${id} `,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Role'],
    }),

    // ---------------- delete role ----------------
    deleteRole: build.mutation({
      query: (id) => ({
        url: `/role/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Role'],
    }),

    // --------------- all roles ---------------------
    allRoles:build.query({
      query:()=>"/role/all-role",
      providesTags:["Role"]
    }),
  }),
});

// ---------------------- all mutations here --------------------
export const { useCreateRoleMutation, useDeleteRoleMutation, useUpdateRoleMutation } = RolesService;

// ---------------- all query here ----------------------
export const { useGetRoleQuery,useAllRolesQuery } = RolesService;
