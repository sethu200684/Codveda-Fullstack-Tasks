const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

app.use(express.static(__dirname));

// Health check for Railway
app.get('/chat', (req, res) => {
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

    // Handle joining a specific room 
    socket.on('join_room', (roomName) => {
        socket.join(roomName);
        console.log(`User ${socket.id} joined room: ${roomName}`);
    });

    // Handle bidirectional communication 
    socket.on('send_message', (data) => {
        console.log("Message received:", data);
        // Send to everyone in the room or everyone connected
        io.emit('receive_message', data); 
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    //Sends a notification to everyone in the room 5 seconds after they connect
    setTimeout(() => {
    io.to('internship-updates').emit('notification', { message: 'Welcome to Level 3 Task 2!' });
    }, 5000);
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});