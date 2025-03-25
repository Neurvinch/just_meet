exports.sendMessage = (req, res) => {
    const { message } = req.body;
    res.json({ success: true, message });
  };
  