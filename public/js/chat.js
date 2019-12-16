const socket = io();
let username = undefined;

// Used to create message bubble on the UI when triggered
const generateMessage = (message, username, origin) => {

    // Sets time when message was sent
  const time = new Date().toLocaleString("en-uk", {
    hour: "numeric",
    minute: "numeric",
    hour12: true
  });

  // Variables for element creation
  const parent = document.getElementById("chat");
  const node = document.createElement("li");

  // Renders the chat message and automatically scrolls the chat
  node.setAttribute("class", origin);
  node.innerHTML = `
    <div class="entete">
      <span class="status green"></span>
      <h2>${username}</h2>
      <h3>${time}</h3>
    </div>
    <div class="message">
        ${message}
    </div>
    `;
  parent.appendChild(node);
  parent.scrollTop = parent.scrollHeight;
};

// Used for broadcasting messages to all users
const generateBroadcast = message => {
  const parent = document.getElementById("chat");
  const node = document.createElement("li");
  node.innerHTML = `<div class="broadcast">${message}</div>`;
  parent.appendChild(node);
  parent.scrollTop = parent.scrollHeight;
};

// Takes the message by the user and emits it to other users
const sendMessage = event => {
  event.preventDefault();
  const message = document.getElementById("message").value;

  if (message) {
    generateMessage(message, username, "sent");
    document.getElementById("message").value = "";
    socket.emit("message", message);
  }
};

// Generates the user list of the side of the chat
const generateUser = (id, username) => {
  const node = document.createElement("li");
  node.setAttribute("id", id);
  node.innerHTML = `
      <img src="https://i.pravatar.cc/300" alt="avatar" />
      <div>
        <h2>${username}</h2>
        <h3>
          <span class="status green"></span>
          online
        </h3>
      </div>
      `;
  document.getElementById("users").appendChild(node);
};

// Removes user from list when disconnected
const removeUser = id => {
  const node = document.getElementById(id);
  document.getElementById("users").removeChild(node);
};

// Sets the users chosen username when they first connect
const setUsername = event => {
  event.preventDefault();

  username = document.getElementById("username").value;

  if (username) {
    document.getElementById("chat-form").style.display = "block";
    document.getElementById("user-form").style.display = "none";
    socket.emit("user connect", username);
  }
};

// Socket Events

// Triggers when a new message is sent
socket.on("message", (message, username) => {
  generateMessage(message, username, "recieved");
});

// Triggers when a new user connects to the chatroom
socket.on("user connect", (message, user) => {
  generateBroadcast(message);
  generateUser(user.id, user.username);
});

// Triggers when a user disconnects from that chatroom
socket.on("user disconnect", (message, id) => {
  generateBroadcast(message);
  removeUser(id);
});

// Gets currently active users in the chat room
socket.on("get users", users => {
  users.forEach(user => {
    generateUser(user.id, user.username);
  });
});
