import { Api } from '../store/api';

const RenualService = Api.injectEndpoints({
  endpoints: (build) => ({
    // --------------- Renual service here ------------

    getRenual: build.query({
      query: (page) => `/renuals/get?page=${page}`,
      providesTags: ['Renual'],
    }),
    createRenual: build.mutation({
      query: (body) => ({
        url: '/renuals/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Renual'],
    }),
    updateRenual: build.mutation({
      query: ({ id,values }) => ({
        url: `/renuals/update/${id}`,
        method: 'PUT',
        body: values,
      }),
      invalidatesTags: ['Renual'],
    }),
  
    deleteRenual: build.mutation({
      query: (id) => ({
        url: `/renuals/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Renual'],
    }),
    

  }),
});

// ---------------------- all queries here --------------------
export const { useGetRenualQuery  } = RenualService;

// -------------------- all mutations here ------------------

export const {useDeleteRenualMutation,useUpdateRenualMutation,useCreateRenualMutation,} = RenualService;
