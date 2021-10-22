//require the express module
const express = require("express");
const app = express();
const dateTime = require("simple-datetime-formater");
const bodyParser = require("body-parser");
const chatRouter = require("./route/chatroute");
const loginRouter = require("./route/loginRoute");
const session = require("express-session");
const cookie = require("cookie-parser");

//require the http module
const http = require("http").Server(app);

// require the socket.io module
const io = require("socket.io");

const port = 5000;

//bodyparser middleware
app.use(bodyParser.json());
app.use(cookie());
app.use(express.urlencoded({extended:false}));
app.use(
  session({
    name: "User_Authentication_Key",
    secret: "MR@3795",
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 60 * 1000 * 24, //7 minutes
      httpOnly: true,
    },
  })
);

//routes
app.use("/chats", chatRouter);
app.use("/login", loginRouter);

//set the express.static middleware
app.use(express.static(__dirname + "/public"));

//integrating socketio
socket = io(http);

//database connection
const Chat = require("./models/Chat");
const connect = require("./dbconnect");

//setup event listener
socket.on("connection", socket => {
  console.log("user connected");
  console.log("my socket id is : ",socket.id);
  socket.on("disconnect", function() {
    console.log("user disconnected");
  });

  //Someone is typing
  socket.on("typing", data => {
    console.log(data);
    socket.broadcast.emit("notifyTyping", {
      user: data.user,
      message: data.message,
    });
  });

  //when soemone stops typing
  socket.on("stopTyping", () => {
    socket.broadcast.emit("notifyStopTyping");
  });

  socket.on("chat message", function(msg , user) {
    console.log("message: " + msg);
    console.log("username: " + user);
    var anotherSocketId = socket.id;
    // var numClients = socket.length;
    
    console.log("another socket id is : ", anotherSocketId);
    // console.log("numClients socket id is : ", numClients);

    socket.to(socket.id).emit("private message", msg);
    console.log("anotherSocketId is : ", anotherSocketId);

    //broadcast message to everyone in port:5000 except yourself.
    socket.broadcast.emit("received", { message: msg , user : user });
    //save chat to the database
    connect.then(db => {
      console.log("connected correctly to the server");
      let chatMessage = new Chat({ message: msg, sender: user, reciever: "karan" });
      console.log("Data stored in db : ", chatMessage);
      chatMessage.save();
      // chatMessagereciever.save();
    });
  });
});

http.listen(port, () => {
  console.log("Running on Port: " + port);
});
