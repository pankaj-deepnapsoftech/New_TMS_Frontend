   import { Api } from '../store/api';
   
   const StautsServices = Api.injectEndpoints({
     endpoints: (build) => ({
       // --------------- Status service here ------------
  
       AddStatus: build.mutation({
         query: (body) => ({
           url: '/status/add',
           method: 'POST',
           body,
         }),
         invalidatesTags: ['Status'],
       }),
  
       updateStatus:build.mutation({
         query: ({ id, status }) => ({
           url: `/status/update/${id}`,
           method: 'PUT',
           body: status, 
         }),
         invalidatesTags: ['Status'],
       }),
       
       deleteStatus: build.mutation({
           query: (id) => ({
               url: `/status/delete/${id}`,
               method: 'DELETE',
           }),
           invalidatesTags: ['Status'],
       }),

   
     }),
   });
   
   // ---------------------- all queries here --------------------
  export const { useAddStatusMutation,useUpdateStatusMutation,useDeleteStatusMutation } = StautsServices;
   