import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    from:{
        type:String
    },
    to:{
        type:String
    },
    content:{
        type:String
    },
    status:{
        type:String
    }




},
{timestamps:true},
)

export default mongoose.model('Message', messageSchema)