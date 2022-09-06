import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    username:{
        type: String,
        required:true,
        min: 6,
        max: 255
    },
    email:{
        type: String,
        required:true,
        min: 6,
        max: 255
    },
    password:{
        type: String,
        required:true,
        min: 6,
        max: 1024
    },
    profileiImg:{
        type:String,
       
    },
    status:{
        type: String,
        default : "offline"
        
    },
    lastContacts:{
        type: [String],
        
    },
    



},
{timestamps:true},
)

export default mongoose.model('User', userSchema)