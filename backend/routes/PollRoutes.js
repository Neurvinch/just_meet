const express = require('express');
const router = express.Router();
const Poll = require('../models/PollSchema');

// Get all polls
router.get('/', async (req, res) => {
  try {
    const polls = await Poll.find();
    res.json(polls);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch polls' });
  }
});

// Create a new poll
router.post('/', async (req, res) => {
  try {
    const poll = new Poll(req.body);
    await poll.save();
    req.io.emit('pollUpdate', await Poll.find()); // Broadcast updated polls
    res.status(201).json(poll);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create poll' });
  }
});

// Vote on a poll
router.post('/:id/vote', async (req, res) => {
  try {
    const { optionIndex } = req.body;
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ error: 'Poll not found' });
    poll.options[optionIndex].votes += 1;
    await poll.save();
    req.io.emit('pollUpdate', await Poll.find()); // Broadcast updated polls
    res.json(poll);
  } catch (err) {
    res.status(500).json({ error: 'Failed to vote' });
  }
});

module.exports = router;