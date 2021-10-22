const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
var chatData=require('./model/userData');
var connect=require('./dbConnection');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });
  io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
      connect.then(db => {
        console.log("connected");
        console.log(msg);
  
    let chatMessage = new chatData({ message: msg });
    chatMessage.save();
  });
    });
  });
// io.on('connection', (socket) => {
//   console.log('a user connected');
// });
io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
        console.log('message: ' + msg);
    });
  });
  io.on('connection', (socket) => {
    console.log('a user connected');
    socket.broadcast.emit('hi');
    
    socket.on('disconnect', () => {
      console.log('user disconnected');
     
    });
  });

 // This will emit the event to all connected sockets

 

server.listen(8081, () => {
    console.log('listening on *:8081');
  });
