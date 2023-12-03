const mongoose = require('mongoose');

const followerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    followers: [{
        type: String,
        required: true 
    }]
});

const Followers = mongoose.model('followers', followerSchema);

module.exports = Followers;
