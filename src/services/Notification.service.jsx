import { Api } from "@/store/api";


const NotificationService = Api.injectEndpoints({
    endpoints: (build) => ({

        getNotification: build.query({
            query: () => '/notification/get',
            providesTags: ['Notification']
        }),
        updatedStatus: build.mutation({
            query: ({ id, status }) => ({
                url: `/notification/update/${id}`,
                method: "PUT",
                body: { status} ,
            }),
            invalidatesTags: ['Notification']
        }),


    })
})

export const { useGetNotificationQuery,useUpdatedStatusMutation } = NotificationService;