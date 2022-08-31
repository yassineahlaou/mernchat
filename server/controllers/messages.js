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

    const messagessent = await Message.find({from : userId} , {to:otherUser}).sort({createdAt : -1})
    const messagesget = await Message.find({from : otherUser} , {to:userId}).sort({createdAt : -1})


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

    res.send(conversation)





}

export const sendMessage = async (req, res) => {
    const message = new Message ({
        to: req.params.idTo,
        from: req.user._id,
        content: req.body.content,
        

    })

    //save user
    try {
        const saveMessage = await message.save()
        res.send(saveMessage)
        //res.send({user: user._id})
        
    } catch (error) {
        res.status(400).send(error)
  
    }

}