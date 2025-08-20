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
    updateDapartment: build.mutation({
      query: ({id,data}) => ({
        url: `/department/update/${id} `,
        method: 'PUT',
        body:data,
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
export const { useCreateMutation,  useUpdateDapartmentMutation, useDeleteDepartmentMutation } = DepartmentService;


// ---------------- all query here ----------------------
export const {useGetDepartmentQuery} = DepartmentService;