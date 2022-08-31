import express from 'express';
import {getConvertation, sendMessage} from '../controllers/messages.js';
const router = express.Router()

import {auth} from './verifyToken.js'


//getConversation

router.get('/conversation/:id' , auth , getConvertation)
//send message
router.post('/send/:idTo', auth, sendMessage)
export default router



