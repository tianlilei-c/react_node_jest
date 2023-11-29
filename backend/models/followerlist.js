const mongoose = require('mongoose');

const followerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    followers: [{
        type: String,//也是username，不过是被关注者的
        required: true 
    }]
});

const Followers = mongoose.model('followers', followerSchema);

module.exports = Followers;
