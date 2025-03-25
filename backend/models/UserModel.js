const mongoose = require ("mongoose");

const userSchema = new mongoose.Schema({

    name : {
        type : String,
        required: [true , "Please Enter your Name To Surf "],
        unique : true,

    },

    email : {
        type: String,
        required : [true , "Give me your Email "],
            unique : true,
    },
     password : {
        type : String,
        required : [true , "Please Enter your Password "],
         trim : true,
         select : false,
     },
     avatar : {
        type : String,
        default : "default.jpg",
        
     },
     verified : {
        type : Boolean,
        default : false,
     },
     verificationCode : {
        type : String,
        select : false ,
     },

     verificationCodeValidation : {
        type : Number,
        select : false
     },
     forgotPasswordCode : {
        type : String,
        select : false
     },
     forgotPasswordCodeValidation : {
        type : Number,
        select : false
     },
    

}  ,
{
    timestamps : true ,
}
)

module.exports = mongoose.model("User" , userSchema)