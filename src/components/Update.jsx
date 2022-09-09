import React from 'react'
import './update.scss'
import axios from 'axios'
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';

import CloseIcon from '@mui/icons-material/Close';

import app from '../firebase.js'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'

import { updateProfile } from '../redux/userSlice';
const Update = props => {

    const dispatch = useDispatch()

    const {loggedInUser} = useSelector((state)=>state.user)

    const [image, setImage] = useState(undefined)
  
  const [imgPerc, setImgPerc] = useState(0);
 
  const [errorUp, setErrorUp] = useState("")
  const [updated, setUpdated] = useState()
  const [checked , setChecked] = useState()
  const [inputs, setInputs] = useState({});





    const handleChange = (e) =>{
        setInputs((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
          });
    
    }
    const handleCheck = (e)=>{
        (e.target.checked) ? setChecked(true) : setChecked(false)
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

      
  const handleUpdate = async(e)=>{
    e.preventDefault()
    try{
      
      if(inputs.profileiImg === undefined){
        if(checked){
        setInputs(inputs.profileiImg = "../assets/avatar.jpeg")
        
        }
      }
    await axios.put(`/user/update/${loggedInUser._id}`, {...inputs})
    const resUpdated = await axios.get(`/user/find/${loggedInUser._id}`)
    dispatch(updateProfile(resUpdated.data))
    console.log(inputs.profileimg)
     
      setUpdated(true)
     

      const MySwall = withReactContent(Swal)
            MySwall.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Profile Updated Successfully',
                showConfirmButton: false,
                timer: 1500
              })


      props.handleClose()
  }  
    catch(error){
      console.log(error)
       
        !error.response.data.includes("Proxy") ? setErrorUp(error.response.data) : setErrorUp("Check Your Connection")

      }

    

  }

  if (updated == true){
    window.location.reload(false);
  }


  const updatePopup = () => {
    props.setOpenUpdate(false)
  }



  return (
    <div className={ !updated ? 'update' : 'hide'}>
    <div className="wrapper">
   
    <CloseIcon className='icon' onClick={updatePopup} ></CloseIcon>

    <><h1>Update Profile</h1>
      
      
      <input type="text" placeholder='username' name="username" defaultValue={loggedInUser.username} onChange={handleChange} ></input>
      <div className='checkboxStyle'>
            <input type="checkbox" id="check" onChange={handleCheck}></input> <p>Remove Profile Image</p>
            </div>
            
            <div className={(!checked ? 'image' : 'hide')}>
            <label><strong>Update Profile Image</strong></label>
            { !updated ? (imgPerc > 0 ? ("Upload Process :" + Math.round(imgPerc,2) + "%") : (<input type="file" className='file'  accept="image/*" onChange={(e) => setImage(e.target.files[0])}></input>) ) : (<input type="file" className='file' accept="image/*" onChange={(e) => setImage(e.target.files[0])}></input>) }
            </div>
      <button type="submit" onClick={handleUpdate}>Update Profile</button></>

      <span  className={ errorUp != "" ? ('err') : ('')}>{errorUp}</span>
    </div>
</div>
  )
}


export default Update;