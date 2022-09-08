import User from '../models/User.js';
import Message from '../models/Message.js';
import bcrypt from 'bcryptjs'

import jwt from 'jsonwebtoken'

import { registrationValidation , loginValidation, updateValidationProcess} from '../validation.js';

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
        profileiImg: req.body.profileiImg,

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
    //await User.updateOne({_id: userLog._id}, {$set:{"status": "online"}})
    
    const messagesGet = await Message.find({ to:userLog._id})

    for (var i=0; i<messagesGet.length;i++){
        if (messagesGet[i].status == 'Sent'){
        await Message.updateOne({_id:messagesGet[i]._id}, {$set:{"status": "Delivered"}})
        }
    }
    

    //await User.updateOne({_id: userLog._id}, {$set:{"status": "online"}} , {new: true})
    



}


export const getUser = async (req, res)=>{
    const userId = req.params.id
    
    const foundUser = await User.findById(userId)
    
    res.send(foundUser)

}


export const logout =  async  (req, res) => {
    const userLoggedIn = await User.findById( req.user._id )
    await User.updateOne({_id: userLoggedIn._id}, {$set:{"status": "offline"}} , {new: true})
    
    res.clearCookie('authtoken')
    res.send(`GoodBye ${userLoggedIn.username} !!`)
    

}

export const updateUser =  async (req, res) => {
    const {error} = updateValidationProcess(req.body)
    if (error){return res.status(400).send(error.details[0].message)}
    const userId = req.params.id
    
   
    let foundUser = await User.findById(userId) 
    
    foundUser = await User.findOneAndUpdate({_id: userId}, req.body , {new: true})

    res.send(`User with id ${userId}  has been updated` )

}

export const updateStatusOnline =  async (req, res) => {
    let foundUser = await User.findById(req.params.id)

   

   
    await User.updateOne({_id: req.params.id}, {$set:{"status": "online"}} , {new: true})
    res.send(foundUser)

}
export const updateStatusOffline =  async (req, res) => {
    let foundUser = await User.findById(req.params.id)
   
     await User.updateOne({_id: req.params.id}, {$set:{"status": "offline"}} , {new: true})
    res.send(foundUser)

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
    let test1 = ""
    let test2 = ""
    let test3 = ""
    let test4 = ""
    const userId = req.user._id
    const loggedUser = await User.findById(userId)
    const sents = await Message.find({from:userId }).sort({createdAt : -1})
    const gets = await Message.find({to:userId }).sort({createdAt : -1})

    //console.log(gets)
   try{
    if (sents != [])
    {
        for (var i=0 ; i< sents.length ; i++){
            if (!loggedUser.lastContacts.includes(sents[i].to)){

                await User.findByIdAndUpdate( req.user._id ,{
                    $push: {lastContacts : sents[i].to} });
                    test1 = "addedtolahcsent"
                }
                
                let userContacted = await User.findById(sents[i].to)


                if (!userContacted.lastContacts?.includes(req.user._id)){
                await User.findByIdAndUpdate(sents[i].to,{$push:{lastContacts : req.user._id}})
                test2="addedtoyassinesent"
                }

               // loggedUser.lastContacts.push(sents[i].to)
            }
        }
    
    if (gets != [])
    {
        for (var i=0 ; i< gets.length ; i++){
            if (!loggedUser.lastContacts.includes(gets[i].from)){
               
                await User.findByIdAndUpdate( req.user._id ,{
                    $push: {lastContacts : gets[i].from}, });
                    test3 = "addedtolahcget"
               
                //loggedUser.lastContacts.push(gets[i].from)
           }
           let userFrom = await User.findById(gets[i].from)
           if (!userFrom.lastContacts?.includes(req.user._id)){
            await User.findByIdAndUpdate(gets[i].from,{$push:{lastContacts : req.user._id}})
            test4="addedtoyassineget"
        }
        }
    }
}catch(error){
    console.log(error)
}
console.log(test1)
console.log(test2)
console.log(test3)
console.log(test4)
    res.send(loggedUser)
   
}


