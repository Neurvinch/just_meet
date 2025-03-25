const express = require("express");
const { joinRoom } = require("../controllers/roomController");

const router = express.Router();
router.post("/join", joinRoom);

module.exports = router;
