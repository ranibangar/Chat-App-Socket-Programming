import express from "express";
import {Server} from "socket.io";
import cors from "cors";
import http from "http";

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
    socket.on('disconnect',()=>{
        console.log("Connection is disconnected")
    });
})

server.listen(3000,()=>{
    console.log("App is listening on port 3000")
})