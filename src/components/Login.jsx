
import React from 'react'
import axios from 'axios'
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import './login.scss'
import Swal from 'sweetalert2'

import withReactContent from 'sweetalert2-react-content'
import { loginStart, loginSuccess, loginFailure, logout } from '../redux/userSlice.js'

const Login = props => {

    const dispatch = useDispatch()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [logged, setLogged] = useState(false)

    const {loggedInUser} = useSelector((state)=>state.user)

    const handleLogin = async (e) =>{
        e.preventDefault()
            dispatch(loginStart())
            try{
            const res = await axios.post("/user/login", {email, password}, {withCredentials: true})
            dispatch(loginSuccess(res.data))

            setLogged(true)

            const MySwall = withReactContent(Swal)
            MySwall.fire({
                position: 'top-end',
                icon: 'success',
                title: `Welcome... ${loggedInUser.username}`,
                showConfirmButton: false,
                timer: 1500
              })


              props.handleClose()
            
        

            
            
            }
            catch(error){
            dispatch(loginFailure())
            console.log(error.response.data)
            
            !error.response.data.includes("Proxy") ? setError(error.response.data) : setError("Check Your Connection")

            }


    }
  return (
    <div className={!logged ? ('login') : ('hide')}>

<div className="wrapper">
        <CloseIcon className='icon' onClick={props.handleClose} ></CloseIcon>

   <><h1>Login</h1>
          
          
          <input type="text" placeholder='email' name="email" onChange={(e)=>setEmail(e.target.value)} ></input>
          
          <input type="text"  placeholder='password' name='password' onChange={(e)=>setPassword(e.target.value)}></input>
          
          <button type="submit" onClick={handleLogin}>Login</button></>
          <span  className={ error != "" ? ('err') : ('')}>{error}</span>
        </div>
    </div>
  )
}

export default Login
