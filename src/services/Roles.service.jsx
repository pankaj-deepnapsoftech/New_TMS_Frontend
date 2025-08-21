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
      invalidatesTags: ['role'],
    }),

    // --------------- get role here --------------
    getRole: build.query({
      query: () => '/role/get',
      providesTags: ['role'],
    }),

    // --------------- update role ----------------
    updateRole: build.mutation({
      query: ({ id, data }) => ({
        url: `/role/update/${id} `,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['role'],
    }),

    // ---------------- delete role ----------------
    deleteRole: build.mutation({
      query: (id) => ({
        url: `/role/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['role'],
    }),
  }),
});

// ---------------------- all mutations here --------------------
export const { useCreateroleMutation, useDeleteroleMutation, useUpdateroleMutation } = RolesService;

// ---------------- all query here ----------------------
export const { useGetroleQuery } = RolesService;
