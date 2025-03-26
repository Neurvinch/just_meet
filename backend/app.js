const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const chatRoutes = require('./routes/chatRoutes');
const pollRoutes = require('./routes/PollRoutes');
const taskRoutes = require('./routes/TaskRoutes');
const  pay = require("./routes/PayementRoutes")
const MessageSchema = require('./models/MessageSchema');
const PollSchema = require('./models/PollSchema');
const TaskSchema = require('./models/TaskSchema');



const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // allow requests from this origin
  credentials: true,               // enable set cookie and other credentials
}));
app.use(express.json());
app.use((req, res, next) => {
  req.io = io; // Attach Socket.IO to request
  next();
});

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/polls', pollRoutes);
app.use('/api/tasks', taskRoutes); // Fixed typo
app.use('/api',pay)

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Socket.IO for real-time features
io.on('connection', async (socket) => {
  console.log('User connected:', socket.id);

  // Send initial messages
  try {
    const messages = await MessageSchema.find().sort({ createdAt: -1 }).limit(50);
    socket.emit('initMessages', messages.reverse());
  } catch (err) {
    console.error('Failed to load initial messages:', err);
  }

  // Send initial polls
  try {
    const polls = await PollSchema.find();
    socket.emit('initPolls', polls);
  } catch (err) {
    console.error('Failed to load initial polls:', err);
  }

  // Send initial tasks
  try {
    const tasks = await TaskSchema.find();
    socket.emit('initTasks', tasks);
  } catch (err) {
    console.error('Failed to load initial tasks:', err);
  }

  // Handle incoming messages
  socket.on('sendMessage', async (msg) => {
    try {
      const message = new MessageSchema(msg);
      await message.save();
      io.emit('message', message); // Broadcast to all
    } catch (err) {
      console.error('Failed to save message:', err);
    }
  });

  // Handle votes
  socket.on('vote', async ({ pollId, optionIndex }) => {
    try {
      const poll = await PollSchema.findById(pollId);
      if (poll) {
        poll.options[optionIndex].votes += 1;
        await poll.save();
        io.emit('pollUpdate', await PollSchema.find());
      }
    } catch (err) {
      console.error('Failed to vote:', err);
    }
  });

  // Handle task status updates (for TaskList)
  socket.on('updateTaskStatus', async ({ taskId, status }) => {
    try {
      const task = await TaskSchema.findByIdAndUpdate(
        taskId,
        { status },
        { new: true }
      );
      if (task) {
        io.emit('taskUpdate', await TaskSchema.find());
      }
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
  });

  // Handle task drag-and-drop updates (for TaskBoard)
  socket.on('taskMoved', async (updatedTasks) => {
    try {
      // Replace all tasks in MongoDB (simplified for demo)
      await TaskSchema.deleteMany({});
      await TaskSchema.insertMany(updatedTasks);
      io.emit('taskUpdate', updatedTasks);
    } catch (err) {
      console.error('Failed to update tasks:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

  socket.on('draw', (data) => {
    socket.broadcast.emit('draw', data); // Broadcast to all other clients
  });

  // Clear canvas
  socket.on('clearCanvas', () => {
    io.emit('clearCanvas'); // Broadcast to all clients
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

   

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));