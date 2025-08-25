import { Api } from '../store/api';

const TicketService = Api.injectEndpoints({
  endpoints: (build) => ({
    // --------------- Ticket service here ------------
    createTicket: build.mutation({
      query: (body) => ({
        url: '/ticket/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Ticket'],
    }),

    updateTicket: build.mutation({
      query: ({ id, data }) => ({
        url: `/ticket/update/${id} `,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Ticket'],
    }),
  }),
});

// ---------------------- all queries here --------------------
export const { useCreateTicketMutation, useUpdateTicketMutation } = TicketService;
