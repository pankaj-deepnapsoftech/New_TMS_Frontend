import { Api } from '../store/api';

const DepartmentService = Api.injectEndpoints({
  endpoints: (build) => ({
    // --------------- create department here ------------
    create: build.mutation({
      query: (body) => ({
        url: '/department/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),

    // --------------- get department here --------------
    get: build.mutation({
      query: (body) => ({
        url: '/department/get/',
        method: 'GET',
        body,
      }),
      invalidatesTags: ['User'],
    }),

    // --------------- update department ----------------
    update: build.mutation({
      query: (body) => ({
        url: '/department/update/:id',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['User'],
    }),

    // ---------------- delete department ----------------
    delete: build.mutation({
      query: (body) => ({
        url: '/department/delete/:id',
        method: 'DELETE',
        body,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

// ---------------------- all mutations here --------------------
export const { useCreateMutation, useGetMutation, useUpdateMutation, useDeleteMutation } = DepartmentService;
