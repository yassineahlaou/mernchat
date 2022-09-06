import React from 'react'
import './navbar.scss'
import { useState, useEffect } from "react";

import { useSelector, useDispatch } from 'react-redux'
import {fetchUsers, logout, clearSearch } from '../redux/userSlice.js'
import Swal from 'sweetalert2'
import {fetchLastContacts , getUser} from '../redux/messageSlice.js'
import withReactContent from 'sweetalert2-react-content'
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios'

export default function Navbar({actionUpdate,openUpdate, setOpenUpdate}) {

  const [searchStart, setSearchStart] = useState("")

  const {usersSearch} = useSelector((state) => state.user)

  const {listLastContacts} = useSelector((state)=>state.message)

  const {loggedInUser} = useSelector((state) => state.user)

  const dispatch = useDispatch()

  const handlelogout = async (e)=>{
    //e.preventDefault()
    
    try{
      await axios.put(`/user/statusOffline/${loggedInUser._id}`) 
      //console.log(loggedInUser.status)  
    const res = await axios.get("/user/logout")
    dispatch(logout())

    const MySwal = withReactContent(Swal)
            MySwal.fire({
                position: 'top-end',
                icon: 'success',
                title: `bye bye ... See you later !`,
                showConfirmButton: false,
                timer: 1500
              })
           
    }
    catch(error){
      console.log(error)

    }


    window.location.reload(false);

  }
  

  


  const handleSearch = async (e) =>{
    e.preventDefault()
    if (searchStart === "") {dispatch(clearSearch())}else{ 
    try{
      
     
      let query = `?q=${searchStart}`
    const resSearch = await axios.get(`/user/usersearch${query}` )
   
    dispatch(fetchUsers(resSearch.data))
    }
    catch(error){
      console.log(error)
    }}
  }
  return (
    <div className='navbar'>
        <div className="wrapper">
            <div className="left">
                <input placeholder='Search'  type="text"  name="searchStart" onChange={(e)=>setSearchStart(e.target.value)}></input>
                <button><SearchIcon className='ico' onClick={handleSearch}></SearchIcon></button>
            </div>
            <div className="cent">
                 <button onClick={()=>setOpenUpdate(true)} className={!loggedInUser ? ('hide') : ('butt') } title="update profile"><img src={loggedInUser?.profileiImg}    alt=""></img></button>
           
                    <img src='../assets/logo.png' alt=""></img>
                    <button className={!loggedInUser ? ('hide') : ('logout') } onClick={handlelogout}>Logout</button>
            </div>
            <div className="right">
            <input placeholder='Search' type="text" name="searchConv"></input>
                <button><SearchIcon className='ico'></SearchIcon></button>

            </div>
        </div>
    </div>
  )
}
