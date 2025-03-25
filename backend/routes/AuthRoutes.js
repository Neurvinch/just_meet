const express =  require("express");
const {signOut, register , login , changePassword , sendForgotPasswordCode , verifyForgotPasswordCode} = require("../controllers/AuthControllers");

const { identifer} = require("../Middlewares/Identifier");

const router = express.Router();

router.post("/register" , register);
router.post("/login" , login);
router.get("/logout" , identifer , signOut);

router.patch(
    "/changePassword",
    identifer(["student", "hod", "staff"]),
    changePassword
  );
  
  router.post(
    "/sendForgotPassCode",
  
    sendForgotPasswordCode
  );
  
  router.post(
    "/verifyForgotPassCode",
  
    verifyForgotPasswordCode
  );

module.exports =  router;