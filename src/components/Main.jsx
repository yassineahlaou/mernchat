import React from 'react'
import './main.scss'
import axios from 'axios'
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import SendIcon from '@mui/icons-material/Send';
import {fetchLastContacts , getUser} from '../redux/messageSlice.js'
export default function Main({ actionLogin, actionRegister}) {
    //const Main = props => {

    
    const [userInfo, setUserInfo] = useState({})
    const {loggedInUser} = useSelector((state)=>state.user)
    const {usersSearch} = useSelector((state)=>state.user)
    
    const {listLastContacts} = useSelector((state)=>state.message)
    const [profileId, setProfileId] = useState("")
    const [messages, setMessages]=useState([])
    const [content, setMessageContent] = useState("")
    const [userLast, setUserLast] = useState({})
    const[arr,setArr] = useState([])
 
    const dispatch = useDispatch()
   useEffect(()=>{
    if (loggedInUser == null){
        dispatch(fetchLastContacts([]))
    }
},[loggedInUser])
  
  
    const getprofileId =(e)=>{
        setProfileId(e.currentTarget.getAttribute('profileid')) 
        //we used currentTarget instead of target beacuse our div is listening not trigering the event
    }
   
    const getLastContacts = async () =>{
       // setNewArr()
        let arrayCont = []
        
        
       
        await axios.put('/user/lastMessages')
        const userLogged = await axios.get(`/user/find/${loggedInUser._id}`)

        setUserLast(userLogged.data)
       //console.log(userLast.lastContacts)
        userLast.lastContacts?.map(async (lastCont)=>{
            let userC = await axios.get(`/user/find/${lastCont}`)
            //console.log(userC.data)
            
            arrayCont.push(userC.data)
            
            
            
           
        })
        
       setArr(arrayCont)
        //console.log(arr)

        //console.log(arr)
           
        dispatch(fetchLastContacts(arr))

       
    }
    //getLastContacts()

    useEffect(()=>{
        if(loggedInUser != null)
        {
        
        getLastContacts()
        }
},[arr])


    /*useEffect(()=>{
        if ( loggedInUser != null){
           // setNewArr()
        }
    })*/



    
    const getConatct = async (e,key) =>{
        
        const otherUser =  await axios.get(`/user/find/${profileId}`)
        setUserInfo(otherUser.data)

        

    }
    

    const handleSend = async()=>{
        console.log(content)
        if (content != ""){
            try{
        await axios.post(`/message/send/${profileId}`, {content})
        
      //  console.log(loggedInUser.lastContacts)

            }catch(error){
                console.log(error.data)
            }
       
    }
    setMessageContent("")
}

    const getConversation = async ()=>{
        const conver = await axios.get(`/message/conversation/${profileId}`)
       setMessages(conver.data)

    }
    
   
    useEffect(()=>{
        if (profileId != ""){
       
        getConatct()
        }
  
   
    }, [profileId])
    useEffect(()=>{
        if (profileId != ""){
        getConversation()
        }
    })

   
    
     
       
   
 
        
        
    //console.log(listLastContacts)

    

  return (
    
    <div className='main'>
        

        <div className="wrapper">
            <div className="leftMenu">
                {!loggedInUser ? (<h1>Please Login</h1>) : (
                    <>
            {usersSearch?.map((profile,key)=>
            
                <div className="card" key = {profile._id} profileid={profile._id} onClick={(e)=>getprofileId(e)}>
                    <img src={profile.profileiImg} alt=''></img>
                    <p className='profileName'><strong>{profile.username}</strong></p>
                </div>


            ) }

            <div className={usersSearch.length !=0  ? ('noMore') : ('hideNomore')}><div></div><p>No More Results</p><div></div></div>
                </>)
}
            </div>
         

            {loggedInUser ? 
            (
                
                Object.keys(userInfo).length !== 0 ? ( <div className="center">
                <div className="convers">
       
                    {messages.map((mess) => 
                    mess.from == loggedInUser._id ?
                    (<div className= 'messageSent' key={mess._id}> {mess.content} </div>)
                        :(<div className= 'messageRecieved' key={mess._id}> {mess.content} </div>)
                        )}


                    <p>{userInfo.username}</p>
                    <img src={userInfo.profileiImg} alt=''></img>
                   
     
                </div>
                <div className="form">
                            <textarea type="text" name="content" defaultValue={content} onChange={(e)=>setMessageContent(e.target.value)}></textarea>
                            <button type='submit' onClick={handleSend}><SendIcon className='ico'></SendIcon></button>
                </div>

        </div>


) : 
            
            (<div className="center NotLogged">

                <p>Hi..... {loggedInUser.username}</p>
                <p> Start chatting with people</p>
                 

            </div>))
            :
            (<div className="center NotLogged">
          <h1> Login To Chat With Your Friends ! </h1>

          <button onClick={actionLogin}>Login</button>

          <h1> Create A new Account! </h1>

            <button onClick={actionRegister}>Register</button>

    </div>)
            }
          
            <div className="rightMenu">

                {!loggedInUser ? (<h1>Please Login</h1>) :

            ( <>
           
           {listLastContacts?.map((last)=>
           
            <div   key={last._id} className="card">
                <img src={last.profileiImg} alt=''></img>
                <div className="texts">
                
                    <p className='profileName'> <strong>{last.username}</strong></p>
                    <span className='last'> </span>

                </div>
                    

             </div>
            )}
         
            
             </>
            )
            }

           
                 

            </div>
        </div>
    </div>
  )
}
