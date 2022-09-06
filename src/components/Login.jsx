
import React from 'react'
import axios from 'axios'
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import './login.scss'
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'
import app from '../firebase.js'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import {fetchLastContacts , getUser} from '../redux/messageSlice.js'

import { loginStart, loginSuccess, loginFailure, logout } from '../redux/userSlice.js'

const Login = props => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    
    const [image, setImage] = useState(undefined)
    const [imgPerc, setImgPerc] = useState(0);
    
    const [errorReg, setErrorReg] = useState("")
  const [uploaded, setUploaded] = useState()
  const [register,setRegister] = useState(false)
  const [message, setMessage] = useState("")

  const [inputs, setInputs] = useState({});
  


    const [logged, setLogged] = useState(false)
    const {listLastContacts} = useSelector((state)=>state.message)
    

    const {loggedInUser} = useSelector((state)=>state.user)

   

    const handleLogin = async (e) =>{

        e.preventDefault()
            dispatch(loginStart())
            try{
            const res = await axios.post("/user/login", {email, password}, {withCredentials: true})

           
            dispatch(loginSuccess(res.data))
            //await axios.put(`/user/statusOnline/${loggedInUser._id}`)    
           // const resUser = await axios.get(`/user/find/${loggedInUser._id}`)  
            //dispatch(loginSuccess(resUser.data))
            //console.log(loggedInUser)
           //await axios.put(`/user/status/${loggedInUser._id}`, {...inputs})    
            

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
            console.log(error.response)
            
            !error.response?.data.includes("Proxy") ? setError(error.response?.data) : setError("Check Your Connection")

            }

          
           
            
            
            

            


    }
  const setStatus = async () =>{
    await axios.put(`/user/statusOnline/${loggedInUser._id}`)    
          const resUser = await axios.get(`/user/find/${loggedInUser._id}`)  
            dispatch(loginSuccess(resUser.data))
    console.log(loggedInUser)
   
  }
  setStatus()
    if (logged == true){
      
      window.location.reload(false);

      
    }
    

    const handleChange = (e) =>{
      setInputs((prev) => {
          return { ...prev, [e.target.name]: e.target.value };
        });
  
  }

  const uploadFile = (file, fileType) =>{
    console.log(file.name)
    const storage = getStorage(app);
    const filename = new Date().getTime() + file.name
    const storageRef = ref(storage, filename);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
    (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        //console.log('Upload is ' + progress + '% done');
        fileType === "profileiImg" && setImgPerc(progress) 
        switch (snapshot.state) {
        case 'paused':
            console.log('Upload is paused');
            break;
        case 'running':
            console.log('Upload is running');
            break;
        default:
            break;
        }
    }, 
    (error) => {
        // Handle unsuccessful uploads
    }, 
    () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setInputs((prev) => {
            return { ...prev, [fileType]: downloadURL };
          });
                 
            
          });
       
      }

    );

  }


  useEffect (()=>{
    image &&  uploadFile(image, "profileiImg")

  }, [image]
  )
  const handleRegister = async(e)=>{
    e.preventDefault()
    try{
      if(inputs.profileiImg === undefined){
       
        setInputs(inputs.profileiImg = "../assets/avatar.jpeg")
        //console.log(inputs.profileimg)
        
      }
      console.log(inputs)
    await axios.post("/user/register", {...inputs})
      setMessage("Welcome Aboard! Login Now to Use this app!")
      setInputs({username:"" , email:"" , password:""})

      setUploaded(true)
      setErrorReg("")
      setRegister(false)
      const MySwall = withReactContent(Swal)
            MySwall.fire({
                position: 'top-end',
                icon: 'success',
                title: `Log In Now!`,
                showConfirmButton: false,
                timer: 1500
              })

  }  
    catch(error){
      console.log(error)

      !error.response.data.includes("Proxy") ? setErrorReg(error.response.data) : setErrorReg("Check Your Connection")
       
   

      }

  }

   
    

    
    
  return (
    <div className={!logged ? ('login') : ('hide')}>
{!register ? 
(<div className="wrapperlogin">
 
        <CloseIcon className='icon' onClick={props.handleClose} ></CloseIcon>

  <h1>Sign In</h1>
          
          
          <input type="text" placeholder='email' name="email" value={email} onChange={(e)=>setEmail(e.target.value)} ></input>
          
          <input type="text"  placeholder='password' name='password' value={password} onChange={(e)=>setPassword(e.target.value)}></input>
          
          <button type="submit" onClick={handleLogin}>Login</button>

         <a href="javascript:void(0);" onClick={(e)=>setRegister(true)}> Create New Account</a>
          
          <span  className={ error != "" ? ('err') : ('')}>{error}</span>



          
          </div> ) :
           (<div className="wrapperregister">
           <CloseIcon className='icon' onClick={props.handleClose} ></CloseIcon>
   
     <h1>Sign Up</h1>
             
             <input type="text" placeholder='username' name="username" value = {inputs.username} onChange={handleChange}></input>
             
             <input type="text" placeholder='email' name="email" value = {inputs.email} onChange={handleChange}></input>
             
             <input type="text"  placeholder='password' name='password' value = {inputs.password} onChange={handleChange}></input>
             <label>Profile Image</label>
             { !uploaded ? (imgPerc > 0 ? (("Upload Process :" + Math.round(imgPerc,2) + "%")) : (<input type="file" className='file'  accept="image/*" onChange={(e) => setImage(e.target.files[0])}></input>) ) : (<input type="file" className='file' accept="image/*" onChange={(e) => setImage(e.target.files[0])}></input>) }
             <button type="submit" onClick={handleRegister}>Register</button>
   
            <a href="javascript:void(0);" onClick={(e)=>setRegister(false)}>  Already have account</a>
             
            <span  className={ errorReg != "" ? ('err') : ('')}>{errorReg}</span>
   
   
             
             </div>)
}
          </div>
        
      
  
  )
}

export default Login
