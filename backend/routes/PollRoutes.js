const express = require('express');
const router = express.Router();
const Poll = require('../models/PollSchema');

router.get('/', async (req, res) => {
  const polls = await Poll.find();
  res.json(polls);
});

router.post('/', async (req, res) => {
  const poll = new Poll(req.body);
  await poll.save();
  req.io.emit('pollUpdate', await Poll.find());
  res.status(201).json(poll);
});

router.post('/:id/vote', async (req, res) => {
  const poll = await Poll.findById(req.params.id);
  poll.options[req.body.optionIndex].votes += 1;
  await poll.save();
  req.io.emit('pollUpdate', await Poll.find());
  res.json(poll);
});

module.exports = router;