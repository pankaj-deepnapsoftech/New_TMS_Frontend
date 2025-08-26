import { Api } from '../store/api';

const ImportantNotesService = Api.injectEndpoints({
  endpoints: (build) => ({
    // --------------- Important notes service here ------------

    getImportantNotes: build.query({
      query: (page) => `/imp-docs/get?page=${page}`,
      providesTags: ['Important notes'],
    }),
    createImportantNotes: build.mutation({
      query: (body) => ({
        url: '/imp-docs/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Important notes'],
    }),
    updateImportantNotes: build.mutation({
      query: ({ id, values }) => ({
        url: `/imp-docs/update/${id}`,
        method: 'PUT',
        body: values,
      }),
      invalidatesTags: ['Important notes'],
    }),

    deleteImportantNotes: build.mutation({
      query: (id) => ({
        url: `/imp-docs/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Important notes'],
    }),
  }),
});

// ---------------------- all queries here --------------------
export const { useGetImportantNotesQuery } = ImportantNotesService;

// -------------------- all mutations here ------------------

export const { useCreateImportantNotesMutation, useDeleteImportantNotesMutation, useUpdateImportantNotesMutation } = ImportantNotesService;
