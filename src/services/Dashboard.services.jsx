import { Api } from '../store/api';

const DashboardService = Api.injectEndpoints({
  endpoints: (build) => ({
    // --------------- get ticket overview here --------------
    getTicketOverview: build.query({
      query: () => '/dashboard/ticket-overview',
      providesTags: ['Dashboard'],
    }),

    // ---------------- get workstream activity here ------------------
    getWorkstreamActivity: build.query({
      query: () => '/dashboard/ticket-activity',
      providesTags: ['Dashboard'],
    }),

    // ---------------- get open tasks here ---------------------
    getOpenTasks: build.query({
      query: () => '/dashboard/open-task',
      providesTags: ['Dashboard'],
    }),

    //--------------- get completed task here --------------------
    getCompletedTasks: build.query({
      query: () => '/dashboard/complete-task',
      providesTags: ['Dashboard'],
    }),

    // ---------------- get cards data here ---------------------
    getCardsData : build.query({
        query: () => '/dashboard/card-data',
        providesTags: ['Dashboard'],
    }),

    // ---------------- get users data here ---------------------
    getUserData : build.query({
        query: (id) => `/dashboard/user-tasks/${id}`,
        providesTags: ['Dashboard'],
    }),

    // -------------- get overdue tickets here -------------------
    getOverdueTickets : build.query({
      query : () => '/dashboard/overdue-tickets',
      providesTags:['Dashboard'],
    }),
  }),
});

// ---------------- all query here ----------------------
export const { useGetTicketOverviewQuery, useGetWorkstreamActivityQuery, useGetOpenTasksQuery, useGetCompletedTasksQuery,useGetCardsDataQuery, useGetUserDataQuery, useGetOverdueTicketsQuery } = DashboardService;
