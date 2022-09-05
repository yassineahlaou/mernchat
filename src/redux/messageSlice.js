import { createSlice } from '@reduxjs/toolkit'


export const messageSlice = createSlice({
    name: "message",
 
  initialState: {

    currentU : {},
    listLastContacts :[],
    lastMessages : []
    

  },
  
  reducers: {
    getUser : (state,action)=>{
        state.loading = false; 
        state.currentU = action.payload

    },
    
   
   fetchLastContacts : (state,action)=>{
    state.loading = false; 
    
 
    state.listLastContacts = action.payload
   

   // console.log(state.listLastContacts)
    
  },
  fetchLastMessage : (state,action)=>{state.loading = false;state.lastMessages = action.payload}
  },
})


// Action creators are generated for each case reducer function
export const { fetchLastContacts, getUser , fetchLastMessage} = messageSlice.actions

export default messageSlice.reducer