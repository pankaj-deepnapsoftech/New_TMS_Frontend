import { Api } from '../store/api';

const AssetService = Api.injectEndpoints({
  endpoints: (build) => ({
    // --------------- create asset here ------------
    createAsset: build.mutation({
      query: (body) => ({
        url: '/assets/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Asset'],
    }),

    // --------------- get asset here --------------
    getAsset: build.query({
      query: () => '/assets/get',
      providesTags: ['Asset'],
    }),

    // --------------- update asset here ----------------
    updateAsset: build.mutation({
      query: ({ id, data }) => ({
        url: `/assets/update/${id} `,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Asset'],
    }),

    // ---------------- delete asset here ----------------
    deleteAsset: build.mutation({
      query: (id) => ({
        url: `/assets/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Asset'],
    }),
  }),
});

// ---------------------- all mutations here --------------------
export const { useCreateAssetMutation, useDeleteAssetMutation, useUpdateAssetMutation } = AssetService;

// ---------------- all query here ----------------------
export const { useGetAssetQuery } = AssetService;
