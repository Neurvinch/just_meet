const express = require('express');
const AnnouncementSChema = require('../models/AnnouncementSChema');
const router = express.Router();


// GET all announcements
router.get('/announcements', async (req, res) => {
  try {
    const announcements = await AnnouncementSChema.find();
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
});

// POST a new announcement
router.post('/announcements', async (req, res) => {
  try {
    const announcement = new AnnouncementSChema(req.body);
    await announcement.save();
    res.status(201).json(announcement);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create announcement' });
  }
});

module.exports = router;