import React from 'react'
import './main.scss'
import axios from 'axios'
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import SendIcon from '@mui/icons-material/Send';
export default function Main({actionLogin, actionRegister}) {

    const [users, setUsers] = useState([])
    const [userInfo, setUserInfo] = useState({})
    const {loggedInUser} = useSelector((state)=>state.user)
    const {usersSearch} = useSelector((state)=>state.user)
    const [profileId, setProfileId] = useState("")
    const [messages, setMessages]=useState([])
   // console.log(loggedInUser)
   
    /*useEffect(()=>{
       
    })*/

    const getprofileId =(e)=>{
        setProfileId(e.currentTarget.getAttribute('profileid')) 
        //we used currentTarget instead of target beacuse our div is listening not trigering the event
    }

    
    const getConatct = async (e,key) =>{
        
        const otherUser =  await axios.get(`/user/find/${profileId}`)
        setUserInfo(otherUser.data)

        

    }

    const getConversation = async ()=>{
        const conver = await axios.get(`/message/conversation/${profileId}`)
       setMessages(conver.data)

    }
    
   
    useEffect(()=>{
       
        getConatct()
   console.log(userInfo.username)
    }, [profileId])
    useEffect(()=>{
        getConversation()
    })

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
                    (<div className= 'messageSent'> {mess.content} </div>)
                        :(<div className= 'messageRecieved'> {mess.content} </div>)
                        )}


                    <p>{userInfo.username}</p>
                    <img src={userInfo.profileiImg} alt=''></img>
                   
     
                </div>
                <div className="form">
                            <input type="text" name="content"></input>
                            <button type='submit'><SendIcon className='ico'></SendIcon></button>
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

            ( <><div className="card">
                <img  alt=''></img>
                <div className="texts">
                
                    <p className='profileName'> <strong>Yassine Ahlaou</strong></p>
                    <span className='last'> hello </span>

                </div>
                    

             </div>
             <div className="card">
                <img  alt=''></img>
                <div className="texts">
                
                    <p className='profileName'> <strong>Yassine Ahlaou</strong></p>
                    <span className='last'> hello </span>

                </div>
                    

             </div>
             <div className="card">
                <img  alt=''></img>
                <div className="texts">
                
                    <p className='profileName'> <strong>Yassine Ahlaou</strong></p>
                    <span className='last'> hello </span>

                </div>
                    

             </div>
             <div className="card">
                <img  alt=''></img>
                <div className="texts">
                
                    <p className='profileName'> <strong>Yassine Ahlaou</strong></p>
                    <span className='last'> hello </span>

                </div>
                    

             </div>
             <div className="card">
                <img  alt=''></img>
                <div className="texts">
                
                    <p className='profileName'> <strong>Yassine Ahlaou</strong></p>
                    <span className='last'> hello </span>

                </div>
                    

             </div>
             <div className="card">
                <img  alt=''></img>
                <div className="texts">
                
                    <p className='profileName'> <strong>Yassine Ahlaou</strong></p>
                    <span className='last'> hello </span>

                </div>
                    

             </div>
             <div className="card">
                <img  alt=''></img>
                <div className="texts">
                
                    <p className='profileName'> <strong>Yassine Ahlaou</strong></p>
                    <span className='last'> hello </span>

                </div>
                    

             </div>
             <div className="card">
                <img  alt=''></img>
                <div className="texts">
                
                    <p className='profileName'> <strong>Yassine Ahlaou</strong></p>
                    <span className='last'> hello </span>

                </div>
                    

             </div>
             <div className="card">
                <img  alt=''></img>
                <div className="texts">
                
                    <p className='profileName'> <strong>Yassine Ahlaou</strong></p>
                    <span className='last'> hello </span>

                </div>
                    

             </div>
             <div className="card">
                <img  alt=''></img>
                <div className="texts">
                
                    <p className='profileName'> <strong>Yassine Ahlaou</strong></p>
                    <span className='last'> hello </span>

                </div>
                    

             </div>
             <div className="card">
                <img  alt=''></img>
                <div className="texts">
                
                    <p className='profileName'> <strong>Yassine Ahlaou</strong></p>
                    <span className='last'> hello </span>

                </div>
                    

             </div>
             <div className="card">
                <img  alt=''></img>
                <div className="texts">
                
                    <p className='profileName'> <strong>Yassine Ahlaou</strong></p>
                    <span className='last'> hello </span>

                </div>
                    

             </div>
             <div className="card">
                <img  alt=''></img>
                <div className="texts">
                
                    <p className='profileName'> <strong>Yassine Ahlaou</strong></p>
                    <span className='last'> hello </span>

                </div>
                    

             </div>
             <div className="card">
                <img  alt=''></img>
                <div className="texts">
                
                    <p className='profileName'> <strong>Yassine Ahlaou</strong></p>
                    <span className='last'> hello </span>

                </div>
                    

             </div>
             <div className="card">
                <img  alt=''></img>
                <div className="texts">
                
                    <p className='profileName'> <strong>Yassine Ahlaou</strong></p>
                    <span className='last'> hello </span>

                </div>
                    

             </div>
             </>
            )
            }

           
                 

            </div>
        </div>
    </div>
  )
}
