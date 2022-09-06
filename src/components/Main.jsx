import React from 'react'
import './main.scss'
import axios from 'axios'
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {fetchUsers, logout, clearSearch } from '../redux/userSlice.js'
import SendIcon from '@mui/icons-material/Send';
import {fetchLastContacts , getUser, fetchLastMessage} from '../redux/messageSlice.js'
export default function Main({ actionLogin, actionRegister}) {
    //const Main = props => {

    
    const [userInfo, setUserInfo] = useState({})
    const {loggedInUser} = useSelector((state)=>state.user)
    const {usersSearch} = useSelector((state)=>state.user)
    const {lastMessages} = useSelector((state)=>state.message)
    const {listLastContacts} = useSelector((state)=>state.message)
    const [profileId, setProfileId] = useState("")
    const [messages, setMessages]=useState([])
    const [content, setMessageContent] = useState("")
    const [userLast, setUserLast] = useState({})
    const [userLastMess, setUserLastMess] = useState({})
    const[arr,setArr] = useState([])
    const [userRenew, setUserRenew] = useState({})
    const [lastConv, setLastConv] = useState([])

    const bottomRef = useRef(null);

    const [lastMessage, setLastMessage] = useState([{idContact: String, content: String}]);
 
    const dispatch = useDispatch()
    useEffect(()=>{
        if (loggedInUser == null){
            dispatch(fetchLastContacts([]))
        }
    },[loggedInUser])
    
   useEffect(()=>{
    if (loggedInUser == null){
        dispatch(fetchUsers([]))
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
    
    const getMessage = async () =>{
        
         const userLogged = await axios.get(`/user/find/${loggedInUser._id}`)
    
         setUserLastMess(userLogged.data)
        
        
         userLastMess.lastContacts?.map(async (lastCont)=>{
            
    
             const conver = await axios.get(`/message/conversation/${lastCont}`)
            
          setLastConv(conver.data)
           let fou =  lastMessage.some((item)=>item.idContact === lastCont)
           
          // console.log(fou)
           if (fou == false){

                //.push( {idContact: lastCont, content: conver.data[0].content})
               
                setLastMessage((prev) => [
                    ...prev,
                    {idContact: lastCont, content: conver.data[0].content},
                  ])
              
             }

             else{
                const convers = await axios.get(`/message/conversation/${lastCont}`)
                lastMessage.map((item)=>{
                    if(item.idContact == lastCont){
                        item.content = convers.data[0].content
                    }
                })
             }

             

             
            
           
         
             
            
         })
        

         //dispatch(fetchLastMessage(lastMessage))
         
        
         //.log(lastMessage)

         
        
        
     }

    useEffect(()=>{
        if(loggedInUser != null)
        {
        
        getLastContacts()
       
        }
},[arr])

useEffect(()=>{
    if(loggedInUser != null)
    {
 getMessage()
    }
},[arr])
   
    

    
  
   










    
    const getConatct = async (e,key) =>{
        
        const otherUser =  await axios.get(`/user/find/${profileId}`)
        setUserInfo(otherUser.data)

        

    }
    

    const handleSend = async()=>{
        console.log(content)
        if (content != ""){
            try{
        await axios.post(`/message/send/${profileId}`, {content})
        setMessageContent("")
        bottomRef.current?.scrollIntoView({behavior: 'smooth'});
        
      //  console.log(loggedInUser.lastContacts)

            }catch(error){
                console.log(error.data)
            }

            const conver = await axios.get(`/message/conversation/${profileId}`)
            
            setLastConv(conver.data)
             let foun =  lastMessage.some((item)=>item.idContact === profileId)
             
            // console.log(fou)
             if (foun == true){
  
                  //.push( {idContact: lastCont, content: conver.data[0].content})
                 
                 

                    lastMessage.map((line)=>{
                        if(line.idContact == profileId){
                            line.content = content;
                        }
                    })
                
               }
  
       
    }
    
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

    
  let con = ""
  return (
    
    
    <div className='main'>
        

        <div className="wrapper">
            <div className="leftMenu">
                {!loggedInUser ? (<h1>Please Login</h1>) : (
                    <>
            {usersSearch?.map((profile,key)=>
            
                <div className="card" key = {profile._id} profileid={profile._id} onClick={(e)=>getprofileId(e)}>
                    <div className="status">
                    <img src={profile.profileiImg} alt=''></img>
                   
                    <div className={ profile.status == 'online' ? 'online' : 'offline'}></div>
                    </div>
                    
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
                    (<><div  className= 'messageSent' key={mess._id}> {mess.content} </div></>)
                        :(<div  className= 'messageRecieved' key={mess._id}> {mess.content} </div>)
                        )}

                    
                    <p>{userInfo.username}</p>
                    <div className="status">
                    <img src={userInfo.profileiImg} alt=''></img>
                    <div className={ userInfo.status == 'online' ? 'online' : 'offline'}></div>
                    </div>
                   
     
                </div>
               
                <div className="form">
                            <textarea type="text" name="content" value={content} onChange={(e)=>setMessageContent(e.target.value)}></textarea>
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

         

    </div>)
            }
          
            <div className="rightMenu">

                {!loggedInUser ? (<h1>Please Login</h1>) :

            ( <>
           
           {
           
           listLastContacts?.map((last)=>
           
            <div   key={last._id} className="card">
                <div className="status">
                <img src={last.profileiImg} alt=''></img>
                <div className={ last.status == 'online' ? 'online' : 'offline'}></div>
                </div>
                <div className="texts">
                
                    <p className='profileName'> <strong>{last.username}</strong></p>
                    
                        {lastMessage.map((row)=>{
                            
                            //console.log(row)
                            if (row.idContact == last._id){
                              //  console.log(row.content)
                              con = row.content
                             // console.log(con)
                                

                            }
                        })}

        <span className='last'>{con} </span>

                    
                    

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
