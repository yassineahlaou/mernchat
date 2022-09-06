import express from 'express';
import {createUser, loginUser, getUser, updateUser,logout,searchByUsername, updateStatusOffline,updateStatusOnline,getLastMessages } from '../controllers/users.js';
const router = express.Router()

import {auth} from './verifyToken.js'



//add user
router.post('/register', createUser )

//login

router.post('/login', loginUser )

//changestatus
router.put('/statusOnline/:id',auth, updateStatusOnline)

//changestatus
router.put('/statusOffline/:id',auth, updateStatusOffline)


//logout

router.get('/logout', auth, logout)


//get one user

router.get('/find/:id',  getUser)

//search by username

router.get('/usersearch' , auth, searchByUsername)

//search last message

router.put('/lastMessages' , auth, getLastMessages)

//update one user
router.put('/update/:id', auth ,  updateUser)







export default router;