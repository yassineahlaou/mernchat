import User from '../models/User.js';
import Message from '../models/Message.js';



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
               // await Message.updateOne({_id:messagesget[i]._id}, {$set:{"status": "Delivred"}})
           
        }
    }
    let conv = conversation.sort((a,b)=>b.createdAt - a.createdAt)

    res.send(conv)





}

export const sendMessage = async (req, res) => {
    let messStatus = ""
    const userTo = await User.findById(req.params.idTo)
    if (userTo.status == "online"){
        messStatus = "Delivered"


    }
    else{
        messStatus = "Sent"

    }

    const message = new Message ({
        to: req.params.idTo,
        from: req.user._id,
        content: req.body.content,
        status : messStatus,
        
        
        

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

export const openMessage = async (req, res) => {

    await Message.updateOne({_id: req.params.id}, {$set:{"clicked": true}} , {new: true})


}


export const closeMessage = async (req, res) => {
    await Message.updateOne({_id: req.params.id}, {$set:{"clicked": false}} , {new: true})


}

export const getOneMessage = async (req, res) => {

    const resMessage = await Message.findById(req.params.id)
    res.send(resMessage)
}


export const setAsDelivered = async (req, res) => {
    
    const messagesGet = await Message.find({to:req.params.idL})

    for (var i=0; i<messagesGet.length;i++){
        if (messagesGet[i].status == 'Sent'){
        await Message.updateOne({_id:messagesGet[i]._id}, {$set:{"status": "Delivered"}})
        }
    }
}

export const setAsSeen = async (req, res) => {
    const idUser= req.params.idC
    const messagesGet = await Message.find({from:idUser, to:req.user._id})

    for (var i=0; i<messagesGet.length;i++){
        await Message.updateOne({_id:messagesGet[i]._id}, {$set:{"status": "Seen"}})
    }

    res.send(messagesGet)
}




