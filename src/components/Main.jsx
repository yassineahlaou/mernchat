import React from 'react'
import './main.scss'
import axios from 'axios'
import { useState, useEffect, useRef , useMemo} from "react";
import { useSelector, useDispatch } from 'react-redux';
import {fetchUsers, logout, clearSearch } from '../redux/userSlice.js'
import SendIcon from '@mui/icons-material/Send';
import OutsideClickHandler from 'react-outside-click-handler';
import { format} from "timeago.js";
import {fetchLastContacts , getUser, fetchLastMessage} from '../redux/messageSlice.js'
export default function Main({ actionLogin, actionRegister}) {
    

    
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
    const [messageClicked, setMessageClicked] = useState(false)
    const [messId, setMessId] = useState("")
    
    const [messClick , setMessClick] = useState([{idMessage:String,clicked : Boolean}]);
    const [lastMessage, setLastMessage] = useState([{idContact: String, idFrom: String, status:String, content: String}]);
    const  ref1 = useRef(null);
    const [isVisisble, setIsVisisble] = useState(false)



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



  
  
 
    const getprofileId = async(e)=>{
        setProfileId(e.currentTarget.getAttribute('profileid')) 
        
      
    }

   
    

    const callBackFunction = (entries) =>{
        const [entry] = entries
        setIsVisisble(entry.isIntersecting)

    }

    
   
    
  


  
    
    

  useEffect(() => {
    const observe = new IntersectionObserver(callBackFunction)
    if (ref1.current != null){
        observe.observe(ref1.current)
       
    }
    return ()=>{
        if (ref1.current != null){
            observe.unobserve(ref1.current)
        }
    }
  },[ref1.current])


  const setSeen = async () =>{
    
       await axios.put(`/message/seen/${profileId}`)
       //console.log('hello')
       
  }
  if (isVisisble == true){

  setSeen()
  }

  




   
    const getLastContacts = async () =>{
       
        let arrayCont = []
        
        
       
        await axios.put('/user/lastMessages')
        const userLogged = await axios.get(`/user/find/${loggedInUser._id}`)

        setUserLast(userLogged.data)
      
        userLast.lastContacts?.map(async (lastCont)=>{
            let userC = await axios.get(`/user/find/${lastCont}`)
            
            
            arrayCont.push(userC.data)

           
           
           
          
        
            
           
        })
        
       
        
       setArr(arrayCont)
        
           
        dispatch(fetchLastContacts(arr))

       
    }
    
    
    const getMessage = async () =>{
        
         const userLogged = await axios.get(`/user/find/${loggedInUser._id}`)
    
         setUserLastMess(userLogged.data)
        
        
         userLastMess.lastContacts?.map(async (lastCont)=>{
            
    
             const conver = await axios.get(`/message/conversation/${lastCont}`)
            
         
           let fou =  lastMessage.some((item)=>item.idContact === lastCont)
           
          
           if (fou == false){

                
               if (conver.data[0].from == loggedInUser._id){
                setLastMessage((prev) => [
                    ...prev,
                    {idContact: lastCont, idFrom:conver.data[0].from , status : conver.data[0].status ,content:`You:${conver.data[0].content }` }
                  ])

                }

                else{

                    setLastMessage((prev) => [
                        ...prev,
                        {idContact: lastCont, idFrom:conver.data[0].from ,status : conver.data[0].status, content:conver.data[0].content  }
                      ])
    

                }
              
             }

             else{
                const convers = await axios.get(`/message/conversation/${lastCont}`)
                lastMessage.map((item)=>{
                    if(item.idContact == lastCont){
                        item.idFrom = convers.data[0].from
                        if (convers.data[0].from == loggedInUser._id)
                        {item.content = `You:${convers.data[0].content}`}
                        else{
                            item.content =convers.data[0].content
                        }
                    }
                })
             }

             

             
            
           
         
             
            
         })
        

        

         
        
        
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
        
        
     

            }catch(error){
                console.log(error.data)
            }

           const conver = await axios.get(`/message/conversation/${profileId}`)
            
        
             let foun =  lastMessage.some((item)=>item.idContact === profileId)
             
            
             if (foun == true){
  
                  
                 
                 

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

   

     
      /* const messageClick = async (e)=>{
        let messageId = e.currentTarget.getAttribute('messageid')
        setMessId(messageId)

        await axios.put(`/message/messageOpen/${messageId}`)


       }

       const messageOutClick = async (e)=>{
        //const messageId = e.currentTarget.getAttribute('messageid')
        const resMessage = await axios.get(`/message/find/${messId}`)
        if (resMessage.clicked == true)
        {await axios.put(`/message/messageClose/${resMessage._id}`)}


       }
   */
       
        
        
    

    
  let con = ""
  let stat = ""
  
  return (
    
    
    <div className='main'>
        

        <div className="wrapper">
            <div  className="leftMenu">
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
                
                Object.keys(userInfo).length !== 0 ? ( <div  className="center">
                
                <div  ref={ref1}  className="convers">
                
                
                    {messages.map((mess) => 
                    mess.from == loggedInUser._id ?
                    (<><OutsideClickHandler  onOutsideClick={()=>setMessageClicked(false)}><div  className= 'messageSent' onClick={()=>setMessageClicked(true)} messageid={mess._id}> {mess.content}  </div> </OutsideClickHandler> <span className={messageClicked == true ? 'infoMessage' : 'hide'}>{mess.status} . {format(mess.createdAt)}</span></>)
                        :(<div  className= 'messageRecieved ' > {mess.content} </div>)
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
                            
                           
                            if (row.idContact == last._id){
                             
                              con = row.content
                              if (row.idFrom != loggedInUser._id)
                              {stat = row.status}
                              else{
                                stat = ""
                              }
                              
                             
                                

                            }

                           
                        })}

                       
                           
                        {stat == "" ? <span>{con}</span> : (stat != "Seen" ? (<span><strong>{con}</strong> </span>): (<span>{con}</span>))}

       

                    
                    

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
