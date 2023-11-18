const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/test.html');
});

// Socket.io connection event
io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for messages from clients
  socket.on('chat message', (msg) => {
    console.log('Message: ' + msg);

    // Broadcast the message to all connected clients
    io.emit('chat message', msg);
  });

  // Listen for disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the server on port 3000
server.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});
