// const { Cookie } = require("express-session");

var socket = io();
var messages = document.getElementById("messages");
var reciever =  document.getElementById("reciever");
// console.log(document.cookie.split("=")[1])
let username = document.cookie.split("=")[1];
console.log(username);

(function() {
  $("form").submit(function(e) {
    let li = document.createElement("li");
    e.preventDefault(); // prevents page reloading
    socket.emit("chat message", $("#message").val(), username, $("reciever").val());

    messages.appendChild(li).append($("#message").val());
    reciever.appendChild(li).append($("#reciever").val());
    let span = document.createElement("span");
    messages.appendChild(span).append("by " + username + ": " + "just now");
    reciever.appendChild(span).append("from " + reciever);
    console.log("User Name by sockect id is : ", username);
    $("#message").val("");
    $("#reciever").val("");
    scrollToBottom();
    return false;
  });

  socket.on("received", data => {
    let li = document.createElement("li");
    let span = document.createElement("span");
    var messages = document.getElementById("messages");
    messages.appendChild(li).append(data.message);
    messages.appendChild(span).append("From " + reciever + ": " + "just now");
  });
})();

function scrollToBottom() {
  messages.scrollTop = messages.scrollHeight
}

// fetching initial chat messages from the database
(function() {
  fetch("/chats")
    .then(data => {
      return data.json();
    })
    .then(json => {
      json.map(data => {
        let li = document.createElement("li");
        let span = document.createElement("span");
        messages.appendChild(li).append(data.message);
        messages
          .appendChild(span)
          .append("by " + data.sender + ": " + formatTimeAgo(data.createdAt));
        reciever.appendChild(span).appendChild("from " + data.reciever);
      });
    });
})();

//is typing...

let messageInput = document.getElementById("message");
let typing = document.getElementById("typing");

//isTyping event
messageInput.addEventListener("keypress", () => {
  socket.emit("typing", { user: username, reciever: reciever, message: "is typing..." });
});

socket.on("notifyTyping", data => {
  typing.innerText = data.user + " " + data.message;
  console.log(data.user + data.message);
});

//stop typing
messageInput.addEventListener("keyup", () => {
  socket.emit("stopTyping", "");
});

socket.on("notifyStopTyping", () => {
  typing.innerText = "";
});
