import { Api } from '../store/api';

const TicketService = Api.injectEndpoints({
  endpoints: (build) => ({
    // --------------- Ticket service here ------------

    getTicket: build.query({
      query: (page) => ({
        url: `/ticket/get?page=${page}`,
        method: 'GET',
      }),
      providesTags: ['Ticket'],
    }),
    getTicketById:build.query({
      query: (id) => ({
        url: `/ticket/get-ticket/${id}`,
        method: 'GET',
      }),
      providesTags: ['Ticket'],
    }), 

     getAssignedTicket:build.query({
      query:(page) =>({
         url: `/ticket/get-assign?page=${page}`,
         method:"GET"
      }),
      providesTags:['Ticket']
     }),

    createTicket: build.mutation({
      query: (body) => ({
        url: '/ticket/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Ticket'],
    }),
    updateTicket: build.mutation({
      query: ({ id,values }) => ({
        url: `/ticket/update/${id}`,
        method: 'PUT',
        body: values,
      }),
      invalidatesTags: ['Ticket'],
    }),
  
    deleteTicket: build.mutation({
      query: (id) => ({
        url: `/ticket/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Ticket'],
    }),
    
    GetAdminTicketcardData:build.query({
      query:()=> "/ticket/ticket-card-admin",
      providesTags:["Ticket"]
    })

  }),
});

// ---------------------- all queries here --------------------
export const { 
  useGetTicketQuery,
  useGetAssignedTicketQuery,
  useGetTicketByIdQuery,
  useCreateTicketMutation, 
  useUpdateTicketMutation,
  useDeleteTicketMutation,
  useGetAdminTicketcardDataQuery 
} = TicketService;
