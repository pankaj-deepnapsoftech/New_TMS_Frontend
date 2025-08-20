import { Api } from "../store/api";



const AuthService = Api.injectEndpoints({
    endpoints:(build) => ({
        // --------------- login service here ------------
        login:build.mutation({
            query:(body)=>({
                url:"/user/login",
                method:"POST",
                body
            }),
            invalidatesTags:["User"]
        }),
        // --------------- register api here ----------------
        register:build.mutation({
            query:(body)=>({
                url:"/user/register",
                method:"POST",
                body
            }),
            invalidatesTags:["User"]
        }),
        // --------------- logout api here -------------------
        logout:build.mutation({
            query:(body)=>({
                url:"/user/logout-user",
                method:"POST",
                body
            }),
            invalidatesTags:["User"]
        }),
    })
})


// ---------------------- all mutations here --------------------
export const {useLoginMutation, useRegisterMutation, useLogoutMutation} = AuthService;
