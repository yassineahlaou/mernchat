import User from '../models/User.js';
import Message from '../models/Message.js';
import bcrypt from 'bcryptjs'

import jwt from 'jsonwebtoken'

import { registrationValidation , loginValidation} from '../validation.js';

import {auth} from '../routes/verifyToken.js'

//reister
export const createUser = async (req, res) => {

    //data validation
    const {error} = registrationValidation(req.body)
    if (error){return res.status(400).send(error.details[0].message)}

    //check if user is already in database

    const emailExist = await User.findOne({email: req.body.email})
    if (emailExist) {return res.status(400).send('This email already exists!')}
    const usernameExist = await User.findOne({username: req.body.username})
    if (usernameExist) {return res.status(400).send('This username already exists!')}

    //hash the password

    const salt = await bcrypt.genSalt(10)

    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    //create new user
    
    const user = new User ({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        profileimg: req.body.profileimg,

    })

    //save user
    try {
        const savedUser = await user.save()
        res.send(savedUser)
        //res.send({user: user._id})
        
    } catch (error) {
        res.status(400).send(error)
  
    }
 }

//login

export const loginUser = async (req, res) => {
    //data validation
    const {error} = loginValidation(req.body)
    if (error){return res.status(400).send(error.details[0].message)}

    //check if email is already in database

    const userLog = await User.findOne({email: req.body.email})
    if (!userLog) {return res.status(400).send('Email not found!')}

    //check if password is correct 
    const passwordMatched = await bcrypt.compare(req.body.password, userLog.password)
    if (!passwordMatched){return res.status(400).send('Wrong Password!')}
    

    //create token jwt , as a security mesure that the user is logged in

    const token = jwt.sign({_id: userLog._id}, process.env.TOKEN_SECRET)
    res.cookie('authtoken', token, { httpOnly: true }).send(userLog)
    
    



}


export const getUser = async (req, res)=>{
    const userId = req.params.id
    
    const foundUser = await User.findById(userId)
    
    res.send(foundUser)

}


export const logout =  async  (req, res) => {
    const userLoggedIn = await User.findById( req.user._id )
    
    res.clearCookie('authtoken')
    res.send(`GoodBye ${userLoggedIn.username} !!`)
    

}

export const searchByUsername =  async  (req, res) => {
  //  let searchStart = req.body.searchStart  
    const searchStart = req.query.q 
    //console.log(searchStart)
    try{
    const users = await User.find({username:{$regex: searchStart , $options:"i"}}).limit(40)
    res.send(users)
    }catch(error){
        console.log(error)

    }

}

export const getLastMessages =  async  (req, res) => {
    const userId = req.user._id
    const loggedUser = await User.findById(userId)
    const sents = await Message.find({from:userId }).sort({createdAt : -1})
    const gets = await Message.find({to:userId }).sort({createdAt : -1})

   

    if (sents != [])
    {
        for (var i=0 ; i< sents.length ; i++){
            if (!loggedUser.lastContacts.includes(sents[i].to)){
                loggedUser.lastContacts.push(sents[i].to)
            }
        }
    }
    if (gets != [])
    {
        for (var i=0 ; i< gets.length ; i++){
            if (!loggedUser.lastContacts.includes(gets[i].from)){
                loggedUser.lastContacts.push(gets[i].from)
           }
        }
    }

    res.send(loggedUser)
}