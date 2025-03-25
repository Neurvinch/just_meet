const mongoose = require("mongoose");

const taskSchema =  new mongoose.Schema({
    title : String,
    description : {type : String },
    status :  {type : String , default : 'todo'},
    CreatedAt : { type : Date , default : Date.now},
})

module.exports = mongoose.model('Task' , taskSchema);