const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

// This allows the server to serve chat.html and any other local files
app.use(express.static(__dirname));

// Fixed: Changed route to '/' so it works at the main URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'chat.html'));
});

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join_room', (roomName) => {
        socket.join(roomName);
        console.log(`User ${socket.id} joined room: ${roomName}`);
    });

    socket.on('send_message', (data) => {
        // io.emit sends to EVERYONE connected
        io.emit('receive_message', data); 
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    // Welcome notification
    setTimeout(() => {
        socket.emit('notification', { message: 'Welcome to Level 3 Task 2!' });
    }, 2000);
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});