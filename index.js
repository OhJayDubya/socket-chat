import express from 'express';
import http from 'http';
import socketio from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new socketio(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
    socket.broadcast.emit('connection', 'A user has connected!');

    socket.on('disconnect', () => {
        io.emit('disconnect', 'A user has disconnected!');
    })

    socket.on('chat message', msg => {
        io.emit('chat message', msg);
    })
});

server.listen(3000, () => {
    console.log('Listening on *:3000');
});