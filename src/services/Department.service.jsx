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
      invalidatesTags: ['department'],
    }),

    // --------------- get department here --------------
    getDepartment: build.query({
     query:()=>"/department/get",
     providesTags:["department"]
    }),

    // --------------- update department ----------------
    update: build.mutation({
      query: ({id,body}) => ({
        url: `/department/update/${id} `,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['department'],
    }),

    // ---------------- delete department ----------------
    deleteDepartment: build.mutation({
      query: (id) => ({
        url: `/department/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['department'],
    }),
  }),
});

// ---------------------- all mutations here --------------------
export const { useCreateMutation,  useUpdateMutation, useDeleteDepartmentMutation } = DepartmentService;


// ---------------- all query here ----------------------
export const {useGetDepartmentQuery} = DepartmentService;