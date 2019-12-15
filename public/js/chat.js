const socket = io();

const form = document.querySelector('form');

const generateMessage = msg => {
    const node = document.createElement('li');
    const textNode = document.createTextNode(msg);
    node.appendChild(textNode);
    document.getElementById('messages').appendChild(node);
}

form.addEventListener('submit', event => {
    event.preventDefault();
    socket.emit('chat message',  document.getElementById('message').value)
    document.getElementById('message').value = '';
})

socket.on('chat message', msg => {
    console.log('Chat Message');
    generateMessage(msg);
})

socket.on('connection', msg => {
    console.log('User Connected');
    generateMessage(msg);
})

socket.on('disconnect', msg => {
    console.log('User Disconnected');
    generateMessage(msg);
});

