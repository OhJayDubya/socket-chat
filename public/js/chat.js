const socket = io();

const form = document.querySelector('form');

form.addEventListener('submit', event => {
    event.preventDefault();
    socket.emit('chat message',  document.getElementById('message').value)
    document.getElementById('message').value = '';
})

socket.on('chat message', msg => {
    const node = document.createElement('li');
    const textNode = document.createTextNode(msg);
    node.appendChild(textNode);
    document.getElementById('messages').appendChild(node);
})