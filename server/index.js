import express from 'express'
import dotenv from "dotenv";

import mongoose from "mongoose"

import userRoutes from './routes/user.js'
import messageRoutes from './routes/message.js'


//create our app

const app = express()


//load config
dotenv.config({path: './config/config.env'})

//connect db 
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true,}, () => console.log('connected to Database'))



//routes

app.use('/user', userRoutes)
app.use('/message', messageRoutes)



const PORT = process.env.PORT ;

app.listen(PORT, 
    console.log(`Started application on port ${PORT}`)
    );