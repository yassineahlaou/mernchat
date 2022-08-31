import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: "user",
 
  initialState: {

    loggedInUser : null,
    loading:false,
    error:false,
    usersSearch : []

  },
  reducers: {
   loginStart : (state)=>{state.loading = true},
   loginSuccess : (state,action)=>{state.loading = false ; state.loggedInUser = action.payload},
   loginFailure : (state)=>{state.loading = false;state.error=true},
   logout: (state)=>{state.loading = false;state.error=false;state.loggedInUser = null},
   fetchUsers : (state,action)=>{state.loading = false; state.usersSearch = action.payload },
   clearSearch : (state)=>{state.loading = false ; state.usersSearch = []}
  },
})

// Action creators are generated for each case reducer function
export const { loginStart, loginSuccess, loginFailure, logout, fetchUsers, clearSearch } = userSlice.actions

export default userSlice.reducer