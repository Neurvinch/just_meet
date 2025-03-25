const mongoose = require("mongoose");

const messageSchmea = new  mongoose.Schema({
    user :{type : String , required : true},
    text : {type : String , required : true},
    createdAt : {type :Date , default : Date.now}
});

module.exports = mongoose.model("Message" , messageSchmea);