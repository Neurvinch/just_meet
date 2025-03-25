const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { 
    type: String, 
    enum: ['todo', 'inProgress', 'done'], 
    default: 'todo' 
  },
  createdBy: { type: String, required: true }, // User who created the task
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Task', taskSchema);