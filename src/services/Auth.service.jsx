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
    })
})


// ---------------------- all mutations here --------------------
export const {useLoginMutation} = AuthService;