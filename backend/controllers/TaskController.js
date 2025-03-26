const express = require('express');
const TaskSchema = require('../models/TaskSchema');
const router = express.Router();
 // Assuming a Mongoose model for tasks

// GET all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await TaskSchema.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// POST a new task
router.post('/', async (req, res) => {
  try {
    const task = new TaskSchema(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

module.exports = router;