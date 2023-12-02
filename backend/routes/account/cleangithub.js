const express = require('express');
const router = express.Router();
const Profile = require('../../models/profile')

router.put('/', async (req, res) => {
    try {
        const { username } = req.body;
        const userProfile = await Profile.findOne({ username });
        if (userProfile) {
            userProfile.userGithubID = ''
            await userProfile.save();
            res.status(200).json({ message: 'update successful', userProfile });
        } else {
            res.status(500).json({ msg: "error user" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message, msg: "update error" });
    }
});

module.exports = router;