const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const announcementRoutes = require('./routes/announcemnet'); // Fixed typo
const chatRoutes = require('./routes/chatRoutes');
const pollRoutes = require('./routes/PollRoutes');
const taskRoutes = require('./routes/TaskRoutes');
const payRoutes = require('./routes/PayementRoutes');
const authRoutes = require('./routes/AuthRoutes');
const Message = require('./models/MessageSchema');
const Poll = require('./models/PollSchema');
const Task = require('./models/TaskSchema');
const Announcement = require('./models/AnnouncementSChema'); // Added import

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/polls', pollRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/pay', payRoutes);
app.use('/api/announcements', announcementRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Debug Mongoose connection
mongoose.connection.on('connected', () => console.log('Mongoose connected to DB'));
mongoose.connection.on('error', (err) => console.error('Mongoose connection error:', err));

// Socket.IO for real-time features
io.on('connection', async (socket) => {
  console.log('User connected:', socket.id);

  // Send initial messages
  try {
    console.log('Fetching initial messages...');
    const messages = await Message.find().sort({ createdAt: -1 }).limit(50);
    socket.emit('initMessages', messages.reverse());
  } catch (err) {
    console.error('Failed to load initial messages:', err);
  }

  // Send initial polls
  try {
    const polls = await Poll.find();
    socket.emit('initPolls', polls);
  } catch (err) {
    console.error('Failed to load initial polls:', err);
  }

  // Send initial tasks
  try {
    const tasks = await Task.find();
    socket.emit('initTasks', tasks);
  } catch (err) {
    console.error('Failed to load initial tasks:', err);
  }

  // Send initial announcements
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    socket.emit('initAnnouncements', announcements);
  } catch (err) {
    console.error('Failed to load initial announcements:', err);
  }

  // Handle incoming messages
  socket.on('sendMessage', async (msg) => {
    try {
      const message = new Message(msg);
      await message.save();
      io.emit('message', message);
    } catch (err) {
      console.error('Failed to save message:', err);
    }
  });

  // Handle votes
  socket.on('vote', async ({ pollId, optionIndex }) => {
    try {
      const poll = await Poll.findById(pollId);
      if (poll) {
        poll.options[optionIndex].votes += 1;
        await poll.save();
        io.emit('pollUpdate', await Poll.find());
      }
    } catch (err) {
      console.error('Failed to vote:', err);
    }
  });

  // Handle task status updates
  socket.on('updateTaskStatus', async ({ taskId, status }) => {
    try {
      const task = await Task.findByIdAndUpdate(taskId, { status }, { new: true });
      if (task) {
        io.emit('taskUpdate', await Task.find());
      }
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
  });

  // Handle task drag-and-drop updates
  socket.on('taskMoved', async (updatedTasks) => {
    try {
      await Task.deleteMany({});
      await Task.insertMany(updatedTasks);
      io.emit('taskUpdate', updatedTasks);
    } catch (err) {
      console.error('Failed to update tasks:', err);
    }
  });

  // Handle drawing events
  socket.on('draw', (data) => {
    socket.broadcast.emit('draw', data);
  });

  socket.on('clearCanvas', () => {
    io.emit('clearCanvas');
  });

  // Handle announcements
  socket.on('createAnnouncement', async (announcement) => {
    try {
      const newAnnouncement = new Announcement(announcement);
      await newAnnouncement.save();
      io.emit('announcementUpdate', await Announcement.find().sort({ createdAt: -1 }));
    } catch (err) {
      console.error('Failed to create announcement:', err);
    }
  });

  // Handle room joining
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));