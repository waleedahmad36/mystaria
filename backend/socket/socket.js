
import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/messageModel.js";
import Conversation from "../models/conversationModel.js";

const app = express();
const server = http.createServer(app);
// origin: "http://localhost:3000",

const io = new Server(server, {
    cors: {
        // origin:[process.env.FRONT_URL_ONE,process.env.FRONT_URL_TWO],
        origin: process.env.FRONT_URL_TWO,
        methods: ["GET", "POST"],
    },

});

const userSocketMap = {};

export const getRecipientSocketId = (recipientId) => userSocketMap[recipientId];

io.on('connection', (socket) => {
    console.log('User connected', socket.id);
    const userId = socket.handshake.query.userId;
    if (userId !== "undefined") userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("markMessagesAsSeen", async ({ conversationId, userId }) => {
        try {
            await Message.updateMany({ conversationId, seen: false }, { $set: { seen: true } });
            await Conversation.updateOne({ _id: conversationId }, { $set: { "lastMessage.seen": true } });
            io.to(userSocketMap[userId]).emit("messagesSeen", { conversationId });
        } catch (error) {
            console.error(error);
        }
    });

    socket.on('disconnect', () => {
        console.log("User disconnected");
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { io, server, app };






// import { Server } from "socket.io";
// import http from "http";
// import express from "express";
// import Message from "../models/messageModel.js";
// import Conversation from "../models/conversationModel.js";
// const app=express();
// const server=http.createServer(app);
// const io= new Server(server,{
//     cors:{
//         origin:"http://localhost:3000",
//         methods:["GET","POST"],
//     },
// });
// export const getRecipientSocketId=(recipientId)=>{
//     return userSocketMap[recipientId]
// }
// const userSocketMap = {}; // userId: socketId
// io.on('connection',(socket)=>{
//     console.log('User connected',socket.id)
//     const userId= socket.handshake.query.userId;
//     if (userId != "undefined") userSocketMap[userId] = socket.id;
// 	io.emit("getOnlineUsers", Object.keys(userSocketMap));

//     socket.on("markMessagesAsSeen",async ({conversationId,userId})=>{
//         try {
//           await  Message.updateMany({conversationId:conversationId,seen:false},{$set:{
//             seen:true
//           }})
//           await Conversation.updateOne({_id:conversationId},{$set:{"lastMessage.seen":true}})
//           io.to(userSocketMap[userId]).emit("messagesSeen",{conversationId})

//         } catch (error) {
//             console.log(error)
//         }
//     })

//     socket.on('disconnect',()=>{
//         console.log("User disconnected")
//         delete userSocketMap[userId]
//         io.emit("getOnlineUsers",Object.keys(userSocketMap))
//     })
// })

// export {io,server,app}