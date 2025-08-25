import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    user:null
}

 const AuthStore = createSlice({
    name:"Auth",
    initialState,
    reducers:{
        addUser:(state,action) => {
            state.user = action.payload
        },
        removeUser:(state) => {
            state.user = null;
        }
    }
})



export const {addUser,removeUser} = AuthStore.actions
export {AuthStore}