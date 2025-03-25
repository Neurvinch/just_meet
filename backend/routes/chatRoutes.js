const express = require('express');
const router = express.Router();
const Message = require('../models/MessageSchema');

router.get('/messages', async (req, res) => {
  try {
     const messages = await Message.find().sort({ createdAt: -1 }).limit(50);
  res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching messages',

    })
    
  }
 
});

router.post('/messages', async (req, res) => {
  try {
     const message = new Message(req.body);
  await message.save();
  req.io.emit('message', message);
  res.status(201).json(message);
  } catch (error) {
    res.status(500).json({
      message: 'Error saving message',
      })
    
  }
 
});

module.exports = router;