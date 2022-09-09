import express from 'express';
import {getConvertation, sendMessage,getOneMessage,setAsDelivered,setAsSeen, openMessage, closeMessage} from '../controllers/messages.js';
const router = express.Router()

import {auth} from './verifyToken.js'


//getConversation

router.get('/conversation/:id' , auth , getConvertation)

//getMessage

router.get('/find/:id',auth, getOneMessage)
//send message
router.post('/send/:idTo', auth, sendMessage)

// clickemessage

router.put('/messageOpen/:id', auth, openMessage )

//closeMessage

router.put('/messageClose/:id', auth, closeMessage)

//update satate delivered
//router.put('/delivered/:idL', auth, setAsDelivered) => I integrated this feature in userLogin function

//update satate seen
router.put('/seen/:idC', auth, setAsSeen)
export default router



