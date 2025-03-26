const express = require('express');
const router = express.Router();
const Announcement = require('../models/AnnouncementSChema');

router.get('/', async (req, res) => {
  const announcements = await Announcement.find();
  res.json(announcements);
});

router.post('/', async (req, res) => {
  const announcement = new Announcement(req.body);
  await announcement.save();
  req.io.emit('announcementUpdate', await Announcement.find());
  res.status(201).json(announcement);
});

module.exports = router;