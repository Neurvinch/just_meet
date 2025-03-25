const MessageSchema = require("../models/Message.Schema")


io.in('connection' , async(socket) => {

    try {
        const message = await MessageSchema.find().sort({createdAt : 1});
        socket.emit('initmessages' , message);
        
    } catch (error) {
        console.log(error);
        
    }
})

socket.on('message', async (msg) => {
    try {
      const message = new Message(msg);
      await message.save();
      io.emit('message', message); // Broadcast to all clients
    } catch (err) {
      console.error('Failed to save message', err);
    }
  });

  socket.on('vote', async ({ pollId, option }) => {
    try {
      const poll = await Poll.findById(pollId);
      if (poll) {
        const opt = poll.options.find(o => o.name === option);
        if (opt) {
          opt.votes++;
          await poll.save();
          io.emit('pollUpdate', await Poll.find()); // Broadcast updated polls
        }
      }
    } catch (err) {
      console.error('Failed to update poll', err);
    }
  });
