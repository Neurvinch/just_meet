const jwt = require("jsonwebtoken");
const {doHash , doHashValidation, hmacProcess} = require("../utils/hashing")

const userModel = require("../models/UserModel")

exports.register = async () => {
    const {name , password , email } = req.body;
    
    try {
        const existingUser = await userModel.findOne({name })

        if(existingUser) {
            return res.status(400).json({
                success : false ,
                message : "User already exists"
            })
        }
         
         const hashedPassword = await doHash(password ,10) ;

         const newUser = new userModel({
            name ,
            password :hashedPassword,
            email
         });

         const savedUser = await newUser.save();
         const userWithoutPassword = savedUser.toObject();
         delete userWithoutPassword.password;

         res.status(200).json({
              success : true ,
               message : "User saved successfully",
               user : userWithoutPassword,
         })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false ,
            message : "Something went wrong"
        });
        
    }
};

const login   = async () => {
    
}
