const socket = io();

const form = document.querySelector('form');

form.addEventListener('submit', event => {
    event.preventDefault();
    socket.emit('chat message',  document.getElementById('message').value)
    document.getElementById('message').value = '';
})