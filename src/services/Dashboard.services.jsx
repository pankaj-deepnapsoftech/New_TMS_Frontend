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
        providesTags: ['Dashboard']
    }),

    // ---------------- get open tasks here ---------------------
    getOpenTasks: build.query({
        query: () => '/dashboard/open-task',
        providesTags: ['Dashboard']
    })
  }),
});

// ---------------- all query here ----------------------
export const { useGetTicketOverviewQuery, useGetWorkstreamActivityQuery, useGetOpenTasksQuery } = DashboardService;
