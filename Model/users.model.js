const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let Users = new Schema({
    email : {
        type : String
    },
    name : {
        type : String,
    },
    username : {
        type : String,
    },
    password : {
        type: String
    },
});

module.exports = mongoose.model('Users', Users);