const express = require("express");
const { createOrder ,verifyPayement } = require("../controllers/PayementController");
const router = express.Router();
// const { identifer } = require("../Middlewares/Identifier");

router.post("/payement/create-order" ,   createOrder);

router.post("/payement/verify",   verifyPayement);

module.exports = router;