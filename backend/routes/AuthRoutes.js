const express =  require("express");
const {signOut, register , login} = require("../controllers/AuthControllers");

const { identifer} = require("../Middlewares/Identifier");

const router = express.Router();

router.post("/register" , register);
router.post("/login" , login);
router.get("/logout" , identifer , signOut);