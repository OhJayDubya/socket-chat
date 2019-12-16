import express from "express";
import http from "http";
import socketio from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new socketio(server);

// Array for storing currently active users
let users = [];


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.use(express.static(__dirname + "/public"));


io.on("connection", socket => {

    // Fetches all currently active users in the chatroom
  socket.emit("get users", users);

  // When a user disconnects it updates the user list and sends broadcast
  socket.on("disconnect", () => {
    if (socket.username !== undefined) {
      users = users.filter(el => el.id !== socket.id);
      io.emit(
        "user disconnect",
        `${socket.username} has left the chat!`,
        socket.id
      );
    }
  });

  // Deals with the sending of user messsages
  socket.on("message", message => {
    const username = socket.username;
    socket.broadcast.emit("message", message, username);
  });

  // When a user connects and creates a username they are added
  // to the users array and the chatroom it notified
  socket.on("user connect", username => {
    socket.username = username;

    const user = { id: socket.id, username: username };

    users.push(user);
    io.emit("user connect", `${username} has joined the chat!`, user);
  });
});

server.listen(3000, () => {
  console.log("Listening on *:3000");
});
