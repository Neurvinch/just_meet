const jwt = require("jsonwebtoken");
const {doHash , doHashValidation, hmacProcess} = require("../utils/hashing")

const userModel = require("../models/UserModel")

exports.register = async (req , res) => {
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

 exports.login   = async (req, res) => {
    const {name , password} = req.body;

    try {

        const existingUser = await userModel.findOne({name }).select("+password");
         if(!existingUser) {
             return res.status(400).json({
                 success : false ,
                 message : "User does not exist"
             })      
               }

               const isPasswordValid = await doHashValidation(password , existingUser.password);

               if(!isPasswordValid){
                return res.status(401).json({
                     success :  false , message : "Make sure your Password Valid"
                })
               }

               const token = jwt.sign(
                {
                    userId : existingUser._id,
                    name : existingUser.name

                },
                process.env.SECRET_KEY ,
                {expiresIn : "1d"}
               );

               res.cookie("Authorization", `Bearer ${token}`, {
                httpOnly : true,
                expires : new Date(Date.now() + 3600000 ),
                secure : process.env.NODE_ENV === "production",
               })
        
               return res.status(200).json({
                success : true ,
                message: "You are in !",
                token : token,
               })

    } catch (error) {
          return res.status(500).json({
            success : false ,
            message : "Internal Server Error"
          })
    }

};

exports.signOut = async (req,res) => {
    res.clearCookie("Authorization");
    res.status(200).json({
        success : true ,
        message : "You are logged out !"
    })
}
