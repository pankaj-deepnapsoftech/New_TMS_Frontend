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
      invalidatesTags: ['Departments'],
    }),

    // --------------- get department here --------------
    getDepartment: build.query({
      query: (page) => `/department/get?page=${page}`,
      providesTags: ['Departments'],
    }),

    // --------------- update department ----------------
    updateDapartment: build.mutation({
      query: ({ id, data }) => ({
        url: `/department/update/${id} `,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Departments'],
    }),

    // ---------------- delete department ----------------
    deleteDepartment: build.mutation({
      query: (id) => ({
        url: `/department/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Departments'],
    }),

    // ------------------ all Departments -----------------
    AllDepartments: build.query({
      query: () => '/department/all-department',
      providesTags: ['Departments'],
    }),
  }),
});

// ---------------------- all mutations here --------------------
export const { useCreateMutation, useUpdateDapartmentMutation, useDeleteDepartmentMutation } = DepartmentService;

// ---------------- all query here ----------------------
export const { useGetDepartmentQuery, useAllDepartmentsQuery } = DepartmentService;
