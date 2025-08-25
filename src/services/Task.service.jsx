 import { Api } from '../store/api';
 
 const TaskService = Api.injectEndpoints({
   endpoints: (build) => ({
     // --------------- Ticket service here ------------

     createTask: build.mutation({
       query: (body) => ({
         url: '/task/create',
         method: 'POST',
         body,
       }),
       invalidatesTags: ['Task'],
     }),

     
 
   }),
 });
 
 // ---------------------- all queries here --------------------
export const { useCreateTaskMutation } = TaskService;
 