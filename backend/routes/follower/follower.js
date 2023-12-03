const express = require('express');
const router = express.Router();
const Followers = require('../../models/followerlist');
const Profile = require('../../models/profile');
const User = require('../../models/user');

router.post('/', async (req, res) => {
    try {
        const { followerUsername } = req.body;
        let username = req.user.username;
        const userExists = await User.findOne({ username: followerUsername });
        const profileExists = await Profile.findOne({ username: followerUsername });
        if (!userExists || !profileExists) {
            return res.status(381).json({ error: 'User to be followed does not exist' });
        }
        const alreadyFollowed = await Followers.findOne({
            username,
            followers: { $in: [followerUsername] }
        });
        if (alreadyFollowed) {
            return res.status(400).json({ error: 'Already following this user' });
        }
        const followersRecord = await Followers.findOneAndUpdate(
            { username },
            { $addToSet: { followers: followerUsername } },
            { new: true, upsert: true }
        );
        res.status(201).json({ message: 'Follower added successfully', followersRecord });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while adding a follower' });
    }
});

router.get('/', async (req, res) => {
    try {
        let username = req.user.username;
        const followersRecord = await Followers.findOne({ username });
        if (!followersRecord) {
            return res.status(403).json({ error: 'Followers not found' });
        }
        const profiles = await Promise.all(
            followersRecord.followers.map(async (followerUsername) => {
                return await Profile.findOne({ username: followerUsername });
            })
        );
        const validProfiles = profiles.filter(profile => profile !== null);
        res.status(200).json(validProfiles);
    } catch (error) {
        // console.error(error);
        res.status(500).json({ error: 'An error occurred while retrieving follower profiles' });
    }
});

router.delete('/', async (req, res) => {
    try {
        const { followerUsername } = req.body;
        let username = req.user.username;

        const followersRecord = await Followers.findOne({ username, followers: { $in: [followerUsername] } });
        if (!followersRecord) {
            return res.status(404).json({ error: 'Follower not found in your list' });
        }

        await Followers.findOneAndUpdate(
            { username },
            { $pull: { followers: followerUsername } }
        );

        res.status(200).json({ message: 'Follower removed successfully' });
    } catch (error) {
        // console.error(error);
        res.status(500).json({ error: 'An error occurred while removing a follower' });
    }
});



module.exports = router;
