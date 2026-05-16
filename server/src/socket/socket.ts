import { Server } from "socket.io";
import http from "http";
import express, { Application } from "express";
import dotenv from "dotenv"

dotenv.config();

const app: Application = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});
const emailToSocketMapping = new Map();

// join-room event
io.on("connection", (socket) => {
    socket.on("join-room", (data) => {
        const {emailId, roomId} = data;
        emailToSocketMapping.set(emailId, socket.id);
        console.log("User ", emailId, " joined room");
        socket.join(roomId);
        socket.emit("joined-room", {roomId})
        socket.broadcast.to(roomId).emit("user-joined", {emailId})
    })  
})

export { app, server, io };
