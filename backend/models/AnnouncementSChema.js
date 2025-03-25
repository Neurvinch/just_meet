const mongoose = require("mongoose");

const announcementSChema = new mongoose.Schema({
    title : {type : String , required : true},
    content : {type : String , required : true},
    createdBy : {type : String , required : true},
    createdAt : {type : Date , default : Date.now}
});

module.exports = mongoose.model("Announcement", announcementSChema);