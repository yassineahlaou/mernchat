import User from '../models/User.js';
import Message from '../models/Message.js';
import bcrypt from 'bcryptjs'

import jwt from 'jsonwebtoken'

import { registrationValidation , loginValidation} from '../validation.js';

import {auth} from '../routes/verifyToken.js'


export const getConvertation = async (req, res) => {

    const userId = req.user._id
    const otherUser = req.params.id

    let conversation = []
    
    const messagessent = await Message.find({from : userId, to:otherUser})
   
    const messagesget = await Message.find({from : otherUser , to:userId})


    if (messagessent != [])
    {
        for (var i=0 ; i< messagessent.length ; i++){
          
                 conversation.push(messagessent[i])
            
        }
    }
    if (messagesget != [])
    {
        for (var i=0 ; i< messagesget.length ; i++){
           
                conversation.push(messagesget[i])
           
        }
    }
    let conv = conversation.sort((a,b)=>b.createdAt - a.createdAt)

    res.send(conv)





}

export const sendMessage = async (req, res) => {
    const message = new Message ({
        to: req.params.idTo,
        from: req.user._id,
        content: req.body.content,
        
        

    })
    
    

    //save message
    try {
        const saveMessage = await message.save()
        res.send(saveMessage)
        //res.send({user: user._id})

        
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
  
    }

   

}