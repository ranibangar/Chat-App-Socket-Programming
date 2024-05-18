import express from "express";
import {Server} from "socket.io";
import cors from "cors";
import http from "http";
import {connect} from "./config.js"
import { chatModel } from "./chat.schema.js";
const app=express()

//1.create server using http
const server=http.createServer(app);

//2.create socket server from above created server
const io = new Server(server,{
    cors:{
        origin:'*',
        methods:["GET","POST"]
    }
});

//3.use socket events
io.on('connection',(socket)=>{
    console.log("connection is established");

    socket.on("join",(data)=>{
        socket.username=data;

        //Display messages n 
        //sort latest messages ans show nly 50 msg
        chatModel.find().sort({timestamp:1}).limit(50)
        .then(messages=>{
            socket.emit('load_messages',messages);
        }).catch(err=>{
            console.log(err);
        })
    })
    socket.on('new_message',(message)=>{   //new_message is from client

        // to add username with message
        let userMessage={
            username:socket.username,
            message:message
        }
   //to save data to DB
   const newChat=new chatModel({
    username:socket.username,
    message:message,
    timestamp:new Date()
   })
   console.log("this is task",newChat);
   newChat.save();
        //broadcast this message to all the clients
        socket.broadcast.emit('broadcast_message',userMessage);
    })
    socket.on('disconnect',()=>{
        console.log("Connection is disconnected")
    });
})

server.listen(3000,()=>{
    console.log("App is listening on port 3000");
    connect();
})