exports.joinRoom = (req, res) => {
    const { roomId } = req.body;
    res.json({ message: `Joined room ${roomId}` });
  };
  