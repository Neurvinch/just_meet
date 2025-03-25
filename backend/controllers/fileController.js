exports.uploadFile = (req, res) => {
    const { fileName, fileData } = req.body;
    res.json({ success: true, fileName, fileData });
  };
  