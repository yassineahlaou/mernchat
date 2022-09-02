import { createSlice } from '@reduxjs/toolkit'


export const messageSlice = createSlice({
    name: "message",
 
  initialState: {

    currentU : {},
    listLastContacts :[]
    

  },
  
  reducers: {
    getUser : (state,action)=>{
        state.loading = false; 
        state.currentU = action.payload

    },
    
   
   fetchLastContacts : (state,action)=>{
    state.loading = false; 
    
    
   /*  let  dataArray = action.payload  
   
   console.log(dataArray)
       for (var i=0; i< dataArray.length; i++){
      //  console.log(dataArray[i])
      if (state.currentU.lastContacts.includes(dataArray[i]._id) == false){
       
        state.lastContactsListee?.push(dataArray[i])
       
      }

 
    }*/
    state.listLastContacts = action.payload
   

   // console.log(state.listLastContacts)
    
  },
  },
})


// Action creators are generated for each case reducer function
export const { fetchLastContacts, getUser } = messageSlice.actions

export default messageSlice.reducer