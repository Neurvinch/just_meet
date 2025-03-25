const express = require("express");
const { createOrder ,verifyPayement } = require("../controllers/PayementController");
const router = express.Router();
const { identifer } = require("../Middlewares/Identifier");

router.post("/payement/create-order" , identifer() , createOrder);

router.post("/payement/verify", identifer() , verifyPayement);

module.exports = router;