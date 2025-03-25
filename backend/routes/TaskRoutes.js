const express = require('express');
const router = express.Router();
const Task = require('../models/TaskSchema');

router.get('/', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

router.post('/', async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  req.io.emit('taskUpdate', await Task.find());
  res.status(201).json(task);
});

router.put('/:id', async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  req.io.emit('taskUpdate', await Task.find());
  res.json(task);
});

module.exports = router;
