import { Api } from '../store/api';

const CommentService = Api.injectEndpoints({
    endpoints: (build) => ({
        // --------------- Comment service here ------------

        AddComment: build.mutation({
            query: (body) => ({
                url: '/comment/add',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Comment'],
        }),

        // updateTask: build.mutation({
        //     query: ({ id, taskData }) => ({
        //         url: `/task/update/${id}`,
        //         method: 'PUT',
        //         body: taskData,
        //     }),
        //     invalidatesTags: ['Comment'],
        // }),

        // deleteTask: build.mutation({
        //     query: (id) => ({
        //         url: `/task/delete/${id}`,
        //         method: 'DELETE',
        //     }),
        //     invalidatesTags: ['Comment'],
        // }),

    }),
});

// ---------------------- all queries here --------------------
export const { useAddCommentMutation } = CommentService;
