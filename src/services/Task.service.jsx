 import { Api } from '../store/api';
 
 const TaskService = Api.injectEndpoints({
   endpoints: (build) => ({
     // --------------- Task service here ------------

     createTask: build.mutation({
       query: (body) => ({
         url: '/task/create',
         method: 'POST',
         body,
       }),
       invalidatesTags: ['Task'],
     }),

     updateTask:build.mutation({
       query: ({ id, taskData }) => ({
         url: `/task/update/${id}`,
         method: 'PUT',
         body: taskData,
       }),
       invalidatesTags: ['Task'],
     }),
     
       deleteTask: build.mutation({
         query: (id) => ({
           url: `/task/delete/${id}`,
           method: 'DELETE',
         }),
         invalidatesTags: ['Task'],
       }),
 
   }),
 });
 
 // ---------------------- all queries here --------------------
export const { useCreateTaskMutation,useUpdateTaskMutation,useDeleteTaskMutation } = TaskService;
 