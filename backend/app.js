const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const chatRoutes = require('./routes/chatRoutes');
const Message = require('./models/MessageSchema');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Frontend URL
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use((req, res, next) => {
  req.io = io; // Attach Socket.IO to request
  next();
});

// Routes
app.use('/api/chat', chatRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Socket.IO for real-time chat
io.on('connection', async (socket) => {
  console.log('User connected:', socket.id);

  // Send initial messages
  try {
    const messages = await Message.find().sort({ createdAt: -1 }).limit(50);
    socket.emit('initMessages', messages.reverse()); // Chronological order
  } catch (err) {
    console.error('Failed to load initial messages:', err);
  }

  // Handle incoming messages
  socket.on('sendMessage', async (msg) => {
    try {
      const message = new Message(msg);
      await message.save();
      io.emit('message', message); // Broadcast to all connected users
    } catch (err) {
      console.error('Failed to save message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));