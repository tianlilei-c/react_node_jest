const express = require('express');
const router = express.Router();
const Profile = require('../../models/profile')

router.put('/', async (req, res) => {
    try {
        const { avatar } = req.body;
        let userid = req.user._id
        const userProfile = await Profile.findOne({ user: userid });
        if (userProfile && userProfile!=undefined) {
            userProfile.avatar = avatar
            await userProfile.save();
            res.status(200).json({ message: 'update avatar', userProfile });
        } else {
            res.status(500).json({ msg: "error user" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message, msg: "update error" });
    }
});


// router.get('/:username', async (req, res) => {
//     try {
//         const username = req.params.username;
//         const userProfile = await Profile.findOne({ username })
//         if (userProfile) {
//             res.send(JSON.stringify(userProfile));
//         } else {
//             res.status(500).json({ error: 'user is not find' });
//         }
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });
module.exports = router;
